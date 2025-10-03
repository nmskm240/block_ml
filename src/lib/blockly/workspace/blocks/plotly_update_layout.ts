import { FieldColourHsvSliders } from '@blockly/field-colour-hsv-sliders';
import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';
import { match } from 'ts-pattern';

import {
  PlotlyLayoutDropdown,
  PLOTLY_LAYOUT_PROPERTIES,
  PropertyField,
  PropertyValue,
} from '../fields/plotly_layout_dropdown';
import { VariableTypes } from '../types';
import {
  applyPlaceholders,
  createShadowBlock,
  stripDefinitions,
  stripImports,
} from '../utils';
import fontColorTemplate from './template/plotly_update_layout/font_color.py';
import paperBgcolorTemplate from './template/plotly_update_layout/paper_bgcolor.py';
import plotBgcolorTemplate from './template/plotly_update_layout/plot_bgcolor.py';
import titleTemplate from './template/plotly_update_layout/title.py';
import xaxisTitleTemplate from './template/plotly_update_layout/xaxis_title.py';
import yaxisTitleTemplate from './template/plotly_update_layout/yaxis_title.py';

export const PLOTLY_UPDATE_LAYOUT = 'plotly_update_layout';

type UpdateLayoutBlock = Blockly.Block & {
  updateShape_: (this: UpdateLayoutBlock, property: string) => void;
};

enum Args {
  Figure = 'FIGURE',
  Property = 'PROPERTY',
  Value = 'VALUE',
}

Blockly.Blocks[PLOTLY_UPDATE_LAYOUT] = {
  init: function (this: UpdateLayoutBlock) {
    this.appendValueInput(Args.Figure)
      .appendField('グラフ')
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'fig' }))
      .setCheck(VariableTypes.Figure);

    const dropdown = new PlotlyLayoutDropdown();
    dropdown.setValidator((value) => {
      this.updateShape_(value as PropertyValue);
      return value;
    });
    this.appendDummyInput()
      .appendField('の')
      .appendField(dropdown, Args.Property);

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip('グラフのレイアウト項目を更新します。');

    // 初回描画のために呼び出し
    this.updateShape_(this.getFieldValue(Args.Property));
  },

  updateShape_: function (this: UpdateLayoutBlock, property: PropertyValue) {
    // 既存の値入力フィールドがあれば削除
    if (this.getInput(Args.Value)) {
      this.removeInput(Args.Value);
    }

    const propertyInfo = PLOTLY_LAYOUT_PROPERTIES.find(
      (p) => p.value === property,
    );
    if (!propertyInfo) return;

    const field = match(propertyInfo.field)
      .with(PropertyField.Text, () => new Blockly.FieldTextInput(''))
      .with(PropertyField.Colour, () => new FieldColourHsvSliders('#ffffff'))
      .exhaustive();
    this.appendDummyInput(Args.Value)
      .appendField('を')
      .appendField(field, Args.Value)
      .appendField('にする');
  },
};

pythonGenerator.forBlock[PLOTLY_UPDATE_LAYOUT] = (block, generator) => {
  const fig = generator.valueToCode(block, Args.Figure, Order.NONE);
  const property = block.getFieldValue(Args.Property) as PropertyValue;
  const value = block.getFieldValue(Args.Value);

  const template = match(property)
    .with(PropertyValue.Title, () => titleTemplate)
    .with(PropertyValue.XAxisTitle, () => xaxisTitleTemplate)
    .with(PropertyValue.YAxisTitle, () => yaxisTitleTemplate)
    .with(PropertyValue.PaperBgColor, () => paperBgcolorTemplate)
    .with(PropertyValue.PlotBgColor, () => plotBgcolorTemplate)
    .with(PropertyValue.FontColor, () => fontColorTemplate)
    .exhaustive();

  let body = stripImports(template, generator);
  body = stripDefinitions(body, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_FIGURE__: fig,
    __BLOCKLY_VALUE__: value,
  });

  return `${code}\n`;
};
