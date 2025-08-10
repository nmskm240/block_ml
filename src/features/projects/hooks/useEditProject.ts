'use client';

import React from 'react';
import { useProjectApiClient } from '../providers/apiClientProvider';
import { SaveProjectRequest } from '../api/types';

type EditProjectData = {
  projectJson: string;
  assetUrls: string[];
  loading: boolean;
  error: Error | null;
  saveProject: (params: SaveProjectRequest) => Promise<void>;
};

export default function useEditProject(projectId?: string): EditProjectData {
  const client = useProjectApiClient();
  const [state, setState] = React.useState<{
    projectJson: string;
    assetUrls: string[];
    loading: boolean;
    error: Error | null;
  }>({
    projectJson: '',
    assetUrls: [],
    loading: !!projectId,
    error: null,
  });

  React.useEffect(() => {
    if (!projectId) {
      setState({
        projectJson: '',
        assetUrls: [],
        loading: false,
        error: null,
      });
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const init = async () => {
      try {
        const { projectJson, assetUrls } = await client.getEditingProject(
          projectId
        );
        if (!cancelled) {
          setState({
            projectJson: projectJson?.toString() ?? '',
            assetUrls,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            projectJson: '',
            assetUrls: [],
            loading: false,
            error: err instanceof Error ? err : new Error('Unknown error'),
          });
        }
      }
    };
    init();

    return () => {
      cancelled = true;
    };
  }, [client, projectId]);

  const saveProject = async (params: SaveProjectRequest) => {
    if (!projectId) return;
    try {
      await client.saveProject(projectId, params);
    } catch (error) {
      console.error('Failed to save project', error);
    }
  };

  return { ...state, saveProject };
}
