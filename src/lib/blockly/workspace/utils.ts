/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Blockly from 'blockly/core';
import { PythonGenerator } from 'blockly/python';

import {
  GenerationMode,
  getGenerationContext,
} from '../python/generationContext';

const SEPARATOR = '# --- BLOCKLY TEMPLATE ---';
const FUNCTION_START = '# --- BLOCKLY FUNC ---';
const FUNCTION_END = '# --- BLOCKLY FUNC END ---';
const DEFINITION_START = '# --- BLOCKLY DEFINITIONS (.*?) ---';
const DEFINITION_END = '# --- BLOCKLY DEFINITIONS END ---';
const GEN_START = '# --- BLOCKLY GEN (\\w+) ---';
const GEN_END = '# --- BLOCKLY GEN END ---';

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]]/g, '\\$&');
}

/**
 * GENディレクティブを現在の生成モードに基づいて解決します。
 * @param script テンプレート文字列
 * @returns GENディレクティブが解決されたスクリプト
 */
function processGenDirectives(script: string): string {
  const { mode } = getGenerationContext();
  const regex = new RegExp(`${GEN_START}([\\s\\S]*?)${GEN_END}\n?`, 'gm');
  return script.replaceAll(regex, (match, genModeStr, innerCode) => {
    const genMode = GenerationMode[genModeStr as keyof typeof GenerationMode];
    if (genMode !== undefined && mode & genMode) {
      return innerCode;
    }
    return '';
  });
}

export function splitFunctions(script: string) {
  const processedScript = processGenDirectives(script);
  const regexp = new RegExp(
    `${escapeRegExp(FUNCTION_START)}[\\s\\S]*?${escapeRegExp(FUNCTION_END)}`,
    'g',
  );
  const matches = processedScript.match(regexp) || [];
  const funcs = matches.map((m) =>
    m.replace(FUNCTION_START, '').replace(FUNCTION_END, '').trim(),
  );

  let usage = processedScript;
  for (const m of matches) {
    usage = usage.replace(m, '');
  }

  return { funcs, usage };
}

/**
 * テンプレートを処理し、ヘッダーからimportを登録し、テンプレート本体を返します。
 * @param script テンプレート文字列
 * @param generator Blocklyジェネレータ
 * @returns テンプレート本体
 */
export function stripImports(
  script: string,
  generator: PythonGenerator,
): string {
  const processedScript = processGenDirectives(script);
  const parts = processedScript.split(SEPARATOR);
  const header = parts[0];
  const body = parts.length > 1 ? parts[1] : '';

  const importRegex = /(?:import|from) .*(?:\n|$)/g;
  const imports = header.match(importRegex) || [];
  for (const imp of imports) {
    const cleanImport = imp.trim();
    if (cleanImport) {
      (generator as any).definitions_[cleanImport] = cleanImport;
    }
  }

  return body.trim();
}

export function stripDefinitions(
  script: string,
  generator: PythonGenerator,
): string {
  const processedScript = processGenDirectives(script);
  const regexp = new RegExp(
    `${DEFINITION_START}([\\s\\S]*?)${DEFINITION_END}`,
    'g',
  );

  let remainingScript = processedScript;
  let match;
  // execのループでマッチした部分を処理していく
  while ((match = regexp.exec(processedScript)) !== null) {
    const defKey = match[1].trim();
    const defBody = match[2].trim();

    // キーと中身があれば、definitions_ に追加
    if (defKey && defBody) {
      (generator as any).definitions_[defKey] = defBody;
    }

    // 元のスクリプトから定義部分を削除
    remainingScript = remainingScript.replace(match[0], '');
  }

  // 定義を削除した残りのコードを返す
  return remainingScript.trim();
}

/**
 * スクリプト内のプレースホルダーを置換します。
 * @param script プレースホルダーを含むスクリプト文字列
 * @param replacements 置換対象のキーと値のオブジェクト
 * @returns プレースホルダーが置換されたスクリプト
 */
export function applyPlaceholders(
  script: string,
  replacements: { [key: string]: string },
): string {
  let result = script;
  for (const placeholder in replacements) {
    result = result.replace(
      new RegExp(placeholder, 'g'),
      replacements[placeholder],
    );
  }
  return result;
}

export function createShadowBlock(
  type: string,
  fields: Record<string, any> = {},
) {
  const shadow = Blockly.utils.xml.createElement('shadow');
  shadow.setAttribute('type', type);

  Object.entries(fields).forEach(([name, value]) => {
    const field = Blockly.utils.xml.createElement('field');
    field.setAttribute('name', name);
    field.textContent = String(value);
    shadow.appendChild(field);
  });

  return shadow;
}
