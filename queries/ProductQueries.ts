import { useQuery,useMutation } from "@tanstack/react-query";
import axios from "../config/axios";
import { type GetProduct } from "../types/getProducts";
import { PostProduct } from "../types/postProduct";
import { UpdateProduct } from "../types/updateProduct";
import { DeleteProduct } from "../types/deleteProducts";

const getProducts = async () : Promise<GetProduct[]> =>{
    const { data } = await axios.get("/products");
    return data;
};

const postProduct = async (props:PostProduct) =>{
    const { data } = await axios.post("/product",props);
    return data;
};

const updateProduct = async (props:UpdateProduct) =>{
    const { data } = await axios.put("/updateproduct",props);
    return data;
}

const deleteProduct = async (props:DeleteProduct) =>{
    const { data } = await axios.put("/deleteproduct",props);
    return data;
}


const useGetProducts = () => useQuery(['products'],getProducts);
const usePostProduct = () => useMutation(['postProduct'],postProduct);
const useUpdateProd = () => useMutation(['updateProduct'],updateProduct);
const useDeleteProduct = () => useMutation(['deleteProduct'],deleteProduct);



export { useGetProducts ,usePostProduct, useUpdateProd , useDeleteProduct };