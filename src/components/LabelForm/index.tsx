import * as React from 'react';

import { Input } from "baseui/input"
import { Button } from 'baseui/button';
import { FormControl } from "baseui/form-control";
const LabelForm = () => {
    return (
        <>
            <FormControl
                label={() => "Descripcion del paquete"}
                caption={() => "breve descripcion del contenido del paquete"}>
                <Input name="desc" />
            </FormControl>
            <FormControl
                label={() => "Nombre del sitio de origen"}
                caption={() => "quack"}>
                <Input name="oName" />
            </FormControl>
            <FormControl
                label={() => "Compania de origen"}
                caption={() => "quack"}>
                <Input name="oCompany" />
            </FormControl>
            <FormControl
                label={() => "Numero de contacto de origen"}
                caption={() => "oPhone"}>
                <Input name="oPhone" />
            </FormControl>
            <FormControl
                label={() => "Email de origen"}
                caption={() => "quack"}>
                <Input name="oEmail" />
            </FormControl>
            <FormControl
                label={() => "Calle de referencia 1 de origen"}
                caption={() => "quack"}>
                <Input name="oStreets" />
            </FormControl>
            <FormControl
                label={() => "Calle de referencia 2 de origen"}
                caption={() => "quack"}>
                <Input name="oStreets2" />
            </FormControl>
            <FormControl
                label={() => "Calle de referencia 3 de destino"}
                caption={() => "quack"}>
                <Input name="dName" />
            </FormControl>
            <FormControl
                label={() => "Compania de destino"}
                caption={() => "quack"}>
                <Input name="dCompany" />
            </FormControl>
            <FormControl
                label={() => "Numero de contacto de destino"}
                caption={() => "oPhone"}>
                <Input name="dPhone" />
            </FormControl>
            <FormControl
                label={() => "Email de destino"}
                caption={() => "quack"}>
                <Input name="dEmail" />
            </FormControl>
            <FormControl
                label={() => "Calle de referencia 1 de destino"}
                caption={() => "quack"}>
                <Input name="dStreets" />
            </FormControl>
            <FormControl
                label={() => "Calle de referencia 2 de destino"}
                caption={() => "quack"}>
                <Input name="dStreets2" />
            </FormControl>
            <FormControl
                label={() => "Calle de referencia 3 de destino"}
                caption={() => "quack"}>
                <Input name="dStreets3" />
            </FormControl>
        </>
    )
}
export default LabelForm