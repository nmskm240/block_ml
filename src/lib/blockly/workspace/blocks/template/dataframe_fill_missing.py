import pandas as pd
from sklearn.impute import SimpleImputer
import numpy as np

__BLOCKLY_df__ = pd.DataFrame()
__BLOCKLY_strategy__ = ""
# --- BLOCKLY TEMPLATE ---

__BLOCKLY_df__.assign(**{
    col: SimpleImputer(strategy='__BLOCKLY_strategy__').fit_transform(
        __BLOCKLY_df__[[col]])[:, 0]
    for col in __BLOCKLY_df__.select_dtypes(include=np.number).columns
})
