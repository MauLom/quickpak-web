'use client'
// pages/login.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { setCookie } from '../lib/manageUserSession'
import { FormControl, FormLabel, Input, Grid, GridItem, Button, Box} from "@chakra-ui/react"
const URL = process.env.NEXT_PUBLIC_API_URL

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter()

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            // Your login logic here
            const response = await fetch(`${URL}login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {

                const data = await response.json()
                setCookie("userId", data.id, 1)
                setCookie("userRole", data.role, 1)
                router.push('/dashboard', { scroll: false })
            } else {
                // Handle login failure
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
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
    );
};

export default Login;
