import {
    MantineNumberSize,
    ActionIcon,
    Box,
    Navbar,
    ScrollArea,
    useMantineColorScheme,
    Title,
    ThemeIcon,
    UnstyledButton,
    Group,
    Text,
    Avatar,
    useMantineTheme
} from '@mantine/core';
import React from 'react';

import { BsBox, BsMoonFill } from "react-icons/bs";
import { GoArchive } from "react-icons/go";
import { BiCategory, BiTab } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { ImSun } from "react-icons/im";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import { FiSettings } from "react-icons/fi";
import { TbClipboardList } from "react-icons/tb";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';




const Brand = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    return (
        <Box
            sx={(theme) => ({
                paddingLeft: theme.spacing.xs,
                paddingRight: theme.spacing.xs,
                paddingBottom: theme.spacing.lg,
                borderBottom: `1px solid ${theme.colorScheme === 'dark'
                        ? theme.colors.dark[6]
                        : theme.colors.gray[2]
                    } `,
            })}
        >
            <Group position='apart' align='center'>
                {/*LOGO*/}
                <Group>
                    <ThemeIcon
                        variant='gradient'
                        gradient={{ from: "indigo", to: "cyan" }}
                        size='lg'
                        radius={100}
                    >
                        <GoArchive size={18} />
                    </ThemeIcon>
                    <Title size={'1.2rem'} weight={400} sx={{ fontStyle: "italic" }}>
                        Inventory
                    </Title>
                </Group>

                {/* THEME TOGGLE */}
                <ActionIcon
                    variant='default'
                    onClick={() => toggleColorScheme()}
                    size={30}
                >
                    {colorScheme === "dark" ? <ImSun size={18} /> : <BsMoonFill size={18} />}
                </ActionIcon>

            </Group>
        </Box>
    );
};
interface MainLinkProps {
    icon: React.ReactNode;
    color: string;
    label: string;
    pageLink: string;
    setOpened:any;
    
}

const MainLink = ({ 
    icon, 
    color, 
    label, 
    pageLink,
    setOpened,
}: MainLinkProps) => {

    const { pathname } = useRouter();
    return (
        <Link href={pageLink} passHref>
            <UnstyledButton
                onClick={() => setOpened(false)}
                sx={(theme) => ({
                    display: "block",
                    width: '100%',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                    backgroundColor:
                        pathname === pageLink
                            ? theme.colorScheme === 'dark'
                                ? theme.colors.dark[6]
                                : theme.colors.gray[4]
                            : "transparent",
                    "&:hover": {
                        backgroundColor:
                            theme.colorScheme === 'dark'
                                ? theme.colors.dark[4]
                                : theme.colors.gray[2],
                    },
                })}
            >
                <Group>
                    <ThemeIcon color={color} variant={"light"}>
                        {icon}
                    </ThemeIcon>
                    <Text size='sm'>{label}</Text>
                </Group>
            </UnstyledButton>
        </Link>
    );
};

const data: MainLinkProps[] = [
    {
        icon: <AiOutlineHome size={18} />,
        color: "blue",
        label: "Home",
        pageLink: "/",
        setOpened: ()=>{},
    },
    {
        icon: <BiCategory size={18} />,
        color: "blue",
        label: "Categories",
        pageLink: "/categories",
        setOpened: ()=>{},
    },
    {
        icon: <BsBox size={18} />,
        color: "blue",
        label: "Inventory",
        pageLink: "/inventory",
        setOpened: ()=>{},
    },
    {
        icon: <TbClipboardList size={18} />,
        color: "blue",
        label: "Products",
        pageLink: "/products",
        setOpened: ()=>{},
    },
    {
        icon: <FiSettings size={18} />,
        color: "blue",
        label: "Settings",
        pageLink: "/settings",
        setOpened: ()=>{},
    },
];


const getWordInitials = (word: string): string =>{
    const bits = word.trim().split(" ");
    return bits.map((bit)=>bit.charAt(0))
        .join("")
        .toUpperCase();
}; 

const User = () => {
    const theme = useMantineTheme();
    const { data: session } = useSession();
    const { pathname } = useRouter();

    return( 
    <Link 
      passHref 
      href={
        pathname === "/settings" 
        ? "/" 
        : "/settings"
    }>
        <Box sx={{paddingTop:theme.spacing.sm,borderTop:`1px solid ${
            theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[4]
        }`}}>
            <UnstyledButton 
              sx={{
                display:'block', 
                width:'100%',
                padding:theme.spacing.xs,
                borderRadius:theme.radius.sm,
                color:theme.colorScheme==="dark" 
                ? theme.colors.dark[0] 
                : theme.black,
                "&:hover": {
                    backgroundColor:
                            theme.colorScheme === 'dark'
                                ? theme.colors.dark[4]
                                : theme.colors.gray[0],
                },
                }}
            >
                <Group>
                    <Avatar 
                      src={session?.user?.image} 
                      radius='xl' 
                      color='blue' 
                      variant='light'  
                    >
                        {`${getWordInitials(session?.user?.name ?? "")}`}
                    </Avatar>
                    <Box sx={{flex:1}}>
                        <Text size='sm' weight={500} >{session?.user?.name}</Text>
                    </Box>
                    {pathname =="/settings" ? (
                        <MdKeyboardArrowLeft size={18}/>
                    ):(
                        <MdKeyboardArrowRight size={18}/>
                    )}
                </Group>
            </UnstyledButton>
        </Box>
    </Link>
    );
}




const Nav = ({
    setOpened,
    opened,
    hiddenBreakpoint,
}: {
    setOpened:(value:boolean)=>void;
    opened: boolean;
    hiddenBreakpoint: MantineNumberSize;
}) => {
    return (
        <Navbar
            p='xs'
            width={{ sm: 300 }}
            hiddenBreakpoint={hiddenBreakpoint}
            hidden={!opened}
        >
            <Navbar.Section mt='xs'><Brand></Brand></Navbar.Section>
            <Navbar.Section grow mt='md'>
                {data.map((item, index) => (
                <MainLink {...item} key={item.label} setOpened={setOpened} />))}
            </Navbar.Section>
            <Navbar.Section>
                <User/>
            </Navbar.Section>
        </Navbar>
    )
}

export default Nav