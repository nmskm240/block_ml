import { Header } from "./components";
import { Editor } from "./features/coding/components";
import {
  BlocklyProvider,
  PyodideProvider,
  UploadFileProvider,
} from "./features/coding/providers";

function App() {
  return (
    <div>
      <Header />
      <PyodideProvider>
        <UploadFileProvider>
          <BlocklyProvider>
            <Editor />
          </BlocklyProvider>
        </UploadFileProvider>
      </PyodideProvider>
    </div>
  );
}

export default App;
