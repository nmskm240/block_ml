export enum GenerationMode {
  None = 0,
  /** Pyodide での実行用コードを生成するモード */
  ForRunning = 1 << 0, // 1
  /** CodeViewer での表示用コードを生成するモード */
  ForViewing = 1 << 1, // 2
}

type GenerationContextType = {
  mode: GenerationMode;
};

// デフォルトは表示モード
const context: GenerationContextType = {
  mode: GenerationMode.ForViewing,
};

export const setGenerationContext = (options: Partial<GenerationContextType>) => {
  Object.assign(context, options);
};

export const getGenerationContext = (): Readonly<GenerationContextType> => {
  return context;
};
