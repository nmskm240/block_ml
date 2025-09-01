import { ReadonlyURLSearchParams } from 'next/navigation';

import { searchProject } from '@/features/searchProject';
import { ProjectSummaryList } from '@/features/searchProject/components';
import { ProjectSearchQuerySchema } from '@/services';

export default async function ProjectListPage(props: {
  searchParams: ReadonlyURLSearchParams;
}) {
  const query = await ProjectSearchQuerySchema.parseAsync(props.searchParams);
  const projectSummaries = await searchProject(query);

  return (
    <div className="global-page-padding">
      <ProjectSummaryList summaries={projectSummaries} />
    </div>
  );
}
