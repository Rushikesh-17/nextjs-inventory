import { Product } from "@prisma/client";


export interface GetProduct{
    id:Product['id'];
    name:Product['name'];
    stock:Product['stock'];
    price:Product['price'];
    lastUpdate:Product['lastUpdate']

}