import * as monaco from 'monaco-editor';
import React, { useEffect } from 'react';

export declare type MonacoEditorFieldProps = monaco.editor.IStandaloneEditorConstructionOptions & {
  width?: string | number
  height?: string | number
  value?: any;
  onChange?: ((...rest: any[]) => void) | undefined;
}

export const monacoEditorField: React.FC<MonacoEditorFieldProps> = (props) => {
  const { width, height, value, onChange, ...rest } = props;

  useEffect(() => {
    const el = document.getElementById('monaco-editor')
    if (!el) return
    const editor = monaco.editor.create(el, {
      ...rest
    });
    return () => editor.dispose()
  }, [])

  return <div id='monaco-editor' style={{ width: width || '100%', height: height || '100%' }} />
}