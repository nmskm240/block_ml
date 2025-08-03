import React from 'react';
import { IProjectApiClient, ProjectApiClient } from '../api/client';

const ProjectApiClientContext = React.createContext<IProjectApiClient>(
  new ProjectApiClient()
);

export const useProjectApiClient = () =>
  React.useContext(ProjectApiClientContext);

export const ProjectApiClientProvider = ProjectApiClientContext.Provider;
