import * as React from "react"
import { Card } from "baseui/card";
import { Input } from "baseui/input"
import { Button } from 'baseui/button';
import { FormControl } from "baseui/form-control";
import { Grid, Cell } from 'baseui/layout-grid';
const DirectionsNotebook = ({ dataUser }) => {
    const [dataForm, setDataForm]: any = React.useState({})

    const handleSubmitButton = (e) => {
        e.preventDefault()
        const direccionData = {
            referencia: e.target.dnref.value,
            name: e.target.name.value,
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

    const getDirectionFromBD = () => {
        const URLGetNotebook = "http://localhost:8080/getUsers/getDirection"
        const response = fetch(URLGetNotebook, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': 'true',
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                "idServices": dataUser.idServices,
                "id": 0,
            })
        }).then(response => response.json())
            .then(data => setDataForm(data.data))
    }

    const handleFormDataChange = (e: any) => {
        switch (e.target.name) {
            case "dnref":
                setDataForm({ ...dataForm, 'referencia': e.target.value })
                break;
            case "name":
                setDataForm({ ...dataForm, 'name': e.target.value })
                break;
            case "company":
                setDataForm({ ...dataForm, 'company': e.target.value })
                break;
            case "phone":
                setDataForm({ ...dataForm, 'phone': e.target.value })
                break;
            case "email":
                setDataForm({ ...dataForm, 'email': e.target.value })
                break;
            case "streets1":
                setDataForm({ ...dataForm, 'streets1': e.target.value })
                break;
            case "streets2":
                setDataForm({ ...dataForm, 'streets2': e.target.value })
                break;
            case "streets3":
                setDataForm({ ...dataForm, 'streets3': e.target.value })
                break;

        }
    }

    React.useEffect(() => {
        getDirectionFromBD()
    }, [])
    return (
        <Card>
            <form onSubmit={handleSubmitButton}  >
                <Grid>
                    <Cell span={12}>
                        <FormControl
                            label={() => "Identificador datos"}
                            caption={() => "Referencia para buscar datos en direccion"}>
                            <Input name="dnref" value={dataForm?.referencia} onChange={(e) => { handleFormDataChange(e) }} />
                        </FormControl>
                    </Cell>
                    <Cell span={3}>
                        <FormControl
                            label={() => "Nombre del sitio"}
                            caption={() => "Sitio donde reciben el paquete"}>
                            <Input name="name" value={dataForm?.name} onChange={(e) => { handleFormDataChange(e) }} />
                        </FormControl>
                    </Cell>
                    <Cell span={3}>
                        <FormControl
                            label={() => "Compania"}
                            caption={() => "Nombre de compania desde donde se recibe"}>
                            <Input name="company" value={dataForm?.company} onChange={(e) => { handleFormDataChange(e) }} />
                        </FormControl>
                    </Cell>
                    <Cell span={3}>
                        <FormControl
                            label={() => "Numero de contacto"}
                            caption={() => "Contacto"}>
                            <Input name="phone" value={dataForm?.phone} onChange={(e) => { handleFormDataChange(e) }} />
                        </FormControl>
                    </Cell>
                    <Cell span={3}>
                        <FormControl
                            label={() => "Email"}
                            caption={() => "Correo electronico del contacto"}>
                            <Input name="email" value={dataForm?.email} onChange={(e) => { handleFormDataChange(e) }} />
                        </FormControl>
                    </Cell>

                    <Cell span={4}>
                        <FormControl
                            label={() => "Calle de referencia 1"}
                            caption={() => "*Opcional, referencia a destino"}>
                            <Input name="streets1" value={dataForm?.streets1} onChange={(e) => { handleFormDataChange(e) }} />
                        </FormControl>
                    </Cell>
                    <Cell span={4}>
                        <FormControl
                            label={() => "Calle de referencia 2"}
                            caption={() => "*Opcional, referencia a destino"}>
                            <Input name="streets2" value={dataForm?.streets2} onChange={(e) => { handleFormDataChange(e) }} />
                        </FormControl>
                    </Cell>

                    <Cell span={4}>
                        <FormControl
                            label={() => "Calle de referencia 3"}
                            caption={() => "*Opcional, referencia a destino"}>
                            <Input name="streets3" value={dataForm?.streets3} onChange={(e) => { handleFormDataChange(e) }} />
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