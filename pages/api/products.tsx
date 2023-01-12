import { NextApiRequest,NextApiResponse } from "next";
import { prisma } from "../../config/prisma";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const products = async ( req:NextApiRequest, res:NextApiResponse ) => {
    const session = await unstable_getServerSession(req,res,authOptions);
    if(!session){ res.status(401).json({message:"unauthorised"}) };
   try{
    const products = await prisma.product.findMany({
        where:{
            userId:session?.user?.id,
        },
        select:{
            name:true,
            price:true,
            id:true,
            catagory:{
                select:{
                    name:true,
                }
            },
            lastUpdate:true,
            stock:true,           
        },
    });
    res.status(200).json(products);
   }catch(e){
    console.log(e);
    res.status(401).json({message:"Internal Server Error"})
   }
    res.end();
};

export default products;