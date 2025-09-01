'use client';

import React from 'react';

import { usePyodide } from '@/lib/pyodide';
import { LoadedAsset } from '@/services';

import { fetchProjectEditing } from '../actions';

type EditProjectData = {
  projectJson: string;
  assets: LoadedAsset[];
  isLoading: boolean;
};

export function useEditProject(projectId: string): EditProjectData {
  const { fs } = usePyodide();
  const [projectJson, setProjectJson] = React.useState('');
  const [assets, setAssets] = React.useState<LoadedAsset[]>([]);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!fs) {
      return;
    }

    const init = async () => {
      setLoading(true);
      const { workspace, assets: loadedAssets } = await fetchProjectEditing(
        projectId,
      );

      const files = loadedAssets
        .map((asset) => asset.file)
        .filter((file): file is File => !!file);
      await fs?.uploads(files);

      setProjectJson(workspace?.toString() ?? '');
      setAssets(loadedAssets);
      setLoading(false);
    };
    init();
  }, [projectId, fs]);

  return { projectJson, assets, isLoading };
}
