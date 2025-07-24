'use client';

import { Header } from '@/components';
import { Editor, PlotlyViewer } from '@/features/coding/components';

import '@/styles/globals.css';
import {
  BlocklyProvider,
  PlotlyProvider,
  UploadFileProvider,
  PyodideProvider,
} from '@/features/coding/providers';
import { mlToolbox } from '@/lib/blockly';
import { ProjectEditPageController } from './controller';
import { useParams } from 'next/navigation';

export default function ProjectEditPage() {
  const params = useParams();
  const projectId = params.id as string;
  const controller = new ProjectEditPageController(projectId);

  return (
    <div>
      <Header />
      <PlotlyProvider>
        <PyodideProvider>
          <UploadFileProvider>
            <BlocklyProvider toolbox={mlToolbox}>
              <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
                <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
                  <Editor onSave={controller.saveProject} />
                </div>
                <div style={{ flex: 1, borderLeft: '1px solid #ccc' }}>
                  <PlotlyViewer />
                </div>
              </div>
            </BlocklyProvider>
          </UploadFileProvider>
        </PyodideProvider>
      </PlotlyProvider>
    </div>
  );
}
