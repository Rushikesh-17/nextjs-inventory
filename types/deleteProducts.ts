import { z } from "zod";
const DeleteProductSchema = z.object({
    name: z.string().min(2,{message:"Product Name must be atleast 2 charecter long"}),   
});

type DeleteProduct = z.infer<typeof DeleteProductSchema>;
export{ DeleteProductSchema,type DeleteProduct};