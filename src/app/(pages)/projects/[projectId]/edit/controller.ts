import { EditorHandle } from '@/features/coding/components';
import { usePyodide, useUploadFile } from '@/features/coding/providers';
import { useParams } from 'next/navigation';
import { PyodideInterface } from 'pyodide';
import React from 'react';

class ProjectEditPageController {
  constructor(
    private readonly _projectId: string,
    private readonly _pyodide: PyodideInterface,
    private readonly _editorHandler: EditorHandle | null,
    private readonly _addFile: (file: File) => Promise<void>,
    public readonly removeFile: (fileName: string) => Promise<void>,
  ) {}

  async uploadFiles(e: React.ChangeEvent<HTMLInputElement>) {
    for (const file of e.target.files ?? []) {
      this._addFile(file);
    }
  }

  async run() {
    const code = this._editorHandler?.toPython();
    if (!code) {
      return;
    }
    await this._pyodide.runPythonAsync(code);
  }
}

export const useProjectEditController = () => {
  const params = useParams();
  const { pyodideRef, isLoading } = usePyodide();
  //FIXME: usePyodideと合併してもよさそう
  const { fileNames, addFile, removeFile } = useUploadFile();
  const projectId = params.id as string;
  const editorRef = React.useRef<EditorHandle>(null);
  const [controller, setController] =
    React.useState<ProjectEditPageController | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const init = async () => {
      if (!pyodideRef.current) return;
      if (isLoading) return;
      const instance = new ProjectEditPageController(
        projectId,
        pyodideRef.current,
        editorRef.current,
        addFile,
        removeFile
      );
      setController(instance);
      setLoading(false);
    };

    init();
  }, [projectId, isLoading]);

  return { controller, editorRef, fileNames, loading };
};
