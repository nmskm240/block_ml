import { List } from '@mui/material';

import { ProjectSummary } from '@/services';

import { ProjectSummaryListItem } from './ProjectSummaryListItem';

type Props = {
  summaries: ProjectSummary[];
};

export function ProjectSummaryList({ summaries }: Props) {
  return (
    <div>
      {summaries.length === 0 ? (
        <div>No projects found.</div>
      ) : (
        <List>
          {summaries.map((project) => (
            <ProjectSummaryListItem key={project.id} project={project} />
          ))}
        </List>
      )}
    </div>
  );
}
