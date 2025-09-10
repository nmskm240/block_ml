import * as procedure from '@blockly/block-shareable-procedures';
import * as Blockly from 'blockly/core';

import * as blocks from './blocks';

procedure.unregisterProcedureBlocks();
Blockly.common.defineBlocks(procedure.blocks);

const mlToolbox: Blockly.utils.toolbox.ToolboxDefinition = {
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
        // { kind: 'block', type: 'text_prompt_ext' },
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
      colour: '210',
      contents: [
        { kind: 'block', type: blocks.DATAFRAME_READ_CSV },
        {
          kind: 'block',
          type: blocks.DATAFRAME_DROP_COLUMN,
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
          type: blocks.DATAFRAME_FILTER,
          inputs: {
            condition: {
              shadow: {
                type: 'logic_compare',
              },
            },
          },
        },
        {
          kind: 'block',
          type: blocks.DATAFRAME_SELECT_COLUMN,
          inputs: {
            column: {
              shadow: {
                type: 'text',
              },
            },
          },
        },
        { kind: 'block', type: blocks.DATAFRAME_FILL_MISSING },
        { kind: 'block', type: blocks.PLOTLY_PLOT_GRAPH },
        { kind: 'block', type: blocks.PLOTLY_PLOT_TABLE },
      ],
    },
    {
      kind: 'category',
      name: 'ML',
      colour: '240',
      contents: [
        { kind: 'label', text: 'データ取得' },
        { kind: 'block', type: blocks.SKLEARN_LOAD_DATASET },
        { kind: 'block', type: blocks.DATAFRAME_TRAIN_TEST_SPLIT },

        { kind: 'sep' },

        { kind: 'label', text: '前処理' },
        { kind: 'block', type: blocks.SKLEARN_LABEL_ENCODING },
        { kind: 'block', type: blocks.SKLEARN_SELECT_ENCODER },
        { kind: 'block', type: blocks.SKLEARN_SELECT_SCALER },
        { kind: 'block', type: blocks.SKLEARN_SELECT_NORMALIZER },
        { kind: 'block', type: blocks.SKLEARN_SELECT_DISCRETIZER },

        { kind: 'sep' },

        { kind: 'label', text: '特徴量変換' },
        { kind: 'block', type: blocks.SKLEARN_CUSTOM_TRANSFORMER_DEF },
        { kind: 'block', type: blocks.SKLEARN_CUSTOM_TRANSFORMER },
        { kind: 'block', type: blocks.SKLEARN_TRANSFORM },

        { kind: 'sep' },

        { kind: 'label', text: 'パイプライン' },
        { kind: 'block', type: blocks.SKLEARN_MAKE_PIPELINE },

        { kind: 'sep' },

        { kind: 'label', text: '学習' },
        { kind: 'block', type: blocks.SKLEARN_SELECT_CLASSIFICATION_MODEL },
        { kind: 'block', type: blocks.SKLEARN_SELECT_REGRESSION_MODEL },
        { kind: 'block', type: blocks.SKLEARN_FIT },

        { kind: 'sep' },

        { kind: 'label', text: '予測' },
        { kind: 'block', type: blocks.SKLEARN_PREDICT },

        { kind: 'sep' },

        { kind: 'label', text: '評価' },
        { kind: 'block', type: blocks.SKLEARN_GET_CLASSIFICATION_METRIC },
        { kind: 'block', type: blocks.SKLEARN_GET_REGRESSION_METRIC },
      ],
    },
  ],
};

export default mlToolbox;
