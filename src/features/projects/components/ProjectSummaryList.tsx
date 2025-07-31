import { List, ListItem } from '@mui/material';
import { ProjectSummaryDto } from '../types';
import { ProjectSummaryListItem } from './ProjectSummaryListItem';

type Props = {
  fetchSummaries: () => Promise<ProjectSummaryDto[]>;
};

export async function ProjectSummaryList({ fetchSummaries }: Props) {
  const summaries = await fetchSummaries();

  return (
    <div>
      <List>
        {summaries.map((project) => (
          <ProjectSummaryListItem key={project.id} project={project} />
        ))}
      </List>
    </div>
  );
}
