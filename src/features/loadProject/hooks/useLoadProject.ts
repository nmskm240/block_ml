'use client';

import React from 'react';

import { ProjectAssetInfo } from '@/services';

import { loadProject } from '../actions';

type LoadProjectData = {
  projectJson: string;
  assets: ProjectAssetInfo[];
  isLoading: boolean;
};

export function useLoadProject(projectId: string): LoadProjectData {
  const [projectJson, setProjectJson] = React.useState('');
  const [assets, setAssets] = React.useState<ProjectAssetInfo[]>([]);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { workspace, assets: loadedAssets } = await loadProject(projectId);

      setProjectJson(workspace?.toString() ?? '');
      setAssets(loadedAssets);
      setLoading(false);
    };
    init();
  }, [projectId]);

  return { projectJson, assets, isLoading };
}
