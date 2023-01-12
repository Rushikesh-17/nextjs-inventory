import { prisma } from "../../config/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { NextApiRequest,NextApiResponse } from "next";
import { UpdateProductSchema } from "../../types/updateProduct";

export default async (req:NextApiRequest,res:NextApiResponse) => {
    const session = await unstable_getServerSession(req,res,authOptions);
    if(!session){ res.status(401).json({messsage:"Unauthorized"});}
    if (req.method==="PUT"){
        const { name,price, stock } = req.body;
        const response = UpdateProductSchema.safeParse(req.body);
        if(!response.success){
            res.status(400).json({message: response.error.issues})
        }
        try{
            const product = await prisma.product.update({
                where: {
                    name:name
                },
                data: {
                    price:price,
                    stock: stock,      
                    lastUpdate:Datetime(now)                      
                },
            });
            res.status(201).json(product);
        }catch(e){
            console.log(e);
            res.status(500).json({message:"Product post error"})
        }
    }
    


    res.end();
}