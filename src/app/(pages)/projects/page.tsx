import "reflect-metadata";
import { ProjectSummaryList } from '@/features/projects/components/ProjectSummaryList';
import { ProjectSearchQuerySchema } from '@/features/projects/types';
import { searchProjectSumamries } from '@/features/projects/usecases/searchProjectSummaries';
import { ReadonlyURLSearchParams } from 'next/navigation';

export default async function ProjectListPage(props: {
  searchParams: ReadonlyURLSearchParams;
}) {
  const query = await ProjectSearchQuerySchema.parseAsync(props.searchParams);
  const projectSummaries = await searchProjectSumamries(query);

  return (
    <div className="global-page-padding">
      <ProjectSummaryList summaries={projectSummaries} />
    </div>
  );
}
