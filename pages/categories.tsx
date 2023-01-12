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
} from "@mantine/core";
import { useForm, zodResolver } from '@mantine/form';
import { BiCategory } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import { MdWarningAmber } from 'react-icons/md';
import { useGetCategories, usePostCategory } from '../queries/CategoryQueries';
import { GetCategory } from '../types/getCategories';
import { PostCategorySchema } from '../types/postCategory';
import { queryClient } from './_app';


const categories: CustomNextPage = () => {
    const { data: categories, isLoading: categoriesLoading } = useGetCategories();

    // Accordion State
    const [accordionValue,setAccordionValue] = useState<string |null>(null);

    // Search value and data
    const [selectData, setSelectData] = useState<GetCategory['name'][]>([]);
    const [selectValue, setSelectValue] = useState<GetCategory['name'] | null>();

    // Filter value
    const [filteredValues, setFilteredValues] = useState<GetCategory[]>();

    // Modal State
    const [createModal,setCreateModal] = useState<boolean>(false);


    // Set select data for search
    useEffect(()=>{
        setSelectData([]);
        if(categories){
            categories.map((ctg)=>
                setSelectData((selectData)=>[...selectData,ctg.name])
            );
        }
        setFilteredValues(categories);
    },[categories]);


    // Filter Data
    useEffect(()=>{
        if(selectValue){
            setFilteredValues(
                categories?.filter((ctg)=>ctg.name === selectValue)
            );
        } else {
            setFilteredValues(categories);
        }
    },[selectValue,categories]);

    // Validate post category form
    const createCategoryForm = useForm({
        validate: zodResolver(PostCategorySchema),
        initialValues:{
            name: "",
        },
    });

    const { mutate : postCategory , isLoading : postCategoryLoading} = usePostCategory();



    return (
        <main>
            {/* Title */}
            <Group align='center' mb='3rem'>
                <Title size='1.5rem' weight='500'>Categories</Title>
                <ThemeIcon variant='light' size='md' color='blue'>
                    <BiCategory size={25} />
                </ThemeIcon>
            </Group>

            {/* Select Component */}
            <Select
                data={selectData}
                value={selectValue}
                onChange={setSelectValue}
                clearable
                searchable
                nothingFound='No Categories Found'
                icon={<FiSearch />}
                transition='pop-top-left'
                transitionDuration={80}
                transitionTimingFunction='ease'
                sx={{ maxWidth: '600px' }}
                mb='1.5rem'
            />

            {/* No Categories */}
            {categories?.length === 0 && !categoriesLoading && (
            <Box>
                <Group align='center'>
                    <Text size='lg'>No Categories</Text>
                    <FiSearch size={20}/>
                </Group>
            </Box>
            )}



            {/* Accordion */}
            <Skeleton
              mb='3rem'
              visible = {categoriesLoading ?? false}
              style = {{minHeight:'80px'}}
              animate
            >
                <Accordion value={accordionValue} onChange={setAccordionValue} transitionDuration={500} >
                    {
                        filteredValues?.map((category:GetCategory , index)=>(
                            <Accordion.Item 
                              value={category.name} 
                              sx={{overflow:'auto'}} 
                              key={index} 
                            >
                                <Accordion.Control>{category.name}</Accordion.Control>
                                <Accordion.Panel 
                                  sx={{width:'max-content' , minWidth:'100%'}} 
                                >
                                    <Table verticalSpacing='md' horizontalSpacing='md' >
                                        <thead>
                                            <tr>
                                            <th style={{paddingLeft:'0'}} >Name</th>
                                            <th style={{paddingLeft:'0'}} >Price</th>
                                            <th style={{paddingLeft:'0'}} >Id</th>
                                            <th style={{paddingLeft:'0'}} >Last Update</th>
                                            <th style={{paddingLeft:'0'}} >Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {category?.products?.map(product=>(
                                            <tr key={product.name}>
                                                <td>
                                                    <div style={{paddingRight:'1rem'}} >
                                                        {product.name}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{paddingRight:'1rem'}} >
                                                        {product.price}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{paddingRight:'1rem'}} >
                                                        {product.id}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{paddingRight:'1rem'}} >
                                                        {product.lastUpdate.toString()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{paddingRight:'1rem'}} >
                                                        {product?.stock ?? 0}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>

                                    
                                </Accordion.Panel>

                            </Accordion.Item>
                        ))
                    }
                </Accordion>
            </Skeleton>

            {/* Categories Controls */}
            <Box>
                <Button variant='light' color='blue' onClick={()=>setCreateModal(true) }>
                    Create Category
                </Button>
            </Box>



            {/* Modal for categories */}

            {/* Create categories */}
            <Modal
              centered
              opened={createModal}
              onClose={()=> setCreateModal(false)}
              title="Create Category"
            >
                <form
                  onSubmit={createCategoryForm.onSubmit((values)=>{
                    postCategory(values,{
                        onSuccess:()=> {
                            setCreateModal(false);
                            queryClient.refetchQueries(['categories']);                            
                        },
                    });
                  })}
                >
                    <LoadingOverlay 
                      transitionDuration={500}
                      visible={postCategoryLoading ?? true}
                    />
                    <TextInput
                      placeholder='Category Name'
                      label="category name"
                      withAsterisk
                      mb='1rem'
                      {...createCategoryForm.getInputProps("name")}
                    />
                    
                    <Group noWrap={false}>
                        <Button type='submit'>Create</Button>
                        <Button color='red' onClick={()=> setCreateModal(false)}>Exit</Button>
                    </Group>
                </form>
            </Modal>

        </main>
    )
};



export default categories;
categories.requireAuth = true;