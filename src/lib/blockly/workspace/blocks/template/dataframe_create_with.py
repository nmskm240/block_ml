import pandas as pd

__BLOCKLY_data__ = []
__BLOCKLY_columns__ = []

# --- BLOCKLY TEMPLATE ---

df_dict = dict(zip(__BLOCKLY_columns__, __BLOCKLY_data__))
pd.DataFrame(df_dict)
