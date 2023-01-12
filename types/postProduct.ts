
import {z} from 'zod';
const PostProductSchema = z.object({
    name: z.string().min(2,{message:"Product Name must be atleast 2 charecter long"}),    
    price:z.number().positive(),
    catname:z.string().min(2,{message:"Category Name must be atleast 2 charecter long"}),
    stock:z.number().positive(),
});

type PostProduct = z.infer<typeof PostProductSchema>;
export{ PostProductSchema,type PostProduct};