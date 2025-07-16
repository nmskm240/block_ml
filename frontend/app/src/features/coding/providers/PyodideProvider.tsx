import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { loadPyodide, type PyodideInterface } from "pyodide";
import { usePlotViewer } from "../providers";

type PyodideContextType = {
  pyodideRef: React.MutableRefObject<PyodideInterface | null>;
  isLoading: boolean;
};

const PyodideContext = createContext<PyodideContextType | undefined>(undefined);

export const PyodideProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pyodideRef = useRef<PyodideInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setPlotData } = usePlotViewer();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      pyodideRef.current = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.0/full/",
      });
      await pyodideRef.current.loadPackage(["pandas", "scikit-learn"]);

      pyodideRef.current.globals.set(
        "__render_plot",
        (x: any, y: any, type: string) => {
          const toJsArray = (s: any): any[] => {
            if (Array.isArray(s)) return s;
            if (s?.toJs) return s.toJs(); // Pyodide の toJs() サポート
            if (s?.values) return Array.from(s.values); // Series.values
            try {
              return Array.from(s);
            } catch {
              return [];
            }
          };
          setPlotData({
            x: toJsArray(x),
            y: toJsArray(y),
            type: "line",
          });
        }
      );
      setIsLoading(false);
    };
    load();
  }, []);

  return (
    <PyodideContext.Provider value={{ pyodideRef, isLoading }}>
      {children}
    </PyodideContext.Provider>
  );
};

export const usePyodide = () => {
  const ctx = useContext(PyodideContext);
  if (!ctx) throw new Error("usePyodide must be used within PyodideProvider");
  return ctx;
};
