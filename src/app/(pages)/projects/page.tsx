import SearchBox from '@/components/SearchBox';
import { ReadonlyURLSearchParams } from 'next/navigation';

export default async function ProjectListPage(props: {
  searchParams: ReadonlyURLSearchParams;
}) {
  return (
    <div className="global-page-padding">
      <SearchBox />
    </div>
  );
}
