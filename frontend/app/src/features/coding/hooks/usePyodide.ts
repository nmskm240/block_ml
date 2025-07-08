import { useEffect, useRef, useState } from "react";
import { loadPyodide, type PyodideInterface } from "pyodide";

export const usePyodide = () => {
  const pyodideRef = useRef<PyodideInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    pyodideRef.current = await loadPyodide({ packages: ["pandas"] });
    setIsLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  return { pyodideRef, isLoading };
};
