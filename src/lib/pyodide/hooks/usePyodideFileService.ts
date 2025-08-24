'use client';

import React from 'react';

import { usePyodide } from '../providers/PyodideProvider';
import PyodideFileService from '../services/pyodideFileService';

export default function usePyodideFileService() {
  const { pyodideRef, isLoading } = usePyodide();
  const [service, setService] = React.useState<PyodideFileService | null>(null);

  React.useEffect(() => {
    if (!isLoading && pyodideRef.current) {
      setService(new PyodideFileService(pyodideRef.current));
    }
  }, [isLoading]);

  return service;
}
