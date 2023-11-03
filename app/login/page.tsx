'use client'
// pages/login.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { setCookie } from '../lib/manageUserSession'
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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
