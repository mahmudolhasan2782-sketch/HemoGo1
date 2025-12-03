export enum StyleCategory {
  PROFESSIONAL = 'PROFESSIONAL',
  ETHNIC = 'ETHNIC',
  MODEL = 'MODEL',
  CREATIVE = 'CREATIVE'
}

export interface TransformStyle {
  id: string;
  name: string;
  category: StyleCategory;
  promptSuffix: string;
  thumbnail: string;
}

export interface EditorState {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  selectedStyle: string | null;
  thumbnailText: string;
  error: string | null;
}

export type AspectRatio = '16:9' | '1:1' | '9:16' | '4:3';
