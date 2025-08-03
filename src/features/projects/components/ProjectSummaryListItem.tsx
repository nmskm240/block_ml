import Link from 'next/link';
import { ProjectSummaryDto } from '../types';
import { ListItem, ListItemText, Typography, Chip, Stack } from '@mui/material';

export function ProjectSummaryListItem({
  project,
}: {
  project: ProjectSummaryDto;
}) {
  return (
    <ListItem divider alignItems="flex-start">
      <ListItemText
        primary={
          <Link href={`/projects/${project.id}`} passHref>
            <Typography
              component="div"
              variant="h6"
              sx={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              {project.title}
            </Typography>
          </Link>
        }
        secondary={
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Updated at: {project.updatedAt.toLocaleString()}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={`Status: ${project}`} size="small" />
              <Chip label={`Score: ${project}`} size="small" color="success" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Created by:{' '}
              <Link href={`/users/12345`} passHref>
                <Typography
                  component="a"
                  sx={{ cursor: 'pointer' }}
                  color="text.primary"
                  variant="body2"
                >
                  {project.id}
                </Typography>
              </Link>
            </Typography>
          </Stack>
        }
      />
    </ListItem>
  );
}
