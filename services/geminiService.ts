import { GoogleGenAI, Type } from "@google/genai";
import type { Lesson, LessonTopic, Difficulty, Question } from '../types';

// Fix: Initialize GoogleGenAI client directly with the API key from environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Fix: Updated model name to align with current guidelines for gemini flash lite.
const lessonGenerationModel = 'gemini-flash-lite-latest';
const imageGenerationModel = 'imagen-4.0-generate-001';

const lessonPlanSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      level: { type: Type.NUMBER },
      icon: { type: Type.STRING, description: "A single emoji representing the lesson topic." },
    },
    required: ['title', 'level', 'icon'],
  },
};

const lessonSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['image-choice', 'sentence-construction'] },
          questionTitle: { type: Type.STRING, description: "The main question text, localized in the user's native language." },
          // Image-choice specific
          questionText: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING },
          // Sentence-construction specific
          phraseToTranslate: { type: Type.STRING },
          correctAnswerInOrder: { type: Type.ARRAY, items: { type: Type.STRING } },
          wordBank: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['type', 'questionTitle']
      },
    },
  },
  required: ['title', 'questions'],
};

export const generateLessonPlan = async (language: string, difficulty: Difficulty): Promise<LessonTopic[]> => {
  const lessonCount = difficulty === 'Beginner' ? 5 : difficulty === 'Intermediary' ? 7 : 10;
  const prompt = `You are a curriculum designer for a language learning app. For a ${difficulty} level student learning ${language}, generate a lesson plan with ${lessonCount} sequential topics.
    The topics should be appropriate for a ${difficulty} learner. For example, 'Greetings and Introductions' or 'The Alphabet' for beginners, or 'Complex Tenses' for experts.
    For each topic, provide:
    1. "title": A concise topic name (e.g., "Common Objects", "Food", "Animals").
    2. "level": A sequential level number, starting from 1.
    3. "icon": A single, relevant emoji that represents the topic.
    The output must be a JSON array of objects, strictly following the provided schema.`;
  
  try {
    const response = await ai.models.generateContent({
      model: lessonGenerationModel,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: lessonPlanSchema,
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw new Error("Failed to generate lesson plan. Please try again.");
  }
};


export const generateLesson = async (nativeLanguage: string, language: string, topic: LessonTopic, difficulty: Difficulty): Promise<Lesson> => {
  const prompt = `You are an expert language teacher creating a fun, ${difficulty}-level lesson for a native ${nativeLanguage} speaker who is learning ${language}. The lesson focuses on the topic of "${topic.title}".
    Generate a JSON object for a lesson with 5 questions.
    The lesson must contain a mix of question types: 3 'image-choice' questions and 2 'sentence-construction' questions.

    For 'image-choice' questions, provide:
    1. "type": "image-choice"
    2. "questionTitle": A generic question in ${nativeLanguage}, like "What is this?" or "Which of these is correct?". Do NOT include the answer in the question.
    3. "questionText": The core word in ${language} the user is learning. This is the correct answer.
    4. "imagePrompt": A simple, clear prompt for an image generation model representing 'questionText'. Style: friendly, cute, vector illustration. CRITICALLY, the prompt must not contain ANY text, letters, or words.
    5. "options": An array of 4 strings in ${language}, with one correct answer and three plausible distractors.
    6. "correctAnswer": The correct string from the options.

    For 'sentence-construction' questions, provide:
    1. "type": "sentence-construction"
    // Fix: The question title should be in the user's native language for consistency.
    2. "questionTitle": The question in ${nativeLanguage}, like "Write this in ${language}:".
    3. "phraseToTranslate": A simple phrase in ${nativeLanguage} for the user to translate.
    4. "correctAnswerInOrder": An array of strings representing the correct translation in ${language}, in order.
    5. "wordBank": An array of strings containing all the correct words plus 3-4 distractor words. The words should be shuffled.

    Ensure vocabulary fits the topic "${topic.title}" and the ${difficulty} level.
    The JSON output must strictly follow the provided schema.`;

  try {
    const response = await ai.models.generateContent({
      model: lessonGenerationModel,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: lessonSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const lessonData = JSON.parse(jsonText);
    
    if (!lessonData.questions || lessonData.questions.length < 3) {
        throw new Error("Generated lesson has too few questions.");
    }

    // AI can sometimes make mistakes, so we ensure the word bank for sentence construction is valid
    lessonData.questions.forEach((q: Question) => {
      if (q.type === 'sentence-construction') {
        const correctWords = new Set(q.correctAnswerInOrder);
        for(const word of correctWords) {
          if (!q.wordBank.includes(word)) {
            q.wordBank.push(word);
          }
        }
      }
    });

    return lessonData as Lesson;
  } catch (error) {
    console.error("Error generating lesson:", error);
    throw new Error("Failed to generate lesson. The AI might be busy, please try again.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: imageGenerationModel,
      prompt: `${prompt}, cute simple vector illustration, duolingo style, plain background. IMPORTANT: The image must not contain any text, words, letters, or characters. Absolutely no text.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image.");
  }
};