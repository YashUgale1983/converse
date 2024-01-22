import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import AWS from "aws-sdk";
import { db } from "@/db"; 

// export const testFunction = async(file : File)=>{
//     try{
//         const {getUser} = getKindeServerSession();
//         const user = await getUser();
//         console.log("user- ",user);
//         console.log("file in s3.ts - ", file);
        
//         const allUsers = await db.user.findMany();
//         console.log("all users from db - ", allUsers);
        
//         return allUsers;
//     }catch(err){
//         console.log(err);
//     }
// }

export const uploadToS3 = async (file: File)=>{
    try{
        const {getUser} = getKindeServerSession();
        const user = await getUser();
        if(!user || !user.id){
            throw new Error("Unauthorised")
        }

        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY
        })
        const s3 = new AWS.S3({
            params:{
                Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
            },
            region: "ap-south-1"
        })
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const file_key = 'uploads/' + user.id + "-" + Date.now().toString() + "-" + file.name.replace(" ", "-");
        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
            Key : file_key,
            Body : buffer
        }

        const upload = await s3.putObject(params).promise()

        const createdFile = await db.file.create({
            data:{
                key: file_key,
                name: file.name,
                userId : user.id,
                url : `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`,
                uploadStatus: "PROCESSING",
            }
        })
        return Promise.resolve({
            fileId : createdFile.id,
            file_key,
            file_name: file.name
        })

    }catch(err){
        return new Error("Could not upload to S3. Try again...")
    }
} 


export const getS3Url = (file_key: string)=>{
    const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
} 