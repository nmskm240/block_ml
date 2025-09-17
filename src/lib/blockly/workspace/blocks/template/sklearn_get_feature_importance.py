from sklearn.inspection import permutation_importance

# --- BLOCKLY TEMPLATE ---

permutation_importance(__BLOCKLY_model__, __BLOCKLY_x_data__,
                       __BLOCKLY_y_data__, n_repeats=10, random_state=42).importances_mean
