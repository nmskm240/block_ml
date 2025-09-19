import pandas as pd
import plotly.graph_objects as go

__BLOCKLY_column_size__ = 0
__BLOCKLY_title__ = ""
__BLOCKLY_df__ = pd.DataFrame()
# --- BLOCKLY TEMPLATE ---

print(
    go.Figure(
        data=[
            go.Table(
                columnwidth=[__BLOCKLY_column_size__] * len(__BLOCKLY_df__.columns),
                header=dict(
                    values=list(__BLOCKLY_df__.columns),
                    fill_color="paleturquoise",
                    align="left",
                ),
                cells=dict(
                    values=[__BLOCKLY_df__[col] for col in __BLOCKLY_df__.columns],
                    fill_color="lavender",
                    align="left",
                ),
            )
        ],
        layout=dict(
            title=__BLOCKLY_title__,
            autosize=False,
            width=__BLOCKLY_column_size__ * len(__BLOCKLY_df__.columns) + 100,
        ),
    ).to_json()
)
