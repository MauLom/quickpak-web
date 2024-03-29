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
            <Grid templateColumns='repeat(2, 1fr)' height="100%" alignItems="center">
                <GridItem alignSelf="center" padding="20% 0 0 0" height="100%">
                    <Image src="https://i.ibb.co/0GvqQcH/1-c2-1.jpg" alt="1-c2-1" />

                </GridItem>
                <GridItem
                    style={{
                        fontFamily: "'Arial', sans-serif",
                        maxWidth: '400px',
                        margin: '50px auto',
                        padding: '40px',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center'
                    }}
                >
                    <Stack spacing={4}>
                        <Box>
                            <form onSubmit={handleLogin}>
                                <Grid gap={4} templateColumns="repeat(1, 1fr)">
                                    <GridItem>
                                        <FormControl>
                                            <FormLabel style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                                                Nombre de usuario
                                            </FormLabel>
                                            <Input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                                style={{
                                                    padding: '15px',
                                                    border: '2px solid #eaeaea',
                                                    borderRadius: '8px',
                                                    fontSize: '16px'
                                                }}
                                            />
                                        </FormControl>
                                    </GridItem>
                                    <GridItem>
                                        <FormControl>
                                            <FormLabel style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                                                Contraseña
                                            </FormLabel>
                                            <Input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                style={{
                                                    padding: '15px',
                                                    border: '2px solid #eaeaea',
                                                    borderRadius: '8px',
                                                    fontSize: '16px'
                                                }}
                                            />
                                        </FormControl>
                                    </GridItem>
                                    <GridItem>
                                        <Button
                                            colorScheme="teal"
                                            type="submit"
                                            style={{
                                                width: '100%',
                                                padding: '15px',
                                                borderRadius: '8px',
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                border: 'none',
                                                marginTop: '20px',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                            }}
                                        >
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