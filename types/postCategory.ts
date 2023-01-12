import {z} from 'zod';

const PostCategorySchema = z.object({
    name: z.string().min(2,{message:"Name must be 2 charecter long"}),
});

type PostCategory = z.infer<typeof PostCategorySchema>;


export {type PostCategory , PostCategorySchema };
