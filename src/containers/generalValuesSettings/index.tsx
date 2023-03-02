import * as React from "react"
import { Grid, Cell } from "baseui/layout-grid"
import { HeadingMedium } from 'baseui/typography';
import { Card } from 'baseui/card';
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Button } from "baseui/button"
import * as Styles from "./styles"
import * as Api from "../../services/generalValues"
const GeneralValuesSettingsContainer = () => {
    const [aerialValue, setAerialValue] = React.useState("")
    const [landValue, setLandValue] = React.useState("")

    React.useEffect(() => {
        if (aerialValue === "" && landValue === "") {
            Api.getValues()
                .then((res) => {
                    setAerialValue(res?.data?.data?.FFTaxes?.aerial)
                    setLandValue(res?.data?.data?.FFTaxes?.land)
                })
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        Api.updateValues({aerial:aerialValue, land: landValue})
        alert("Valores actualizados")
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
                                    <Input 
                                    onChange={e=>setAerialValue(e.target.value)}
                                    value={aerialValue}
                                    name="aerial" />
                                </FormControl>
                            </Cell>
                            <Cell span={5}>
                                <FormControl
                                    label={() => "Servicio Terrestre"}
                                    caption={() => "Tipo servicio G / Terrestre"}
                                >
                                    <Input
                                    value={landValue} 
                                    onChange={e=>setLandValue(e.target.value)}
                                    name="land" />
                                </FormControl>
                            </Cell>
                            <Cell span={12}>
                                <Button type="submit" disabled={aerialValue === "" || landValue === ""} >Guardar</Button>
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