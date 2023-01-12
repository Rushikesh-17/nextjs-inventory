import { prisma } from "../../config/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { NextApiRequest,NextApiResponse } from "next";
import { PostProductSchema } from "../../types/postProduct";
import products from "./products";

const product = async (req:NextApiRequest,res:NextApiResponse) => {
    const session = await unstable_getServerSession(req,res,authOptions);
    if(!session){ res.status(401).json({messsage:"Unauthorized"});}
    if (req.method==="POST"){
        const { name, price,stock,catname } = req.body;
        const response = PostProductSchema.safeParse(req.body);
        if(!response.success){
            res.status(400).json({message: response.error.issues})
        }
        try{
            const product = await prisma.product.create({
                data : {
                    name,
                    price,
                    catagory:{
                        connectOrCreate:{   
                            where:{
                                name:catname,
                            },
                            create:{
                                name:catname,
                                userId:session?.user?.id,
                            }
                        }
                    },
                   
                    stock:stock,
                        
                    user:{
                        connect:{
                            id:session?.user?.id,
                        }
                    }
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
export default product;