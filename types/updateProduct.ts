import { z } from "zod";
const UpdateProductSchema = z.object({
    name: z.string().min(2,{message:"Product Name must be atleast 2 charecter long"}) || null,    
    price:z.number().positive() || null,
    stock:z.number().positive() || null,
});

type UpdateProduct = z.infer<typeof UpdateProductSchema>;
export{ UpdateProductSchema,type UpdateProduct};