import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { loadPyodide, type PyodideInterface } from "pyodide";
import { usePlotly } from "./PlotlyProvider";

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
  const { addPlot, addTable } = usePlotly();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      pyodideRef.current = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.0/full/",
      });
      await pyodideRef.current.loadPackage([
        "pandas",
        "scikit-learn",
        "micropip",
      ]);
      const micropip = pyodideRef.current.pyimport("micropip");
      await micropip.install("plotly");

      // --- Pythonに公開するグローバル関数 ---
      pyodideRef.current.globals.set(
        "__show_plot_json",
        (title: string, json: string) => {
          const plotData = JSON.parse(json);
          addPlot(title, plotData);
        }
      );

      pyodideRef.current.globals.set(
        "__show_table_json",
        (title: string, json: string) => {
          const parsedData = JSON.parse(json);
          const tableData = {
            columns: parsedData.columns,
            rows: parsedData.data,
          };
          addTable(title, tableData);
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
