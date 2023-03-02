import * as React from "react"
import { Grid, Cell } from "baseui/layout-grid"
import { HeadingMedium } from 'baseui/typography';
import { Card } from 'baseui/card';
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Button } from "baseui/button"
import * as Styles from "./styles"

const GeneralValuesSettingsContainer = () => {
    const handleSubmit = (e) => {
        console.log("Aerial", e.target.aerial.value)
        console.log("Land", e.target.land.value)
    }

    return (
        <Card>
            <Grid>
                <Cell span={12}>
                    <HeadingMedium>Costos de tarifas por combustible</HeadingMedium>
                </Cell>
                <Cell span={12}>
                    <Styles.GeneralValuesFormStyle onSubmit={handleSubmit}>
                        <Grid>
                            <Cell span={5}>
                                <FormControl
                                    label={() => "Servicio Aereo"}
                                    caption={() => "Tipo servicio N / Dia Siguiente"}
                                >
                                    <Input name="aerial"/>
                                </FormControl>
                            </Cell>
                            <Cell span={5}>
                                <FormControl
                                    label={() => "Servicio Terrestre"}
                                    caption={() => "Tipo servicio G / Terrestre"}
                                >
                                    <Input name="land"/>
                                </FormControl>
                            </Cell>
                            <Cell span={12}>
                                <Button type="submit" disabled={false} >Guardar</Button>
                            </Cell>
                        </Grid>
                    </Styles.GeneralValuesFormStyle>
                </Cell>

                {/* <Cell span={5}>
                    <FormControl
                        label={() => "Servicio Aereo Estafeta"}
                        caption={() => "Tipo servicio Dia Sig."}
                    >
                        <Input />
                    </FormControl>
                </Cell>
                <Cell span={5}>
                    <FormControl
                        label={() => "Servicio Terrestre Estafeta"}
                        caption={() => "Tipo servicio Terrestre"}
                    >
                        <Input />
                    </FormControl>
                </Cell> */}
            </Grid>
        </Card>
    )
}
export default GeneralValuesSettingsContainer;