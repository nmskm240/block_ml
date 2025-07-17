import { Header } from "./components";
import { Editor, PlotView } from "./features/coding/components";
import {
  BlocklyProvider,
  PlotlyProvider,
  PyodideProvider,
  UploadFileProvider,
} from "./features/coding/providers";

function App() {
  return (
    <div>
      <Header />
      <PlotlyProvider>
        <PyodideProvider>
          <UploadFileProvider>
            <BlocklyProvider>
              <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
                <div style={{ flex: 1, borderRight: "1px solid #ccc" }}>
                  <Editor />
                </div>
                <div style={{ flex: 1, borderLeft: "1px solid #ccc" }}>
                  <PlotView />
                </div>
              </div>
            </BlocklyProvider>
          </UploadFileProvider>
        </PyodideProvider>
      </PlotlyProvider>
    </div>
  );
}

export default App;
