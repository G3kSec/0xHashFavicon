import { NextResponse } from 'next/server';
import murmurhash3 from 'murmurhash3js';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const withNewLines = base64.replace(/(.{76})/g, "$1\n") + "\n";
    const hash = murmurhash3.x86.hash32(withNewLines);
    return NextResponse.json({ 
      hash, 
      shodanQuery: `http.favicon.hash:${hash}` 
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to process file.' }, 
      { status: 500 }
    );
  }
}