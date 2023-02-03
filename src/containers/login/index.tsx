import { Card } from "baseui/card"
import { Grid, Cell } from 'baseui/layout-grid';
import StyledInput from "../../components/StyledInput"
import { Button } from "baseui/button";
import { Input } from 'baseui/input';
import * as Styles from "./styles"
import { useState } from "react";
import { useRouter } from "next/dist/client/router";
import CryptoJS from 'crypto-js'

const LoginContainer = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter()

    const HadelLogin = (e) => {
        setUsername(e.target.value)
        setPassword(e.target.value)
        var cifrado= CryptoJS.AES.encrypt(password,'test').toString();
        console.log('cifrado de texto',cifrado)
        var texto='U2FsdGVkX1967AMZZeI0OrgJHLmTzNOqRL8JfruBD9M='
        var descifrado=CryptoJS.AES.decrypt(texto,'test');
        var textofinal=descifrado.toString(CryptoJS.enc.Utf8);
        console.log('texto descifrado',textofinal)
        console.log(username, password)
        if (username != '' || password !== '') {
             const UrlLogin = "http://localhost:8080/getUsers/"
             var referencia = username
             fetch(UrlLogin, {
                 method: 'POST',
                 headers: {
                     'Access-Control-Allow-Origin': 'true',
                     'Content-type': 'application/json; charset=UTF-8',
                 },
                 body: JSON.stringify({
                     "referencia": referencia,
                     "idServices": cifrado
                 })
             })
                 .then(res => {
                     //console.log('response', res)
                     return res.json();

                 })
                 .then((data) => {
                     
                     if (data.data === false || data.data === 'data' || data.data === null) {
                        console.log('mensaje del servidor: ', data)
                     } else {
                         router.push('/AdminDashboard')
                     }


                 })
        }
    }
    return (
        <Styles.LoginContainerCardStyle>

            <Card overrides={Styles.CardOverrides}>

                <Grid overrides={Styles.GridOverrides}>
                    <Cell span={12}><h1>LOG IN</h1></Cell>
                    <Cell span={12}>
                        <Input placeholder="Nombre de usuario" onChange={(e) => { setUsername(e.target.value) }} /><br />
                    </Cell>
                    <Cell span={12}>
                        <Input type="password" placeholder="Contraseña" onChange={(e) => { setPassword(e.target.value) }} />
                    </Cell>
                    <br />
                    <Cell span={12}>
                        <Button overrides={Styles.ButtonOverrides} onClick={(e) => { HadelLogin(e) }}>Iniciar sesion</Button>
                    </Cell>
                </Grid>


            </Card>
        </Styles.LoginContainerCardStyle>
    )
}
export default LoginContainer