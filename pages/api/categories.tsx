import { NextApiRequest, NextApiResponse } from "next";
import {prisma} from "../../config/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async(req:NextApiRequest,res:NextApiResponse) => {
    const session = await unstable_getServerSession( req, res, authOptions );
    if(!session){ res.status(401).json({message:'Unauthorized'});};
    try {
        const categories = await prisma.category.findMany({
            where:{
                userId:session?.user?.id,
            },
            select:{
                products:{
                    select:{
                        name:true,
                        price:true,
                        id:true,
                        lastUpdate:true,
                        stock:true,                             
                    }
                },
                name:true,
                id:true,
            },    
        });
        res.status(200).json(categories);
    }catch(e){
        console.log(e);
        res.status(500).json({message:'Internal Server Error'});
    }
    res.end();
};