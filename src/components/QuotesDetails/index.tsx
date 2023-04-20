import * as React from "react"
import { Card } from 'baseui/card';
import { HeadingMedium, HeadingXSmall } from 'baseui/typography';
import { Grid, Cell } from 'baseui/layout-grid';
import DHLLogo from "../../assets/DHl-Logo.png"
import EstafetaLogo from "../../assets/Estafeta-Logo.png"
import Image from 'next/image';
import { Button } from 'baseui/button';
import LabelForm from "../LabelForm";
import * as Styles from "./styles"
import { UserCtx } from "../../context/userContext";


const QuotesDetails = ({ quotesArr }) => {
    const userData = React.useContext(UserCtx)
    const [showGenerateLabel, setShowGenerateLabel] = React.useState(false)
    const [selectedServiceIndex, setSelectedServiceIndex] = React.useState(-1)
    console.log("quotesArr: ", quotesArr)
    const handleChangeShowGenerateLabel = (idx) => {
        userData.handleChangeServiceType(quotesArr[idx].serviceType)
        switch (quotesArr[idx].serviceType) {
            case "G": case "N":
                userData.handleChangeServiceProvider("DHL")
                break;
            case "Dia Sig.": case "Terrestre":
                userData.handleChangeServiceProvider("Estafeta")
                break;
            default:
                console.error("No se reconocio el servicio seleccionado")
                break;
        }
        setSelectedServiceIndex(idx)
        setShowGenerateLabel(!showGenerateLabel)
    }
    return (
        <Card>
            <HeadingMedium>Resultados para tu busqueda</HeadingMedium>
            <Grid>
                <Cell span={2} >
                    <HeadingXSmall> Paqueteria</HeadingXSmall>
                </Cell>
                <Cell span={2}>
                    <HeadingXSmall> Tipo de servicio</HeadingXSmall>
                </Cell>
                <Cell span={2}>
                    <HeadingXSmall> Peso</HeadingXSmall>
                </Cell>
                <Cell span={2}>
                    <HeadingXSmall> Sub Total </HeadingXSmall>
                </Cell>
                <Cell span={1}>
                    <HeadingXSmall> IVA </HeadingXSmall>
                </Cell>
                <Cell span={1}>
                    <HeadingXSmall>Total</HeadingXSmall>
                </Cell>
                <Cell span={2}>
                    <HeadingXSmall>Accion </HeadingXSmall>
                </Cell>
            </Grid>
            {quotesArr.map((eachQuote, idx) => (
                <Card overrides={selectedServiceIndex === idx && Styles.CardSelected}>
                    <Grid >
                        <Cell span={2} >
                            <Image src={eachQuote.parcelLogo} />
                        </Cell>
                        <Cell span={2}>{eachQuote.serviceType}</Cell>
                        <Cell span={2}>{eachQuote.weight}</Cell>
                        <Cell span={2}>{eachQuote.subTotal}</Cell>
                        <Cell span={1}>{eachQuote.IVA}</Cell>
                        <Cell span={1}>{eachQuote.Total}</Cell>
                        <Cell span={2}>
                            <Button onClick={() => { handleChangeShowGenerateLabel(idx) }}>Generar guia</Button>
                        </Cell>
                        <Cell span={12}>
                            
                            {eachQuote?.TotalChargeTypes !== undefined && (
                                <>
                                    {/* {eachQuote.TotalChargeTypes[0].Amount} */}
                                    {eachQuote.TotalChargeTypes.map(eachCargo => (
                                        <>
                                            {eachCargo.ChargeType}:&nbsp;
                                            <strong>{eachCargo.ChargeAmount}</strong>
                                            <br />
                                        </>
                                    ))}
                                </>

                            )}
                        </Cell>
                    </Grid>
                </Card>
            ))}

            {showGenerateLabel &&
                <LabelForm />
            }
        </Card>
    )
}

export default QuotesDetails;