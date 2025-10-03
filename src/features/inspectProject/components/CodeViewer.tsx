'use client';

import React, { useEffect } from 'react';

import Editor from '@monaco-editor/react';

import { useTheme } from '@/contexts/ThemeContext';
import { useBlockly } from '@/lib/blockly';
import { GenerationMode } from '@/lib/blockly/python/generationContext';
import { pythonGenerator } from '@/lib/blockly/python/generator';

export function CodeViewer() {
  const { workspace } = useBlockly();
  const [code, setCode] = React.useState('');
  const { themeMode } = useTheme();

  useEffect(() => {
    if (!workspace) return;

    const generateCode = () => {
      const rawCode = pythonGenerator.workspaceToCode(workspace, {
        mode: GenerationMode.ForViewing,
      });
      setCode(rawCode);
    };

    // ワークスペースの変更をリッスンしてコードを再生成
    workspace.addChangeListener(generateCode);
    // 初期表示
    generateCode();

    return () => {
      workspace.removeChangeListener(generateCode);
    };
  }, [workspace]);

  return (
    <Editor
      height="100%"
      language="python"
      value={code}
      theme={themeMode === 'dark' ? 'vs-dark' : 'light'}
      options={{
        readOnly: true,
        lineNumbers: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      }}
    />
  );
}
