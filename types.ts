export interface Translations {
  welcomeTo: string;
  selectNativeLanguage: string;
  chooseLanguageToLearn: string;
  chooseYourLevel: string;
  levelDescription: string;
  beginner: string;
  beginnerDesc: string;
  intermediary: string;
  intermediaryDesc: string;
  expert: string;
  expertDesc: string;
  learn: string;
  buildingCurriculum: string;
  oops: string;
  couldNotLoadLessonPlan: string;
  chooseAnotherLanguage: string;
  craftingYourLesson: string;
  backToMenu: string;
  check: string;
  continue: string;
  youAreCorrect: string;
  incorrect: string;
  excellentWork: string;
  goodJob: string;
  keepPracticing: string;
  lessonComplete: string;
  yourScore: string;
  correct: string;
  practiceAgain: string;
  mainMenu: string;
  level: string;
  writeThisIn: string;
  orSpeakTheSentence: string;
  listening: string;
  processing: string;
  speechError: string;
  micNotSupported: string;
  micPermissionDenied: string;
}

export type QuestionType = 'image-choice' | 'sentence-construction';

export interface BaseQuestion {
  type: QuestionType;
  questionTitle: string;
}

export interface ImageChoiceQuestion extends BaseQuestion {
  type: 'image-choice';
  questionText: string;
  imagePrompt: string;
  options: string[];
  correctAnswer: string;
}

export interface SentenceConstructionQuestion extends BaseQuestion {
  type: 'sentence-construction';
  phraseToTranslate: string; // The phrase in the native language (e.g., English)
  correctAnswerInOrder: string[]; // The translated phrase in order
  wordBank: string[]; // Words to choose from
}

export type Question = ImageChoiceQuestion | SentenceConstructionQuestion;

export interface Lesson {
  title: string;
  questions: Question[];
}

export interface LessonTopic {
  title: string;
  level: number;
  icon: string; // emoji
}

export type AppState = 'native_language_select' | 'language_select' | 'difficulty_select' | 'lesson_plan' | 'lesson' | 'results';

export type AnswerStatus = 'unanswered' | 'checking' | 'correct' | 'incorrect';

export interface Language {
    name: string;
    flag: string;
}

export type Difficulty = 'Beginner' | 'Intermediary' | 'Expert';