"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { NewProjectRedirectPageController } from './controller';

export default function NewProjectRedirectPage() {
  const router = useRouter();
  const controller = React.useMemo(
    () => new NewProjectRedirectPageController(router),
    [router]
  );

  React.useEffect(() => {
    controller.createAndRedirect();
  }, [router, controller]);

  return <p>新しいプロジェクトを作成中...</p>;
}
