import { Paper, Typography, Box } from '@mui/material';

import { ProjectAssetList } from '@/components/project';
import { fetchProjectDetail } from '@/features/detailProject';
import { TrashProjectButton } from '@/features/trashProject';

type PageParams = {
  projectId: string;
};

export default async function ProjectDetailPage(props: {
  params: Promise<PageParams>;
}) {
  const { projectId } = await props.params;
  const detail = await fetchProjectDetail(projectId);

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
          {detail.title}
        </Typography>

        <Box mt={4}>
          <ProjectAssetList assets={detail.assets} />
        </Box>

        <Box mt={4}>
          <TrashProjectButton projectId={projectId} />
        </Box>
      </Paper>
    </div>
  );
}
