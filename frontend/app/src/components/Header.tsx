import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export const Header = () => {
  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            サービス名
          </Typography>
          <Button color="inherit">ログイン</Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};
