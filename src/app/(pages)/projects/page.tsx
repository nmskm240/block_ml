import 'reflect-metadata';
import { ReadonlyURLSearchParams } from 'next/navigation';

import { ProjectSummaryList } from '@/features/inspectAsset/components/ProjectSummaryList';
import { ProjectSearchQuerySchema } from '@/features/projects/types';
import { searchProjectSumamries } from '@/features/projects/usecases/searchProjectSummaries';

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
