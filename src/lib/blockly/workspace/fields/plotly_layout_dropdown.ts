import * as Blockly from 'blockly/core';

export enum PropertyField {
  Text = 'Text',
  Colour = 'Colour',
}

export enum PropertyValue {
  Title = 'title',
  XAxisTitle = 'xaxis_title',
  YAxisTitle = 'yaxis_title',
  PaperBgColor = 'paper_bgcolor',
  PlotBgColor = 'plot_bgcolor',
  FontColor = 'font_color',
}

export const PLOTLY_LAYOUT_PROPERTIES = [
  { name: 'タイトル', value: PropertyValue.Title, field: PropertyField.Text },
  {
    name: 'x軸ラベル',
    value: PropertyValue.XAxisTitle,
    field: PropertyField.Text,
  },
  {
    name: 'y軸ラベル',
    value: PropertyValue.YAxisTitle,
    field: PropertyField.Text,
  },
  {
    name: '背景色',
    value: PropertyValue.PaperBgColor,
    field: PropertyField.Colour,
  },
  {
    name: 'プロット背景色',
    value: PropertyValue.PlotBgColor,
    field: PropertyField.Colour,
  },
  {
    name: '文字色',
    value: PropertyValue.FontColor,
    field: PropertyField.Colour,
  },
];

export class PlotlyLayoutDropdown extends Blockly.FieldDropdown {
  constructor() {
    super(PLOTLY_LAYOUT_PROPERTIES.map((p) => [p.name, p.value]));
  }
}

Blockly.fieldRegistry.register('plotly_layout_dd', PlotlyLayoutDropdown);
