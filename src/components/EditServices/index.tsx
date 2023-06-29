import * as React from "react"
import { Grid, Cell } from 'baseui/layout-grid';
import { Card } from "baseui/card";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Button } from 'baseui/button';
import {
    Checkbox,
    LABEL_PLACEMENT
} from "baseui/checkbox";
import { useState } from "react";


const EditServices = ({ dataUser }) => {
    const [checked, setChecked] = React.useState(false);

    const [G, setG] = React.useState(true)
    const [N, setN] = React.useState(true)
    const [I, setI] = React.useState(true)
    const [O, setO] = React.useState(true)
    const [Uno, setUno] = React.useState(true)



    const hadleClickedSubmit = (e) => {
        e.preventDefault()
        const data = {
            G: G,
            N: N,
            I: I,
            O: O,
            Uno: Uno
        }

        const URLEditServices = "http://localhost:8080/editservices"
        console.log(URLEditServices)
        fetch(URLEditServices, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': 'true',
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                "data": data,
                "user": dataUser
            })
        }).then(response => response.json())
            .then(data => console.log(data))
    }

    return (
        <Card>
            <Grid>
                <Cell span={12}> <h2>Editar servicios de paqueteria</h2></Cell>
                <Cell span={12}><hr /></Cell>
            </Grid>
            <Card>
                <form onSubmit={hadleClickedSubmit}>
                    <Grid>
                        <Cell span={4}>
                            <FormControl
                                label={() => "G"}
                                caption={() => "Servicio G"}>
                                <Checkbox
                                    checked={G}
                                    onChange={() => setG(!G)}>

                                </Checkbox>
                            </FormControl>
                        </Cell><Cell span={4}>
                            <FormControl
                                label={() => "N"}
                                caption={() => "Servicio N"}>
                                <Checkbox
                                    checked={N}
                                    onChange={() => setN(!N)}>

                                </Checkbox>
                            </FormControl>
                        </Cell>
                        <Cell span={4}>
                            <FormControl
                                label={() => "I"}
                                caption={() => "Servicio I"}>
                                <Checkbox
                                    checked={I}
                                    onChange={() => setI(!I)}>

                                </Checkbox>
                            </FormControl>
                        </Cell>
                        <Cell span={4}>
                            <FormControl
                                label={() => "O"}
                                caption={() => "Servicio O"}>
                                <Checkbox
                                    checked={O}
                                    onChange={() => setO(!O)}>

                                </Checkbox>
                            </FormControl>
                        </Cell>
                        <Cell span={4}>
                            <FormControl
                                label={() => "1"}
                                caption={() => "Servicio 1"}>
                                <Checkbox
                                    checked={Uno}
                                    onChange={() => setUno(!Uno)}>

                                </Checkbox>
                            </FormControl>
                        </Cell>
                        <Cell span={12}>
                            <Button type="submit">Guardar Datos</Button>
                        </Cell>

                    </Grid>
                </form>
            </Card>
        </Card>
    )
}

export default EditServices;
