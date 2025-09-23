import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

__BLOCKLY_df__ = pd.DataFrame()
__BLOCKLY_x__ = ""
__BLOCKLY_y__ = ""
__BLOCKLY_title__ = ""
# --- BLOCKLY TEMPLATE ---

# --- BLOCKLY FUNC ---
go.Figure.__str__  = lambda self: self.to_json()
# --- BLOCKLY FUNC END ---

px.bar(__BLOCKLY_df__, x="__BLOCKLY_x__", y="__BLOCKLY_y__", title="__BLOCKLY_title__")
