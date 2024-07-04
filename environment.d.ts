declare global {
  interface Window {
    eruda?: {
      init: () => void;
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      DATABASE_URL: string;
      DIRECT_URL: string;

      OPENAI_TOKEN: string;
      OPENAI_ORG: string;
      OPENAI_PROJECT: string;

      GOOGLE_GEMINI_TOKEN: string;

      CRON_SECRET: string;
    }
  }
}

export {};
