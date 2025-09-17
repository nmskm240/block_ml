/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/dataframe_create_with.py';

export const DATAFRAME_CREATE_WITH = 'dataframe_create_with';

const ITEM_BLOCK_TYPE = 'dataframe_create_with_item';

Blockly.Blocks[ITEM_BLOCK_TYPE] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput().appendField('列');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(210);
    this.setTooltip('DataFrameの一列を表します。');
    this.contextMenu = false;
  },
};

const CONTAINER_BLOCK_TYPE = 'dataframe_create_with_container';

Blockly.Blocks[CONTAINER_BLOCK_TYPE] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput().appendField('列一覧');
    this.appendStatementInput('STACK');
    this.setColour(210);
    this.setTooltip('列を追加、削除、または順序変更します。');
    this.contextMenu = false;
  },
};

interface DataframeCreateWithBlock extends Blockly.BlockSvg {
  itemCount_: number;
  updateShape_: () => void;
  mutationToDom: () => Element;
  domToMutation: (xmlElement: Element) => void;
  decompose: (workspace: Blockly.Workspace) => Blockly.BlockSvg;
  compose: (containerBlock: Blockly.Block) => void;
  saveConnections: (containerBlock: Blockly.Block) => void;
}

Blockly.Blocks[DATAFRAME_CREATE_WITH] = {
  init: function (this: DataframeCreateWithBlock) {
    this.setHelpUrl('');
    this.setColour(210);
    this.appendDummyInput('TITLE').appendField('DataFrameをリストから作成');
    this.itemCount_ = 1;
    this.updateShape_();
    this.setOutput(true, VariableTypes.Dataframe);
    this.setMutator(new Blockly.icons.MutatorIcon([ITEM_BLOCK_TYPE], this));
    this.setTooltip('リストと列名からDataFrameを作成します。');
  },

  mutationToDom: function (this: DataframeCreateWithBlock) {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', String(this.itemCount_));
    return container;
  },

  domToMutation: function (
    this: DataframeCreateWithBlock,
    xmlElement: Element,
  ) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items') || '0', 10);
    this.updateShape_();
  },

  decompose: function (
    this: DataframeCreateWithBlock,
    workspace: Blockly.Workspace,
  ) {
    const containerBlock = workspace.newBlock(
      CONTAINER_BLOCK_TYPE,
    ) as Blockly.BlockSvg;
    containerBlock.initSvg();
    let connection = containerBlock.getInput('STACK')!.connection;
    for (let i = 0; i < this.itemCount_; i++) {
      const itemBlock = workspace.newBlock(ITEM_BLOCK_TYPE) as Blockly.BlockSvg;
      itemBlock.initSvg();
      connection!.connect(itemBlock.previousConnection!);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function (
    this: DataframeCreateWithBlock,
    containerBlock: Blockly.Block,
  ) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');

    const dataConnections: (Blockly.Connection | null)[] = [];
    const nameConnections: (Blockly.Connection | null)[] = [];
    while (itemBlock) {
      dataConnections.push((itemBlock as any).inputData_ ?? null);
      nameConnections.push((itemBlock as any).inputName_ ?? null);
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }

    for (let i = 0; i < this.itemCount_; i++) {
      const dataConnection = this.getInput('ADD' + i)?.connection
        ?.targetConnection;
      if (dataConnection && dataConnections.indexOf(dataConnection) === -1) {
        dataConnection.disconnect();
      }
      const nameConnection = this.getInput('COL_NAME' + i)?.connection
        ?.targetConnection;
      if (nameConnection && nameConnections.indexOf(nameConnection) === -1) {
        nameConnection.disconnect();
      }
    }

    this.itemCount_ = dataConnections.length;
    this.updateShape_();

    for (let i = 0; i < this.itemCount_; i++) {
      if (dataConnections[i]) {
        this.getInput('ADD' + i)?.connection?.connect(dataConnections[i]!);
      }
      if (nameConnections[i]) {
        this.getInput('COL_NAME' + i)?.connection?.connect(nameConnections[i]!);
      }
    }
  },

  saveConnections: function (
    this: DataframeCreateWithBlock,
    containerBlock: Blockly.Block,
  ) {
    let itemBlock = containerBlock.getInputTargetBlock('STACK');
    let i = 0;
    while (itemBlock) {
      const dataInput = this.getInput('ADD' + i);
      const nameInput = this.getInput('COL_NAME' + i);
      (itemBlock as any).inputData_ = dataInput?.connection?.targetConnection;
      (itemBlock as any).inputName_ = nameInput?.connection?.targetConnection;
      i++;
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function (this: DataframeCreateWithBlock) {
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    }

    let i = 0;
    while (this.getInput('ADD' + i) || this.getInput('COL_NAME' + i)) {
      this.removeInput('ADD' + i, true);
      this.removeInput('COL_NAME' + i, true);
      i++;
    }

    for (i = 0; i < this.itemCount_; i++) {
      this.appendValueInput('ADD' + i)
        .setCheck(VariableTypes.Array)
        .appendField(`列 ${i + 1} データ`)
        .setAlign(Blockly.inputs.Align.RIGHT);
      this.appendValueInput('COL_NAME' + i)
        .setCheck(VariableTypes.String)
        .appendField(`列 ${i + 1} 名前`)
        .setAlign(Blockly.inputs.Align.RIGHT);
    }

    if (this.itemCount_ === 0) {
      this.appendDummyInput('EMPTY').appendField('（列を追加してください）');
    }

    this.setInputsInline(false);
  },
} as DataframeCreateWithBlock | { [key: string]: any };

pythonGenerator.forBlock[DATAFRAME_CREATE_WITH] = (block, generator) => {
  const data = [];
  const columns = [];
  for (let i = 0; i < (block as DataframeCreateWithBlock).itemCount_; i++) {
    const colData = generator.valueToCode(block, 'ADD' + i, Order.NONE) || '[]';
    const colName =
      generator.valueToCode(block, 'COL_NAME' + i, Order.NONE) ||
      `'col ${i + 1}'`;
    data.push(colData);
    columns.push(colName);
  }

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_data__: `[ ${data.join(', ')}]`,
    __BLOCKLY_columns__: `[ ${columns.join(', ')}]`,
  });

  return [code, Order.FUNCTION_CALL];
};
