import pandas as pd
from sklearn.preprocessing import LabelEncoder

__BLOCKLY_df__ = pd.DataFrame()
__BLOCKLY_column__ = ""
# --- BLOCKLY TEMPLATE ---

__BLOCKLY_df__.assign(
    **{__BLOCKLY_column__: LabelEncoder().fit_transform(__BLOCKLY_df__[__BLOCKLY_column__])})
