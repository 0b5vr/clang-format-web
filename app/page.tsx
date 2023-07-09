'use client';

import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { useCallback, useState } from 'react';
import { defaultCode } from './defaultCode';
import { cpp } from '@codemirror/lang-cpp';
import { StreamLanguage } from '@codemirror/language';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';

export default function Home() {
  const [code, setCode] = useState(defaultCode);
  const [formatFile, setFormatFile] = useState('BasedOnStyle: LLVM\n');

  const handleChangeCode = useCallback((value: string) => {
    setCode(value);
  }, []);

  const handleChangeFormatFile = useCallback((value: string) => {
    setFormatFile(value);
  }, []);

  const handleFormat = useCallback(async () => {
    const res = await fetch('/api/format', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        formatFile,
      }),
    });

    const json = await res.json();
    if (json.code) {
      setCode(json.code);
    }
  }, [code, formatFile]);

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-12">
      <div className="flex gap-4">
        <div className="flex flex-col">
          <div>Code</div>
          <CodeMirror
            value={code}
            extensions={[cpp()]}
            theme={oneDark}
            basicSetup={{}}
            className="w-96 h-96"
            onChange={handleChangeCode}
          />
        </div>
        <div className="flex flex-col">
          <div>.clang-format</div>
          <CodeMirror
            value={formatFile}
            extensions={[StreamLanguage.define(yaml)]}
            theme={oneDark}
            basicSetup={{}}
            className="w-96 h-96"
            onChange={handleChangeFormatFile}
          />
        </div>
      </div>
      <button onClick={handleFormat}>
        Format
      </button>
    </main>
  );
}
