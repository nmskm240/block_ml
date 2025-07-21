"use client";

import { Header } from '../components';
import { Editor, PlotlyViewer } from '@/features/coding/components';

import '@/styles/globals.css';
import {
  BlocklyProvider,
  PlotlyProvider,
  UploadFileProvider,
  PyodideProvider
} from '@/features/coding/providers';
import { mlToolbox } from '@/lib/blockly';

export default function Home() {
  return (
    <div>
      <Header />
      <PlotlyProvider>
        <PyodideProvider>
          <UploadFileProvider>
            <BlocklyProvider toolbox={mlToolbox}>
              <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
              <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
                <Editor />
              </div>
              <div style={{ flex: 1, borderLeft: "1px solid #ccc" }}>
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
