'use client';

import React, { useRef } from 'react';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import { IconButton, Tooltip } from '@mui/material';
import * as Blockly from 'blockly/core';

import { useBlockly } from '@/lib/blockly';

export function ImportButton() {
  const { workspace } = useBlockly();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspace) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File could not be read.');
        }
        const state = JSON.parse(text);
        // ロードする前に現在のワークスペースをクリアする
        workspace.clear();
        Blockly.serialization.workspaces.load(state, workspace);
      } catch (error) {
        console.error('Error loading workspace:', error);
        alert('プロジェクトファイルの読み込みに失敗しました。');
      }
    };
    reader.readAsText(file);

    // 同じファイルを連続でアップロードできるように、inputの値をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="application/json"
      />
      <Tooltip title="JSONからインポート">
        <span>
          <IconButton onClick={handleImportClick} disabled={!workspace}>
            <FileUploadIcon />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}
