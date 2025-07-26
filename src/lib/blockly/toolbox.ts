import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import '@blockly/block-plus-minus';
import * as df from './blocks/dataframe';
import * as sk from './blocks/sklearn';
import * as ch from './blocks/chart';

export const mlToolbox: Blockly.utils.toolbox.ToolboxDefinition = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '制御',
      colour: '%{BKY_LOGIC_HUE}',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'controls_ifelse' },
        { kind: 'block', type: 'controls_repeat_ext' },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for' },
        { kind: 'block', type: 'controls_forEach' },
        { kind: 'block', type: 'controls_flow_statements' },
      ],
    },
    {
      kind: 'category',
      name: '論理',
      colour: '%{BKY_LOGIC_HUE}',
      contents: [
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
        { kind: 'block', type: 'logic_null' },
        { kind: 'block', type: 'logic_ternary' },
      ],
    },
    {
      kind: 'category',
      name: '算数',
      colour: '%{BKY_MATH_HUE}',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'math_single' },
        { kind: 'block', type: 'math_trig' },
        { kind: 'block', type: 'math_constant' },
        { kind: 'block', type: 'math_number_property' },
        { kind: 'block', type: 'math_round' },
        { kind: 'block', type: 'math_on_list' },
        { kind: 'block', type: 'math_modulo' },
        { kind: 'block', type: 'math_constrain' },
        { kind: 'block', type: 'math_random_int' },
        { kind: 'block', type: 'math_random_float' },
      ],
    },
    {
      kind: 'category',
      name: 'テキスト',
      colour: '%{BKY_TEXTS_HUE}',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_join' },
        { kind: 'block', type: 'text_append' },
        { kind: 'block', type: 'text_length' },
        { kind: 'block', type: 'text_isEmpty' },
        { kind: 'block', type: 'text_indexOf' },
        { kind: 'block', type: 'text_charAt' },
        { kind: 'block', type: 'text_getSubstring' },
        { kind: 'block', type: 'text_changeCase' },
        { kind: 'block', type: 'text_trim' },
        { kind: 'block', type: 'text_print' },
        { kind: 'block', type: 'text_prompt_ext' },
      ],
    },
    {
      kind: 'category',
      name: 'リスト',
      colour: '%{BKY_LISTS_HUE}',
      contents: [
        { kind: 'block', type: 'lists_create_with' },
        { kind: 'block', type: 'lists_repeat' },
        { kind: 'block', type: 'lists_length' },
        { kind: 'block', type: 'lists_isEmpty' },
        { kind: 'block', type: 'lists_indexOf' },
        { kind: 'block', type: 'lists_getIndex' },
        { kind: 'block', type: 'lists_setIndex' },
        { kind: 'block', type: 'lists_getSublist' },
      ],
    },
    {
      kind: 'category',
      name: '変数',
      colour: '%{BKY_VARIABLES_HUE}',
      custom: 'VARIABLE',
    },
    {
      kind: 'category',
      name: '関数',
      colour: '%{BKY_PROCEDURES_HUE}',
      custom: 'PROCEDURE',
    },
    {
      kind: 'category',
      name: 'DataFrame',
      contents: [
        { kind: 'block', type: df.DATA_FRAME_READ_CSV_KEY },
        {
          kind: 'block',
          type: df.DATA_FRAME_DROP_COLUMN_KEY,
          inputs: {
            columns: {
              shadow: {
                type: 'text',
              },
            },
          },
        },
        {
          kind: 'block',
          type: df.DATA_FRAME_FILTER_BLOCK_KEY,
          inputs: {
            Condition: {
              shadow: {
                type: 'logic_boolean',
              },
            },
          },
        },
        {
          kind: 'block',
          type: df.DATA_FRAME_SELECT_COLUMN,
          inputs: {
            columns: {
              shadow: {
                type: 'text',
              },
            },
          },
        },
        { kind: 'block', type: df.DATA_FRAME_IMPUTE_MISSING_VALUES },
      ],
    },
    {
      kind: 'category',
      name: 'ML',
      contents: [
        { kind: 'block', type: sk.SK_LEARN_SELECT_MODEL },
        {
          kind: 'block',
          type: sk.SK_LEARN_FIT_MODEL,
          inputs: {
            X: {
              shadow: {
                type: 'variables_get_dynamic',
              },
            },
            Y: {
              shadow: {
                type: 'variables_get_dynamic',
              },
            },
          },
        },
        { kind: 'block', type: sk.SK_LEARN_LABEL_ENCODING },
        {
          kind: 'block',
          type: sk.SK_LEARN_PREDICT_AND_EVALUATE,
          inputs: {
            X: {
              shadow: {
                type: 'variables_get_dynamic',
              },
            },
            Y: {
              shadow: {
                type: 'text',
              },
            },
          },
        },
      ],
    },
    {
      kind: 'category',
      name: '出力',
      contents: [
        { kind: 'block', type: ch.CHART_PLOT_BLOCK_KEY },
        { kind: 'block', type: ch.CHART_SHOW_TABLE_BLOCK_KEY },
      ],
    },
  ],
};
