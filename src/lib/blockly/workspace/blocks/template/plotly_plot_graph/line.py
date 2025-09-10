import pandas as pd
import plotly.express as px

__BLOCKLY_df__ = pd.DataFrame()
__BLOCKLY_x__ = ""
__BLOCKLY_y__ = ""
__BLOCKLY_title__ = ""
# --- BLOCKLY TEMPLATE ---

print(px.line(__BLOCKLY_df__, x='__BLOCKLY_x__',
              y='__BLOCKLY_y__', title='__BLOCKLY_title__').to_json())
