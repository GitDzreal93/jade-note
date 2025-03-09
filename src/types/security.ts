export interface SecurityConfig {
  watermark?: {
    enabled: boolean;
    text: string;
    color?: string;
    fontSize?: string;
    opacity?: number;
    rotate?: number;
  };
  keyboardShortcuts?: {
    enabled: boolean;
    preventDefault?: {
      ctrlC?: boolean;
      ctrlS?: boolean;
      ctrlP?: boolean;
      ctrlShiftI?: boolean;
      f12?: boolean;
    };
  };
  devTools?: {
    enabled: boolean;
    message?: string;
  };
} 