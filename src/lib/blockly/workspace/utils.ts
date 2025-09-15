/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Blockly from "blockly/core";
import { PythonGenerator } from 'blockly/python';

const SEPARATOR = '# --- BLOCKLY TEMPLATE ---';

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
  const parts = script.split(SEPARATOR);
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

export function createShadowBlock(type: string, fields: Record<string, any> = {}) {
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
