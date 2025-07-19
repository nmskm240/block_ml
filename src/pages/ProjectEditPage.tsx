import { Header } from "../components";
import { Editor, PlotlyViewer } from "../features/coding/components";
import {
  BlocklyProvider,
  PlotlyProvider,
  PyodideProvider,
  UploadFileProvider,
} from "../features/coding/providers";
import { useAuth } from "../providers";
import { AuthService } from "../services";
import { Navigate } from 'react-router-dom';

export const ProjectEditPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
                  <PlotlyViewer />
                </div>
              </div>
              <button onClick={AuthService.signOut}>Sign Out</button>
            </BlocklyProvider>
          </UploadFileProvider>
        </PyodideProvider>
      </PlotlyProvider>
    </div>
  );
}
