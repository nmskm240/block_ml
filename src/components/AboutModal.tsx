'use client';

import { GitHub, X, YouTube } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Link,
  Box,
  IconButton,
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AboutModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>About Moduloxs</DialogTitle>
      <DialogContent>
        <DialogContentText component="div" sx={{ mb: 2 }}>
          This application is created by 240.
          <br />
          Icons by{' '}
          <Link href="https://icons8.com" target="_blank" rel="noopener">
            Icons8
          </Link>
        </DialogContentText>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <IconButton
            component="a"
            href="https://x.com/lI240Il"
            target="_blank"
            rel="noopener"
            aria-label="Twitter"
          >
            <X />
          </IconButton>
          <IconButton
            component="a"
            href="https://www.youtube.com/channel/UCcp6uCQP-b9slACtyu3JTUQ"
            target="_blank"
            rel="noopener"
            aria-label="YouTube"
          >
            <YouTube />
          </IconButton>
          <IconButton
            component="a"
            href="https://github.com/nmskm240"
            target="_blank"
            rel="noopener"
            aria-label="Github"
          >
            <GitHub />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
