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
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formatFile, setFormatFile] = useState('BasedOnStyle: LLVM\n');

  const handleChangeCode = useCallback((value: string) => {
    setCode(value);
  }, []);

  const handleChangeFormatFile = useCallback((value: string) => {
    setFormatFile(value);
  }, []);

  const handleFormat = useCallback(async () => {
    setFetching(true);

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

    if (json.error) {
      setError(json.error);
    } else {
      setError(null);
    }

    setFetching(false);
  }, [code, formatFile]);

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-12">
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col">
          <div>Code</div>
          <CodeMirror
            value={code}
            extensions={[cpp()]}
            theme={oneDark}
            basicSetup={{}}
            className="w-full h-96"
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
            className="w-full h-96"
            onChange={handleChangeFormatFile}
          />
        </div>
      </div>
      <button
        className="bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-50 disabled:opacity-25 active:brightness-75 px-2 rounded"
        onClick={handleFormat}
        disabled={fetching}
      >
        Format
      </button>
      {error && <div className="text-red-400">
        {error}
      </div>}
    </main>
  );
}
