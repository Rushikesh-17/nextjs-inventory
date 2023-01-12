import React, { useEffect, useState } from 'react';
import { CustomNextPage } from '../types/CustomNextPage';
import {
    Title,
    Group,
    ThemeIcon,
    Box,
    Button,
    Table,
    Select,
    Skeleton,
    Modal,
    TextInput,
    Text,
    LoadingOverlay,
    Accordion,
    NumberInput
} from "@mantine/core";
import { useForm, zodResolver } from '@mantine/form';
import { FiSearch } from 'react-icons/fi';
import { MdWarningAmber } from 'react-icons/md';
import { TbClipboardList } from "react-icons/tb";
import { useGetProducts, usePostProduct, useUpdateProd,useDeleteProduct } from '../queries/ProductQueries';
import { GetProduct } from '../types/getProducts';
import { PostProductSchema } from '../types/postProduct';
import { queryClient } from './_app';
import { UpdateProductSchema } from '../types/updateProduct';
import { DeleteProductSchema } from '../types/deleteProducts';



const Products: CustomNextPage = () => {
    const { data: products, isLoading: productsLoading } = useGetProducts();

    // Accordion State
    const [accordionValue, setAccordionValue] = useState<string | null>(null);

    // Search value data
    const [selectData, setSelectData] = useState<GetProduct["name"][]>([]);
    const [selectValue, setSelectValue] = useState<GetProduct["name"] | null>();

    // Filter values
    const [filteredValues, setFilteredValues] = useState<GetProduct[]>();

    // Modal State
    const [createModal, setCreateModal] = useState<boolean>(false);

    // Modal for update
    const [updateModal, setUpdateModal] = useState<boolean>(false);

    // Modal For delete
    const [deleteModal, setDeleteModal] = useState<boolean>(false);



    // Set Select data for search
    useEffect(() => {
        setSelectData([]);
        if (products) {
            products.map((prod) =>
                setSelectData((selectData) => [...selectData, prod.name])
            );
        }
        setFilteredValues(products);
    }, [products]);

    // Filter Data
    useEffect(() => {
        if (selectValue) {
            setFilteredValues(
                products?.filter((ctg) => ctg.name === selectValue)
            );
        } else {
            setFilteredValues(products);
        }
    }, [selectValue, products]);

    // Validate post product form
    const createProductForm = useForm({
        validate: zodResolver(PostProductSchema),
        initialValues: {
            name: "",
            price: 0,
            catname: "",
            stock: 0,

        },
    });

    const { mutate: postProducts, isLoading: postProductsLoading } = usePostProduct();


    // Validate update product form
    const updateProductForm = useForm({
        validate: zodResolver(UpdateProductSchema),
        initialValues: {
            name: "",
            price: 0,
            stock: 0,
        }
    })

    const { mutate: updateProduct, isLoading:updateProductLoading } = useUpdateProd();

    const deleteProductForm = useForm({
        validate:zodResolver(DeleteProductSchema),
        initialValues: {
            name: "",
        }
    })
    const { mutate: deleteProduct, isLoading:deleteProductLoading } = useDeleteProduct();





    return (
        <main>
            {/* Title */}
            <Group align='center' mb='3rem'>
                <Title size='1.5rem' weight='500'>Products</Title>
                <ThemeIcon variant='light' size='md' color='blue'>
                    <TbClipboardList size={25} />
                </ThemeIcon>
            </Group>

            {/* Select Component */}
            <Select
                data={selectData}
                value={selectValue}
                onChange={setSelectValue}
                clearable
                searchable
                nothingFound='No Products Found'
                icon={<FiSearch />}
                transition='pop-top-left'
                transitionDuration={80}
                transitionTimingFunction='ease'
                sx={{ maxWidth: '600px' }}
                mb='1.5rem'
            />

            {/* No products */}
            {products?.length === 0 && !productsLoading && (
                <Box>
                    <Group align='center'>
                        <Text size='lg'>No Products</Text>
                        <FiSearch size={20} />
                    </Group>
                </Box>
            )}




            {/* Accordion */}
            <Skeleton
                mb='3rem'
                visible={productsLoading ?? false}
                style={{ minHeight: '80px' }}
                animate
            >
                <Accordion value={accordionValue} onChange={setAccordionValue} transitionDuration={500} >
                    {
                        filteredValues?.map((product: GetProduct, index) => (
                            <Accordion.Item
                                value={product.name}
                                sx={{ overflow: 'auto' }}
                                key={index}
                            >
                                <Accordion.Control>{product.name}</Accordion.Control>
                                <Accordion.Panel
                                    sx={{ width: 'max-content', minWidth: '100%' }}
                                >
                                    <Table verticalSpacing='md' horizontalSpacing='md' >
                                        <thead>
                                            <tr>
                                                <th style={{ paddingLeft: '0' }} >Name</th>
                                                <th style={{ paddingLeft: '0' }} >Price</th>
                                                <th style={{ paddingLeft: '0' }} >Id</th>
                                                <th style={{ paddingLeft: '0' }} >Last Update</th>
                                                <th style={{ paddingLeft: '0' }} >Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr key={product.name}>
                                                <td style={{ paddingLeft: '0' }}>
                                                    <div>
                                                        {product.name}
                                                    </div>
                                                </td>
                                                <td style={{ paddingLeft: '0' }}>
                                                    <div>
                                                        {product.price}
                                                    </div>
                                                </td>
                                                <td style={{ paddingLeft: '0' }}>
                                                    <div>
                                                        {product.id}
                                                    </div>
                                                </td>
                                                <td style={{ paddingLeft: '0' }}>
                                                    <div>
                                                        {product.lastUpdate.toString()}
                                                    </div>
                                                </td>
                                                <td style={{ paddingLeft: '0' }}>
                                                    <div>
                                                        {product?.stock ?? 0}
                                                    </div>
                                                </td>
                                            </tr>


                                        </tbody>
                                    </Table>

                                    <Group>
                                        <Button mt='1.5rem' color='blue'
                                            onClick={() => {
                                                setUpdateModal(true);
                                        }}>
                                            Change Details
                                        </Button>
                                        <Button mt='1.5rem' color='red' 
                                            onClick={() => {
                                                setDeleteModal(true);
                                        }}>
                                            Delete
                                        </Button>
                                    </Group>

                                    {/* Delete Product */}
                                    <Modal
                                        centered
                                        opened={deleteModal}
                                        onClose={()=> setDeleteModal(false)}
                                        title="Delete Product"
                                    >
                                        <form
                                            onSubmit={deleteProductForm.onSubmit((value)=>{
                                                deleteProduct(value,{
                                                    onSuccess:()=>{
                                                        ()=>setDeleteModal(false);
                                                        queryClient.refetchQueries(['products']);
                                                    }
                                                });
                                            })}
                                        >
                                            <Text>
                                                Are you sure you want to delete product : {product.name}
                                            </Text>
                                            <TextInput
                                                label="Enter Product Name to confirm"
                                                placeholder='DELETE'
                                                withAsterisk
                                                {...deleteProductForm.getInputProps("name")}
                                            />
                                            {deleteProductForm.values.name===product.name && <Button color='red' type='submit'>DELETE</Button>}
                                        </form>
                                    </Modal>

                                    {/* Update Product */}

                                    <Modal
                                        centered
                                        opened={updateModal}
                                        onClose={() => setUpdateModal(false)}
                                        title='Update info'
                                    >
                                        <form onSubmit={updateProductForm.onSubmit((values) => {
                                            updateProduct(values,{
                                                onSuccess:()=>{
                                                    setUpdateModal(false);
                                                    queryClient.refetchQueries(['products']);
                                                },
                                            });
                                        })}>
                                            <TextInput
                                                placeholder='Name'
                                                label="Name"
                                                withAsterisk
                                                mb='1rem'
                                                {...updateProductForm.getInputProps("name")}
                                            />
                                            <NumberInput
                                                placeholder='Price'
                                                label="Price"
                                                withAsterisk
                                                mb="1rem"
                                                type="number"
                                                {...updateProductForm.getInputProps("price")}
                                            />
                                            <NumberInput
                                                placeholder='Stock'
                                                label="Stock"
                                                withAsterisk
                                                mb="1rem"
                                                type="number"
                                                {...updateProductForm.getInputProps("stock")}
                                            />
                                            <Group noWrap={false}>
                                                <Button type='submit'>Create</Button>
                                                <Button 
                                                  color='red' 
                                                  onClick={() => setUpdateModal(false)}
                                                >Exit</Button>
                                            </Group>
                                        </form>
                                    </Modal>
                                </Accordion.Panel>

                            </Accordion.Item>
                        ))
                    }
                </Accordion>
            </Skeleton>

            {/* products Controls */}
            <Box>
                <Button variant='light' color='blue' onClick={() => setCreateModal(true)}>
                    Create product
                </Button>
            </Box>



            {/* Modal for products */}

            {/* Create products */}
            <Modal
                centered
                opened={createModal}
                onClose={() => setCreateModal(false)}
                title="Create products"
            >
                <form
                    onSubmit={createProductForm.onSubmit((values) => {
                        postProducts(values, {
                            onSuccess: () => {
                                setCreateModal(false);
                                queryClient.refetchQueries(['products']);
                            },
                        });
                    })}
                >
                    <LoadingOverlay
                        transitionDuration={500}
                        visible={postProductsLoading ?? true}
                    />
                    <TextInput
                        placeholder='Product Name'
                        label="Product name"
                        withAsterisk
                        mb='1rem'
                        {...createProductForm.getInputProps("name")}
                    />
                    <NumberInput
                        placeholder='Product Price'
                        label="Product Price"
                        withAsterisk
                        mb="1rem"
                        {...createProductForm.getInputProps("price")}
                        type='number'
                    />
                    <TextInput
                        placeholder='Category Name'
                        label="Category name"
                        withAsterisk
                        mb='1rem'
                        {...createProductForm.getInputProps("catname")}
                    />
                    <NumberInput
                        placeholder='Product Stock'
                        label="Product Stock"
                        withAsterisk
                        mb="1rem"
                        {...createProductForm.getInputProps("stock")}
                        type="number"
                    />

                    <Group noWrap={false}>
                        <Button type='submit'>Create</Button>
                        <Button color='red' onClick={() => setCreateModal(false)}>Exit</Button>
                    </Group>
                </form>
            </Modal>








        </main>
    )
};



export default Products;
Products.requireAuth = true;