import { prisma } from "../../config/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { NextApiRequest,NextApiResponse } from "next";

export default async (req:NextApiRequest, res:NextApiResponse) => {
    const session = await unstable_getServerSession(req,res,authOptions);
    if (!session) res.status(401).json({message:"Unauthorized"});
    if (req.method === "PUT"){
        const {name} = req.body;
        try {
            const deleteprod = await prisma.product.delete({
                where:{
                    name:name,
                },
            })
            res.status(201).json(deleteprod)
        } catch (e) {
            console.log(e);
            res.status(500).json({message:"Delete Prod error"})
            
        }
        res.end();
    }
}