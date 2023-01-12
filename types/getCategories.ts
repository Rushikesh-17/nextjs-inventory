import { Category } from "@prisma/client";
import { Product } from '@prisma/client';

export type CategoryProduct = Product;

export interface GetCategory {
    id: Category["id"];
    name : Category["name"];
    products : CategoryProduct[];
}