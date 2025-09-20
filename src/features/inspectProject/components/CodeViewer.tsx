'use client';

import React, { useEffect } from 'react';

import { pythonGenerator } from '@/lib/blockly/python/generator';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useBlockly } from '@/lib/blockly';

SyntaxHighlighter.registerLanguage('python', python);

export function CodeViewer() {
  const { workspace } = useBlockly();
  const [code, setCode] = React.useState('');

  useEffect(() => {
    if (!workspace) return;

    const generateCode = () => {
      const rawCode = pythonGenerator.workspaceToCode(workspace);
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
    <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers>
      {code}
    </SyntaxHighlighter>
  );
}
