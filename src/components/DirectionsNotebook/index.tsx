import * as React from "react"
import { Card } from "baseui/card";
import { Input } from "baseui/input"
import { Button } from 'baseui/button';
import { FormControl } from "baseui/form-control";
import { Grid, Cell } from 'baseui/layout-grid';
const DirectionsNotebook = ({ dataUser }) => {

    const handleSubmitButton = () =>{
        console.log("Datauser ", dataUser)
    }
    return (
        <Card>
            <Grid>
                <Cell span={3}>
                    <FormControl
                        label={() => "Identificador datos"}
                        caption={() => "Referencia para buscar datos en direccion"}>
                        <Input name="dnref" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Nombre del sitio de origen"}
                        caption={() => "Sitio desde donde envian el paquete"}>
                        <Input name="oName" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Compania de origen"}
                        caption={() => "Nombre de compania desde donde se envia"}>
                        <Input name="oCompany" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Numero de contacto de origen"}
                        caption={() => "Contacto de origen"}>
                        <Input name="oPhone" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Email de origen"}
                        caption={() => "Correo electronico del contacto de origen"}>
                        <Input name="oEmail" />
                    </FormControl>
                </Cell>

                <Cell span={4}>
                    <FormControl
                        label={() => "Calle de referencia 1 de origen"}
                        caption={() => "*Opcional, referencia a origen"}>
                        <Input name="oStreets1" />
                    </FormControl>
                </Cell>
                <Cell span={4}>
                    <FormControl
                        label={() => "Calle de referencia 2 de origen"}
                        caption={() => "*Opcional, referencia a origen"}>
                        <Input name="oStreets2" />
                    </FormControl>
                </Cell>

                <Cell span={4}>
                    <FormControl
                        label={() => "Calle de referencia 3 de origen"}
                        caption={() => "*Opcional, referencia a origen"}>
                        <Input name="oStreets3" />
                    </FormControl>
                </Cell>

                {/*  */}

                <Cell span={3}>
                    <FormControl
                        label={() => "Nombre del sitio de destino"}
                        caption={() => "Sitio a donde envian el paquete"}>
                        <Input name="dName" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Compania de destino"}
                        caption={() => "Nombre compania de destino"}>
                        <Input name="dCompany" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Numero de contacto de destino"}
                        caption={() => "Numero de contacto del destino"}>
                        <Input name="dPhone" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Email de destino"}
                        caption={() => "Correo electronico del contacto de destino"}>
                        <Input name="dEmail" />
                    </FormControl>
                </Cell>
                <Cell span={4}>
                    <FormControl
                        label={() => "Calle de referencia 1 de destino"}
                        caption={() => "*Opcional, referencia a destino"}>
                        <Input name="dStreets1" />
                    </FormControl>
                </Cell>
                <Cell span={4}>
                    <FormControl
                        label={() => "Calle de referencia 2 de destino"}
                        caption={() => "*Opcional, referencia a destino"}>
                        <Input name="dStreets2" />
                    </FormControl>
                </Cell>
                <Cell span={4}>
                    <FormControl
                        label={() => "Calle de referencia 3 de destino"}
                        caption={() => "*Opcional, referencia a destino"}>
                        <Input name="dStreets3" />
                    </FormControl>
                </Cell>
                <Cell span={12}>
                    <Button onClick={() => handleSubmitButton()}  >Guardar Datos</Button>
                </Cell>
            </Grid>
        </Card>
    )
}

export default DirectionsNotebook