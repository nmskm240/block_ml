import React from 'react';
import { IProjectApiClient, ProjectApiClient } from '../api/client';

const ProjectApiClientContext = React.createContext<IProjectApiClient | null>(
  null
);
type ProviderProps = {
  children: React.ReactNode;
  client?: IProjectApiClient;
};

export function ProjectApiClientProvider({
  children,
  client = new ProjectApiClient(),
}: ProviderProps) {
  return (
    <ProjectApiClientContext.Provider value={client}>
      {children}
    </ProjectApiClientContext.Provider>
  );
}

export const useProjectApiClient = () => {
  const ctx = React.useContext(ProjectApiClientContext);
  if (!ctx) {
    throw new Error(
      'useProjectApiClient must be used within ProjectApiClientProvider'
    );
  }
  return ctx;
};
