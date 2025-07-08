import { Header } from "./components";
import { Editor } from "./features/coding/components";
import { BlocklyProvider, UploadFileProvider } from "./features/coding/providers";

function App() {
  return (
    <div>
      <Header />
      <UploadFileProvider>
        <BlocklyProvider>
          <Editor />
        </BlocklyProvider>
      </UploadFileProvider>
    </div>
  );
}

export default App;
