from sklearn.model_selection import train_test_split

# --- BLOCKLY TEMPLATE ---

__BLOCKLY_X_TRAIN_VAR__, __BLOCKLY_X_TEST_VAR__, __BLOCKLY_Y_TRAIN_VAR__, __BLOCKLY_Y_TEST_VAR__ = train_test_split(
    __BLOCKLY_X__, __BLOCKLY_Y__, test_size=__BLOCKLY_TEST_SIZE__, random_state=__BLOCKLY_RANDOM_STATE__)
