declare global {
  interface Window {
    webkitSpeechRecognition: SpeechRecognitionConstructor;
    SpeechRecognition: SpeechRecognitionConstructor;
  }

  interface SpeechRecognitionConstructor {
    new (): ISpeechRecognition;
  }

  interface ISpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    onaudioend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onaudiostart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onsoundstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    abort(): void;
    start(): void;
    stop(): void;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
  }

  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    length: number;
    isFinal: boolean;
  }

  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
}

export {};