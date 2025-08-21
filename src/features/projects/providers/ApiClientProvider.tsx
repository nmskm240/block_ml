import React from 'react';
import { IProjectApiClient, ProjectApiClient } from '../api/client';

const Context = React.createContext<IProjectApiClient | undefined>(undefined);

type Props = {
  children: React.ReactNode;
  client?: IProjectApiClient;
};

export function ProjectApiClientProvider({
  children,
  client = new ProjectApiClient(),
}: Props) {
  return <Context.Provider value={client}>{children}</Context.Provider>;
}

export const useProjectApiClient = () => {
  const ctx = React.useContext(Context);
  if (!ctx) {
    throw new Error(
      'useProjectApiClient must be used within ProjectApiClientProvider'
    );
  }
  return ctx;
};
