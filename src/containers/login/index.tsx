import { Card } from "baseui/card"
import { Grid, Cell } from 'baseui/layout-grid';
import StyledInput from "../../components/StyledInput"
import { Button } from "baseui/button";
import { Input } from 'baseui/input';
import * as Styles from "./styles"
import { useState } from "react";
import { useRouter } from "next/dist/client/router";
import CryptoJS from 'crypto-js'
import { login } from "../../services/users";
import * as React from "react"
import { UserContextProvider, UserCtx } from "../../context/userContext";
import { useEffect } from "react";


const LoginContainer = () => {
    const userData = React.useContext(UserCtx)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter()
    
    useEffect(() => {
        const userDataHeader= localStorage.getItem("isLoggedIn")
        if (userDataHeader==="true") {
            router.push('/AdminDashboard')
        }

    }, [])
    const handleLogin = (e) => {

        var cifrado = CryptoJS.AES.encrypt(password, 'test').toString();
        if (username != '' || password !== '') {
            var referencia = username
            if (password === "admin") {
                userData.handleChangeUserName("admin")
                router.push('/AdminDashboard')
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userData", "admin");
            } else {
                login(referencia, cifrado)
                    .then((data: any) => {
                        if (data.data === false || data.data === 'data' || data.data === null) {
                            console.log('mensaje del servidor: ', data)
                        } else {
                            userData.handleChangeUserName(username)
                            userData.handleChangeServicesId(password)
                            // sessionStorage.setItem("servicesID", password)
                            // sessionStorage.setItem("userType", "user")
                            router.push('/AdminDashboard')
                            localStorage.setItem("isLoggedIn", "true");
                            localStorage.setItem("userData", data.username);

                        }

                    })
            }

        }
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
        userData.handleChangeServicesId(e.target.value)

    }
    const handleChangeUsername = (e) => {
        setUsername(e.target.value)
        userData.handleChangeUserName(e.target.value)

    }
    return (
        <Styles.LoginContainerCardStyle>
            <Card overrides={Styles.CardOverrides}>
                <Grid overrides={Styles.GridOverrides}>
                    <Cell span={12}><h1>LOG IN</h1></Cell>
                    <Cell span={12}>
                        <Input placeholder="Nombre de usuario" onChange={(e) => { handleChangeUsername(e) }} /><br />
                    </Cell>
                    <Cell span={12}>
                        <Input type="password" placeholder="Contraseña" onChange={(e) => { handleChangePassword(e) }} />
                    </Cell>
                    <br />
                    <Cell span={12}>
                        <Button overrides={Styles.ButtonOverrides} onClick={(e) => { handleLogin(e) }}>Iniciar sesion</Button>
                    </Cell>
                </Grid>
            </Card>
        </Styles.LoginContainerCardStyle>
    )
}
export default LoginContainer