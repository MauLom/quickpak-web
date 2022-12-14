import * as React from 'react';
import { Input } from "baseui/input"
import { Button } from 'baseui/button';
import { FormControl } from "baseui/form-control";
import * as Style from "./styles"
import { Grid, Cell } from 'baseui/layout-grid';
import { HeadingMedium } from 'baseui/typography';
import { Card } from 'baseui/card';

const QuoterForm = ({submitAction}) => {
   

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        alert(value)
    };

    return (
        <Style.QuotesFormStyle onSubmit={submitAction}>
            <Card>
                <HeadingMedium>Informacion de envio</HeadingMedium>
                <Grid >
                    <Cell span={2}>
                        <FormControl
                            label={() => "Fecha"}
                            caption={() => "fecha de envio del paquete"}>
                            <Input name="date" />
                        </FormControl>
                    </Cell>
                    <Cell span={2}>
                        <FormControl
                            label={() => "Codigo postal de origen"}
                            caption={() => "codigo postal origen del envio"}>
                            <Input name="origin_zip" />
                        </FormControl>
                    </Cell>
                    <Cell span={2}>
                        <FormControl
                            label={() => "Ciudad de origen"}
                            caption={() => "Seleccione una de la lista"}>
                            <Input name="origin_city" />
                        </FormControl>
                    </Cell>
                    <Cell span={2}>
                        <FormControl
                            label={() => "Codigo postal de destino"}
                            caption={() => "codigo postal destino del envio"}>
                            <Input name="destiny_zip" />
                        </FormControl>
                    </Cell>
                    <Cell span={2}>
                        <FormControl
                            label={() => "Ciudad de origen"}
                            caption={() => "Seleccione una de la lista"}>
                            <Input name="destiny_city" />
                        </FormControl>
                    </Cell>
                </Grid>
                <Card>
                    <HeadingMedium>Informacion de paquete(s)</HeadingMedium>
                    <Grid>
                        <Cell span={2}>
                            <FormControl
                                label={() => "Peso"}
                                caption={() => "fecha de envio del paquete"}>
                                <Input name="weight" />
                            </FormControl>
                        </Cell>
                        <Cell span={2}>
                            <FormControl
                                label={() => "Alto"}
                                caption={() => "codigo postal origen del envio"}>
                                <Input name="height" />
                            </FormControl>
                        </Cell>
                        <Cell span={2}>
                            <FormControl
                                label={() => "Ancho"}
                                caption={() => "Seleccione una de la lista"}>
                                <Input name="width" />
                            </FormControl>
                        </Cell>
                        <Cell span={2}>
                            <FormControl
                                label={() => "Profundidad"}
                                caption={() => "codigo postal destino del envio"}>
                                <Input name="lenght" />
                            </FormControl>
                        </Cell>
                        <Cell span={2}>
                            {/* <FormControl
                                label={() => "Ciudad de origen"}
                                caption={() => "Seleccione una de la lista"}>
                                <Input name="destiny_city" />
                            </FormControl> */}
                        </Cell>
                    </Grid>
                </Card>
            </Card>

            <Button type="submit">Submit</Button>
        </Style.QuotesFormStyle>


    )
}

export default QuoterForm;