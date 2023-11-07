'use client'
import { Button, Grid, GridItem, Image, Stack, Box, FormControl, FormLabel, Input } from '@chakra-ui/react'
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
import { setCookie } from '../lib/manageUserSession'

interface Iuser {
    id: string,
    name: string,
    matriz: string,
    role: string
}
const URL = process.env.NEXT_PUBLIC_API_URL


export default function Dashboard() {
    const router = useRouter()

    const [contentToRender, setContentToRender] = useState<JSX.Element | null>(null); // Initialize as null or the default component

    const [user, setUser] = useState<Iuser>({ id: "", name: "", matriz: "", role: "" })
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(`${URL}login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();

                // Update user state with retrieved data
                setUser({
                    ...user,
                    id: data.id,
                    role: data.role,
                });

                setCookie("userId", data.id, 1);
                setCookie("userRole", data.role, 1);
                router.push('/dashboard', { scroll: false });
            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };



    function desconexion() {
        deleteCookie("userId")
        deleteCookie("userRole")
        setUser({ id: "", name: "", matriz: "", role: "" })
        router.push('/dashboard', { scroll: false })

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
        // { label: "Resumen", component: <ResumeBoard />, data: "" },
        { label: "Cotizar", component: <QuotesBoard />, data: "" },
        // { label: "Generar guias", component: <LabelsBoard />, data: "" },
        // { label: "Guias generadas", component: <LabelsTable />, data: "" },
        { label: "Desconexion", component: <Button onClick={() => desconexion()}>Cerrar sesion</Button>, data: "" }
    ]


    useEffect(() => {
        if (user.id !== '') {
            setContentToRender(user.role === 'admin' ? <ResumeBoard /> : <QuotesBoard />);
        }
    }, [user]);


    let contentToDisplay;

    if (user.id !== "") {
        contentToDisplay = (
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
        );
    } else {
        contentToDisplay = (
            <Grid templateColumns='repeat(2, 1fr)' height="100%">
                <GridItem height="100%">
                    <Image minH="40rem" src="https://mumbaimirror.indiatimes.com/photo/81132317.cms" alt="landing-img" />
                </GridItem>
                <GridItem padding="20">
                    <Stack>
                        <Image src="https://i.ibb.co/0GvqQcH/1-c2-1.jpg" alt="1-c2-1" />
                        <Box>
                            <form onSubmit={handleLogin}>
                                <Grid>
                                    <GridItem>
                                        <FormControl>
                                            <FormLabel>
                                                Nombre de usuario
                                            </FormLabel>
                                            <Input type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required />
                                        </FormControl>
                                    </GridItem>
                                    <GridItem>
                                        <FormControl>
                                            Contraseña
                                        </FormControl>
                                        <Input type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required />
                                    </GridItem>
                                    <GridItem>
                                        <Button colorScheme='teal' type="submit">
                                            Conectar
                                        </Button>
                                    </GridItem>
                                </Grid>

                            </form>
                        </Box>
                    </Stack>
                </GridItem>
            </Grid>
        );
    }

    return contentToDisplay
}