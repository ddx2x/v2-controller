import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import * as monaco from 'monaco-editor';
import React, { useEffect } from 'react';

export declare type MonacoEditorProps = monaco.editor.IStandaloneEditorConstructionOptions & ProFieldFCRenderProps & {
  width?: string | number;
  height?: string | number;
};

export const MonacoEditor: React.FC<MonacoEditorProps> = (props) => {
  const { width, height, value, fieldProps, ...rest } = props;

  useEffect(() => {
    const el = document.getElementById('monaco-editor');
    if (!el) return;
    const editor = monaco.editor.create(el, {
      ...rest,
    });
    return () => editor.dispose();
  }, []);

  return <div id="monaco-editor" style={{ width: width || '100%', height: height || '200px' }} />;
};


export const MonacoEditorRender: React.FC<MonacoEditorProps> = (props) => {
  return <MonacoEditor {...props} />
}

export const MonacoEditorRenderFormItem: React.FC<MonacoEditorProps> = (props) => {
  return <MonacoEditor {...props} />
}