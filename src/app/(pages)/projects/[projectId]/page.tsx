import { Paper, Typography, Box } from '@mui/material';

import { TrashProjectButton } from '@/features/inspectAsset/components';
import { fetchProjectEditing } from '@/features/projects/usecases';

type PageParams = {
  projectId: string;
};

export default async function ProjectDetailPage(props: { params: PageParams }) {
  const params = props.params;
  const project = await fetchProjectEditing(params.projectId);

  return (
    <div className="global-page-padding">
      <Paper
        sx={{
          width: '100%',
          p: 8,
          m: '8 auto',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {project.id}
        </Typography>
        <Box mt={4}>
          <TrashProjectButton projectId={params.projectId} />
        </Box>
      </Paper>
    </div>
  );
}
