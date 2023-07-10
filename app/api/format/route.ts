import { NextResponse } from 'next/server';
import cp from 'child_process';
import { temporaryFileTask } from 'tempy';
import fs from 'fs';

export async function POST(req: Request) {
  const json = await req.json();

  const code = json.code;
  const formatFile = json.formatFile;

  const formatted = await temporaryFileTask(async (codeFilePath) => {
    await fs.promises.writeFile(codeFilePath, code);

    return await temporaryFileTask(async (formatFilePath) => {
      await fs.promises.writeFile(formatFilePath, formatFile ?? '');

      return await new Promise<string>((resolve, reject) => {
        let stdout = '';
        let stderr = '';
  
        const process = cp.spawn('clang-format', [
          `-style=file:${formatFilePath}`,
          codeFilePath,
        ]);

        process.on('close', (code) => {
          if (code === 0) {
            if (stderr !== '') {
              console.warn(stderr);
            }

            resolve(stdout);
          } else {
            reject(stderr);
          }
        });

        process.stdout.on('data', (data) => stdout += data.toString());
        process.stderr.on('data', (data) => stderr += data.toString());
      });
    });
  }).catch((error) => {
    console.error(error);
    return null;
  });

  if (formatted == null) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }

  return NextResponse.json({ code: formatted });
}
