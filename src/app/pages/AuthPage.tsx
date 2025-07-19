import React from 'react';
import Auth from '../components/Auth';

export const AuthPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Auth />
    </div>
  );
};
