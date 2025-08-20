import { Paper, Typography } from '@mui/material';

type PageParams = {
  projectId: string;
};

export default async function ProjectDetailPage(props: { params: PageParams }) {
  const params = props.params;

  return (
    <div className="global-page-padding">
      <Paper
        sx={{
          width: '100%',
          p: 8,
          m: '8 auto',
        }}
      >
        <Typography>Project</Typography>
      </Paper>
    </div>
  );
}
