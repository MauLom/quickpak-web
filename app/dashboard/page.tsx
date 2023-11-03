'use client'
import { Button, Grid, GridItem, Image, Stack } from '@chakra-ui/react'
import { useSession, signIn, signOut } from "next-auth/react"
import DrawerNavigation from '../components/drawer-menu/nav'
import { SettingsIcon } from "@chakra-ui/icons"
import LabelsForm from '../components/labels/form'
import LabelsTable from '../components/labels/table'
import { useEffect, useState } from 'react'
import { getCookie, deleteCookie } from '../lib/manageUserSession'



import QuotesBoard from '../components/quotes/board'
import LabelsBoard from '../components/labels/board'
import UsersLayout from '../components/users/layout'
import ResumeBoard from '../components/resume/board'
import { getUser } from '../lib/requests'
import { useRouter } from 'next/navigation'
import Login from '../login/page'

interface Iuser {
    id: string,
    name: string,
    matriz: string,
    role: string
}

export default function Dashboard() {
    const { data: session } = useSession()
    const router = useRouter()

    const [contentToRender, setContentToRender] = useState(<ResumeBoard />)
    const [user, setUser] = useState<Iuser>({ id: "", name: "", matriz: "", role: "" })

    function desconexion() {
        deleteCookie("userId")
        deleteCookie("userRole")
        router.push('/login', { scroll: false })

    }
    const menuOptions = [
        { label: "Resumen", component: <ResumeBoard />, data: "" },
        { label: "Cotizar", component: <QuotesBoard />, data: "" },
        { label: "Generar guias", component: <LabelsBoard />, data: "" },
        { label: "Guias generadas", component: <LabelsTable />, data: "" },
        { label: "Administrar usuarios", component: <UsersLayout />, data: "" },
        // { label: "Administrar valores", component: <DataSettingsValues />, data: "" },
        // { label: "Administrar cuentas", component: <DataSettingsAccounts />, data: "" },
        { label: "Desconexion", component: <Button onClick={() => desconexion()}>Cerrar sesion</Button>, data: "" }
    ]
    const menuClientOptions = [
        { label: "Resumen", component: <ResumeBoard />, data: "" },
        { label: "Cotizar", component: <QuotesBoard />, data: "" },
        { label: "Generar guias", component: <LabelsBoard />, data: "" },
        { label: "Guias generadas", component: <LabelsTable />, data: "" },
        { label: "Desconexion", component: <Button onClick={() => desconexion()}>Cerrar sesion</Button>, data: "" }
    ]

    async function loadUserFromId(id: string) {
        const data = await getUser(id)
        const userParsed = {
            id: data._id,
            name: data.userName,
            matriz: data.provider_access,
            role: data.role
        }
        setUser(userParsed)
    }


    useEffect(() => {
        const data = { userId: getCookie("userId"), userRole: getCookie("userRole") }

        if (data.userId && data.userRole) {
            loadUserFromId(data.userId)

        }

    }, [])

    if (user.id !== "") {
        return (
            <Grid templateColumns='repeat(2, 1fr)' gap={2}>
                <GridItem>
                    <Button colorScheme='cyan'>
                        <SettingsIcon />
                    </Button>
                    <DrawerNavigation menuOptions={user.role === 'admin' ? menuOptions : menuClientOptions} changeContent={setContentToRender} />
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
                <Image minH="40rem" src="https://mumbaimirror.indiatimes.com/photo/81132317.cms" alt="landing-img" />
            </GridItem>
            <GridItem padding="20">
                <Stack>
                    <Image src="https://i.ibb.co/0GvqQcH/1-c2-1.jpg" alt="1-c2-1" />
                    <Login />
                </Stack>
            </GridItem>
            <GridItem bgColor="teal" colSpan={2} >
                Informacion de pie de pagina
            </GridItem>
        </Grid>
    )
}