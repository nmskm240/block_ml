import pandas as pd
import plotly.express as px
# --- BLOCKLY GEN ForRunning ---
import plotly.graph_objects as go
# --- BLOCKLY GEN END ---


__BLOCKLY_df__ = pd.DataFrame()
__BLOCKLY_x__ = ""
__BLOCKLY_y__ = ""
__BLOCKLY_title__ = ""
__BLOCKLY_histfunc__ = ""
# --- BLOCKLY TEMPLATE ---

# --- BLOCKLY GEN ForRunning ---
# --- BLOCKLY DEFINITIONS plotly_monkey_patch ---
go.Figure.__str__ = lambda self: self.to_json()
# --- BLOCKLY DEFINITIONS END ---
# --- BLOCKLY GEN END ---

px.histogram(__BLOCKLY_df__, x="__BLOCKLY_x__", y="__BLOCKLY_y__", title="__BLOCKLY_title__", histfunc="__BLOCKLY_histfunc__")
