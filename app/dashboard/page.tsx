'use client'
import { Button, Grid, GridItem, Stack } from '@chakra-ui/react'
import { useSession, signIn, signOut } from "next-auth/react"
import DrawerNavigation from '../components/drawer-menu/nav'
import { SettingsIcon } from "@chakra-ui/icons"
import LabelsForm from '../components/labels/form'
import LabelsTable from '../components/labels/table'
import { useState } from 'react'
import UsersEdit from '../components/users/edit'
import DataSettingsValues from '../components/settings/data/values'
import DataSettingsAccounts from '../components/settings/data/accounts'
import QuotesBoard from '../components/quotes/board'
import LabelsBoard from '../components/labels/board'
export default function Dashboard() {
    const { data: session } = useSession()
    const [contentToRender, setContentToRender] = useState()


    const menuOptions = [
        { label: "Resumen", component: "", data: "" },
        { label: "Cotizar", component: <QuotesBoard />, data: "" },
        { label: "Generar guias", component: <LabelsBoard />, data: "" },
        { label: "Guias generadas", component: <LabelsTable />, data: "" },
        { label: "Administrar usuarios", component: <UsersEdit />, data: "" },
        { label: "Administrar valores", component: <DataSettingsValues />, data: "" },
        { label: "Administrar cuentas", component: <DataSettingsAccounts />, data: "" },
    ]



    if (session) {
        return (
            <Grid>
                <GridItem>
                    <DrawerNavigation menuOptions={menuOptions} changeContent={setContentToRender} />
                    <Button colorScheme='cyan'>
                        <SettingsIcon />
                    </Button>
                    <Button onClick={() => signOut()}>Cerrar sesion</Button>

                    {/* Signed in as {session?.user?.email} <br /> */}
                </GridItem>
                <GridItem>
                    {contentToRender}
                </GridItem>

            </Grid>
        )
    }
    return (
        <Grid templateColumns='repeat(2, 1fr)'>
            <GridItem>
                Previsualizacion de landing, o imagenes
            </GridItem>
            <GridItem>
                <Stack>
                    <Button onClick={() => signIn()}>
                        Iniciar sesion
                    </Button>
                </Stack>
            </GridItem>
        </Grid>
    )
}