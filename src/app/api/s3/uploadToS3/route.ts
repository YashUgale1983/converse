import { uploadToS3, getS3Url, testFunction } from '@/lib/s3';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises'

export const POST = async (req: Request)=>{
    const fileRes = await req.formData();
    const file: File | null = fileRes.get('file') as unknown as File;
    if (!file) {
        return NextResponse.json({ success: false })
    }
    console.log("incoming file - ", file);
   console.log("inside app/api/s3/uploadtos3");
   const data = await uploadToS3(file);
   console.log("data received in route.ts- ",data);

   return NextResponse.json(data);
}

