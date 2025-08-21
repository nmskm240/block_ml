import React from 'react';
import { IUserApiClient, UserApiClient } from '../api/client';

const Context = React.createContext<IUserApiClient | undefined>(undefined);

type Props = {
  children: React.ReactNode;
  client?: IUserApiClient;
};

export function UserApiClientProvider({
  children,
  client = new UserApiClient(),
}: Props) {
  return <Context.Provider value={client}>{children}</Context.Provider>;
}

export const useUserApiClient = () => {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(
      'useUserApiClient must be used within a UserApiClientProvider'
    );
  }
  return context;
};
