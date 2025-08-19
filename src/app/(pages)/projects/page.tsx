import { ProjectSummaryList } from '@/features/projects/components/ProjectSummaryList';
import { ProjectSearchQuerySchema } from '@/features/projects/types';
import { searchProjectSumamries } from '@/features/projects/usecases/searchProjectSummaries';
import { SearchParams } from 'next/dist/server/request/search-params';

export default async function ProjectListPage(props: {
  searchParams: SearchParams;
}) {
  const query = await ProjectSearchQuerySchema.parseAsync(props.searchParams);
  const projectSummaries = await searchProjectSumamries(query);

  return (
    <div className="global-page-padding">
      <ProjectSummaryList summaries={projectSummaries} />
    </div>
  );
}
