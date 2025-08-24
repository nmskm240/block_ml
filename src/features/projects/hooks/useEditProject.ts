'use client';

import React from 'react';

import { Asset } from '@/features/assets/types';
import fetchAssetFromSignedUrl from '@/features/assets/usecases/fetchAssetFromSignedUrl';
import usePyodideFileService from '@/lib/pyodide/hooks/usePyodideFileService';

import { fetchProjectEditing } from '../usecases';

type EditProjectData = {
  projectJson: string;
  assets: Asset[];
  isLoading: boolean;
};

export default function useEditProject(projectId: string): EditProjectData {
  const service = usePyodideFileService();
  const [projectJson, setProjectJson] = React.useState('');
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!service) {
      return;
    }

    const init = async () => {
      setLoading(true);
      const { workspace, assets } = await fetchProjectEditing(projectId);
      const assetFiles = await Promise.all(
        assets.map((asset) =>
          fetchAssetFromSignedUrl({ url: asset.path, fileName: asset.name }),
        ),
      );

      await service?.uploads(assetFiles);

      setProjectJson(workspace?.toString() ?? '');
      setAssets(assets);
      setLoading(false);
    };
    init();
  }, [projectId, service]);

  return { projectJson, assets, isLoading };
}
