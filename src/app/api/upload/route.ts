import { NextResponse } from 'next/server';
import murmurhash3 from 'murmurhash3js';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = new Set([
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/gif',
  'image/webp',
]);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 2 MB)' }, { status: 400 });
    }

    if (!file.type || !ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const withNewLines = base64.replace(/(.{76})/g, '$1\n') + '\n';
    const hash = murmurhash3.x86.hash32(withNewLines);

    return NextResponse.json({
      hash,
      shodanQuery: `http.favicon.hash:${hash}`,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process file.' }, { status: 500 });
  }
}
