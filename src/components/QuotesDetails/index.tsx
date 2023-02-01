import { Card } from 'baseui/card';
import { HeadingMedium, HeadingXSmall } from 'baseui/typography';
import { Grid, Cell } from 'baseui/layout-grid';
import DHLLogo from "../../assets/DHl-Logo.png"
import EstafetaLogo from "../../assets/Estafeta-Logo.png"
import Image from 'next/image';



const QuotesDetails = ({ quotesArr }) => {
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
                <Cell span={2}>
                    <HeadingXSmall> IVA </HeadingXSmall>
                </Cell>
                <Cell span={2}>
                    <HeadingXSmall>Total</HeadingXSmall>
                </Cell>
            </Grid>
            {quotesArr.map(eachQuote => (
                <Card>
                    <Grid>
                        <Cell span={2} >
                            <Image src={eachQuote.parcelLogo} />
                        </Cell>
                        <Cell span={2}>{eachQuote.serviceType}</Cell>
                        <Cell span={2}>{eachQuote.weight}</Cell>
                        <Cell span={2}>{eachQuote.subTotal}</Cell>
                        <Cell span={2}>{eachQuote.IVA}</Cell>
                        <Cell span={2}>{eachQuote.Total}</Cell>
                    </Grid>
                </Card>
            ))}
            {/* <Card>

                <Grid>
                    <Cell>
                        <Image src={DHLLogo} />
                    </Cell>
                    <Cell>Service type</Cell>
                    <Cell>Precio</Cell>
                    <Cell>Boton</Cell>


                </Grid>
            </Card> */}
        </Card>
    )
}

export default QuotesDetails;