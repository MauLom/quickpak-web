'use client'
import { Button, Grid, GridItem, Image, Stack } from '@chakra-ui/react'
import { useSession, signIn, signOut } from "next-auth/react"
import DrawerNavigation from '../components/drawer-menu/nav'
import { SettingsIcon } from "@chakra-ui/icons"
import LabelsForm from '../components/labels/form'
import LabelsTable from '../components/labels/table'
import { useEffect, useState } from 'react'
import UsersEdit from '../components/users/edit'
import DataSettingsValues from '../components/settings/data/values'
import DataSettingsAccounts from '../components/settings/data/accounts'
import QuotesBoard from '../components/quotes/board'
import LabelsBoard from '../components/labels/board'
import UsersLayout from '../components/users/layout'
import ResumeBoard from '../components/resume/board'

interface Iuser {
    id: string,
    name: string,
    matriz: string,
    role: string
}

export default function Dashboard() {
    const { data: session } = useSession()
    const [contentToRender, setContentToRender] = useState(<ResumeBoard />)
    const [user, setUser] = useState<Iuser>({})
    const menuOptions = [
        { label: "Resumen", component: <ResumeBoard />, data: "" },
        { label: "Cotizar", component: <QuotesBoard />, data: "" },
        { label: "Generar guias", component: <LabelsBoard />, data: "" },
        { label: "Guias generadas", component: <LabelsTable />, data: "" },
        { label: "Administrar usuarios", component: <UsersLayout />, data: "" },
        { label: "Administrar valores", component: <DataSettingsValues />, data: "" },
        { label: "Administrar cuentas", component: <DataSettingsAccounts />, data: "" },
    ]
    const menuClientOptions = [
        { label: "Resumen", component: <ResumeBoard />, data: "" },
        { label: "Cotizar", component: <QuotesBoard />, data: "" },
        { label: "Generar guias", component: <LabelsBoard />, data: "" },
        { label: "Guias generadas", component: <LabelsTable />, data: "" },
    ]

    const parseSessionToLegible = () => {
        if(session){
            const userUnParsed:any = session?.user
            const userParsed = {
                id: userUnParsed['id'],
                name: userUnParsed['name'],
                matriz: userUnParsed['email'],
                role: userUnParsed['image']
            }
            setUser(userParsed)
        }
    }

    useEffect(()=>{
        parseSessionToLegible()
    },[])

    if (session) {
        return (
            <Grid templateColumns='repeat(2, 1fr)' gap={2}>
                <GridItem>
                    <Button colorScheme='cyan'>
                        <SettingsIcon />
                    </Button>
                    <DrawerNavigation menuOptions={user.role === 'admin' ? menuOptions : menuClientOptions} changeContent={setContentToRender} />
                </GridItem>
                <GridItem>
                    {/* Conectado como: {session?.user} */}
                    <Button onClick={() => signOut()}>Cerrar sesion</Button>
                </GridItem>
                <GridItem colSpan={4}>
                    {contentToRender}
                </GridItem>
            </Grid>
        )
    }
    return (
        <Grid templateColumns='repeat(2, 1fr)' height="100%">
            <GridItem height="100%">
                <Image src="https://mumbaimirror.indiatimes.com/photo/81132317.cms" alt="landing-img" objectFit='cover' />
            </GridItem>
            <GridItem padding="20">
                {/* <Stack align="center" justifyContent="space-around"> */}
                <Button onClick={() => signIn()}>
                    Iniciar sesion
                </Button>
                {/* </Stack> */}
            </GridItem>
        </Grid>
    )
}