
import { resolve } from "path";
import { useEffect } from 'react';
import * as tjs from "typescript-json-schema";
import * as monaco from 'monaco-editor';

export default () => {

  // const settings: tjs.PartialArgs = {
  //   required: true,
  // }
  // const compilerOptions: tjs.CompilerOptions = {
  //   strictNullChecks: true,
  // };
  // const basePath = './'
  // const program = tjs.getProgramFromFiles(
  //   [resolve("../dynamic-components/typing.d.ts")],
  //   compilerOptions,
  //   basePath
  // );
  // const schema = tjs.generateSchema(program, "TT", settings);
  // const generator = tjs.buildGenerator(program, settings);

  // console.log('schema', schema);

  useEffect(() => {
    const el = document.getElementById('monaco-editor')
    if (!el) return

    const monacoT = require('!!raw-loader!../dynamic-components/typing.d.ts')
    console.log(monacoT.default);
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      monacoT.default
    )
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({})
    monaco.editor.create(el, {
      language: 'json',
      automaticLayout: true
    })


  }, [])

  return <div id='monaco-editor' style={{ width: '50%', height: '100%' }} />
}