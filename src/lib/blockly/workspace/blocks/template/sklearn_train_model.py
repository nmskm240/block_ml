import pandas as pd

__BLOCKLY_model__: any
__BLOCKLY_x__ = pd.DataFrame()
__BLOCKLY_y__ = pd.DataFrame()
__BLOCKLY_sample_weight__ = pd.DataFrame()

# --- BLOCKLY TEMPLATE ---

__BLOCKLY_model__.fit(X=__BLOCKLY_x__, y=__BLOCKLY_y__,
                      sample_weight=__BLOCKLY_sample_weight__)
