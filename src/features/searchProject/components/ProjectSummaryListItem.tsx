import { ListItem, ListItemText, Typography, Chip, Stack } from '@mui/material';

import Link from 'next/link';

import UserListItem from '@/components/user/UserListItem';

import { ProjectSummary } from '../types';

export function ProjectSummaryListItem({
  project,
}: {
  project: ProjectSummary;
}) {
  return (
    <>
      <ListItem
        component={Link}
        href={`/projects/${project.id}`}
        divider
        alignItems="flex-start"
        sx={{ textDecoration: 'none', color: 'inherit' }}
      >
        <ListItemText
          primary={
            <Typography variant="h6" component="div">
              {project.title}
            </Typography>
          }
          secondary={
            <Stack spacing={0.5}>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                Updated at: {project.updatedAt.toLocaleString()}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={`Status: ${project.status}`} size="small" />
                {/* <Chip
                label={`Score: ...`} // TODO: ProjectSummaryにscoreを追加する必要がある
                size="small"
                color="success"
              /> */}
              </Stack>
            </Stack>
          }
        />
        <UserListItem userInfo={project.createdBy} />
      </ListItem>
    </>
  );
}
