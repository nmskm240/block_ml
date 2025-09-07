import pandas as pd
from sklearn.tree import DecisionTreeClassifier

__BLOCKLY_model__ = DecisionTreeClassifier()
__BLOCKLY_x__ = pd.DataFrame()
__BLOCKLY_y__ = pd.DataFrame()

# --- BLOCKLY TEMPLATE ---

__BLOCKLY_model__.fit(__BLOCKLY_x__, __BLOCKLY_y__)
