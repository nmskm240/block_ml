import { Header } from '@/components';

import '@/styles/globals.css';
import Link from 'next/link';

export default function IndexPage() {
  return (
    <div>
      <Header />
      <Link href="/projects/new">新しいプロジェクトを作成</Link>
    </div>
  );
}
