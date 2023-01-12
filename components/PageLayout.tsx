import React, {useState} from 'react'
import { 
    AppShell, 
    Header, 
    Text, 
    MediaQuery, 
    Burger, 
    useMantineTheme 
} from '@mantine/core'
import { useSession } from 'next-auth/react'
import Nav from './Nav'


const PageLayout = ({ children }: any) => {
    const theme = useMantineTheme();
    const [opened,setOpened] = useState(false);



    return (
        <AppShell
            styles={{
                main:{
                    background:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[2],

                }
            }}
        navbarOffsetBreakpoint="sm"
        navbar={<Nav opened={opened} hiddenBreakpoint="sm" setOpened={setOpened}/>}
        header={
            <Header height={70} p="md">
                <div style={{display:'flex', alignItems:'center', height:"100%"}}>
                    {/*sm = 768px */}
                    <MediaQuery largerThan='sm' styles={{display:'none'}}>
                        <Burger
                            opened={opened} 
                            onClick={()=> setOpened(!opened)} 
                            size='md' 
                            color={theme.colors.gray[6]}
                            />
                    </MediaQuery>
                    <Text>Inventory</Text>
                </div>
            </Header>
        }
        >{children}</AppShell>
    )
}

export default PageLayout