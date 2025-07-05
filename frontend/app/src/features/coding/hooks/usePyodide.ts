import { useEffect, useRef, useState } from "react";
import { loadPyodide, type PyodideInterface } from "pyodide";

export const usePyodide = () => {
  const pyodideRef = useRef<PyodideInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      pyodideRef.current = await loadPyodide();
      setIsLoading(false);
    };
    load();
  }, []);

  return { pyodideRef, isLoading };
};
