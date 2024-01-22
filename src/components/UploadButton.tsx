'use client'
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from "react-dropzone";
import {Cloud, File} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Progress } from "./ui/progress";
import { uploadToS3 } from "@/lib/s3";
import { trpc } from "@/app/_trpc/client";

const UploadButton = ()=>{
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return(
        <Dialog open={isOpen} onOpenChange={(v)=>{
            if(!v){
                setIsOpen(v);
            }
            }}>
            <DialogTrigger onClick={()=>{
                setIsOpen(true)
            }} asChild>
                <Button size={"sm"}>Upload PDF</Button>
            </DialogTrigger>
            <DialogContent >
                <UploadDropZone />
            </DialogContent>
        </Dialog>
    )
}


const UploadDropZone = ()=>{
    const [isUploading, setIsUploading] = useState<boolean>(true);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const { toast } = useToast();
    const router = useRouter();

    const {mutate: startPolling} = trpc.getFile.useMutation({
        onSuccess: (file)=>{
            setInterval(() => {
                router.push(`/dashboard/${file.key}`);
            }, 5000);
        },
        retry: true,
        retryDelay: 500
    })


    const startSimulatedProgress = () => {
        setUploadProgress(0)
    
        const interval = setInterval(() => {
          setUploadProgress((prevProgress) => {
            if (prevProgress >= 95) {
              clearInterval(interval)
              return prevProgress
            }
            return prevProgress + 5
          })
        }, 500)
    
        return interval
    }

    return(
        <Dropzone multiple={false} accept={{"application/pdf" : [".pdf"]}} onDrop={async(acceptedFiles)=>{
            const file = acceptedFiles[0];
            // check for other file type
            if(file.type !== "application/pdf"){
                return toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Only PDF allowed.",
                  })
            }
            // greater than 4 MB
            if(file.size > 4*1024*1024){
                return toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "File is too large",
                  })
            }

            const fileData = new FormData();
            fileData.append('file', file);

            const data = await fetch("/api/s3/uploadToS3",{
                method: "POST",
                body: fileData,
            });
            const users = await data.json()
            console.log("here is the data received - ", users);
            


            // setIsUploading(true)
            // const progressInterval = startSimulatedProgress()
            // const data = await uploadToS3(file);
            // console.log("1 : ", data?.file_key, data?.file_name);
            // if (!data) {
            //     return toast({
            //         variant: "destructive",
            //         title: "Uh oh! Something went wrong.",
            //         description: "Try again later...",
            //     })    
            // } 
            // clearInterval(progressInterval)
            // setUploadProgress(100)
            // startPolling({ key: data.file_key });
        }}>
            {({getRootProps, getInputProps, acceptedFiles})=>(
                <div {...getRootProps()} className='border h-64 m-4 border-dashed border-gray-300 rounded-lg'>
                    <div className='flex items-center justify-center h-full w-full'>
                    <label
                    htmlFor='dropzone-file'
                    className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
                        <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                            <Cloud className='h-10 w-10 text-zinc-500 mb-2' />
                            <p className='mb-2 text-sm text-zinc-700'>
                                <span className='font-bold'>
                                    Click to upload
                                </span>{' '}
                                or drag and drop
                            </p>
                            <p className='text-xs text-zinc-500'>
                                PDF (up to 4 MB)
                            </p>
                        </div>

                        {acceptedFiles && acceptedFiles[0] ? (
                            <div className='max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200'>
                                <div className='px-3 py-2 h-full grid place-items-center'>
                                    <File className='h-6 w-6 text-blue-500' />
                                </div>
                                <div className='px-3 py-2 h-full text-sm truncate'>
                                    {acceptedFiles[0].name}
                                </div>
                            </div>
                        ):  null }

                        {isUploading ? (
                            <div className='w-full px-3 sm:px-0 mt-4 max-w-xs mx-auto'>
                                <Progress value={uploadProgress} className="h-1 w-full bg-zinc-200"/>
                            </div>
                        ): null}

                        <input {...getInputProps} type="file" id="dropzone-file" className="hidden" />
                    </label>
                    </div>
                </div>
            )}
        </Dropzone>
    )
}



export default UploadButton;