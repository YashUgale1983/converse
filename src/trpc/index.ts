import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db"; 
import {string, z} from "zod";

export const appRouter = router({
    authCallback: publicProcedure.query(async ()=>{
        const {getUser} = await getKindeServerSession();
        const user = await getUser();

        if(!user || !user.id || !user.email){
            throw new TRPCError({code: "UNAUTHORIZED"});
        }

        // check is the user exists in the database
        const dbUser = await db.user.findFirst({
            where: {
                id: user.id
            }
        })

        if(!dbUser){
            await db.user.create({
                data:{
                    id: user.id,
                    email: user.email
                }
            })
        }

        return {success: true}
    }),
});

export type AppRouter = typeof appRouter;