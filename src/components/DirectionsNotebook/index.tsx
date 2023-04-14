import * as React from "react"
import { Card } from "baseui/card";
import { Input } from "baseui/input"
import { Button } from 'baseui/button';
import { FormControl } from "baseui/form-control";
import { Grid, Cell } from 'baseui/layout-grid';
const DirectionsNotebook = ({ dataUser }) => {

    const handleSubmitButton = (e) => {
        e.preventDefault()
        const direccionData = {
            referencia:e.target.dnref.value,
            name:e.target.name.value,
            company: e.target.company.value,
            phone: e.target.phone.value,
            email: e.target.email.value,
            streets1: e.target.streets1.value,
            streets2: e.target.streets2.value,
            streets3: e.target.streets3.value,

        }
        const URLSaveNotebook = "https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2/getUsers/saveDirection"
        fetch(URLSaveNotebook, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': 'true',
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                "idServices": dataUser.idServices,
                "referencia": e.target.dnref.value,
                "direccion": direccionData
            })
        })
    }
    return (
        <Card>
            <form onSubmit={handleSubmitButton}  >
                <Grid>
                    <Cell span={12}>
                        <FormControl
                            label={() => "Identificador datos"}
                            caption={() => "Referencia para buscar datos en direccion"}>
                            <Input name="dnref" />
                        </FormControl>
                    </Cell>
                    <Cell span={3}>
                        <FormControl
                            label={() => "Nombre del sitio"}
                            caption={() => "Sitio donde reciben el paquete"}>
                            <Input name="name" />
                        </FormControl>
                    </Cell>
                    <Cell span={3}>
                        <FormControl
                            label={() => "Compania"}
                            caption={() => "Nombre de compania desde donde se recibe"}>
                            <Input name="company" />
                        </FormControl>
                    </Cell>
                    <Cell span={3}>
                        <FormControl
                            label={() => "Numero de contacto"}
                            caption={() => "Contacto"}>
                            <Input name="phone" />
                        </FormControl>
                    </Cell>
                    <Cell span={3}>
                        <FormControl
                            label={() => "Email"}
                            caption={() => "Correo electronico del contacto"}>
                            <Input name="email" />
                        </FormControl>
                    </Cell>

                    <Cell span={4}>
                        <FormControl
                            label={() => "Calle de referencia 1"}
                            caption={() => "*Opcional, referencia a destino"}>
                            <Input name="streets1" />
                        </FormControl>
                    </Cell>
                    <Cell span={4}>
                        <FormControl
                            label={() => "Calle de referencia 2"}
                            caption={() => "*Opcional, referencia a destino"}>
                            <Input name="streets2" />
                        </FormControl>
                    </Cell>

                    <Cell span={4}>
                        <FormControl
                            label={() => "Calle de referencia 3"}
                            caption={() => "*Opcional, referencia a destino"}>
                            <Input name="streets3" />
                        </FormControl>
                    </Cell>
                    <Cell span={12}>
                        <Button type="submit">Guardar Datos</Button>
                    </Cell>
                </Grid>
            </form>
        </Card>
    )
}

export default DirectionsNotebook