import { useState } from "react";
import QuoterForm from "../../components/QuoterForm";
import QuotesDetails from "../../components/QuotesDetails";
import * as Api from "../../services/quotes"
import DHLLogo from "../../assets/DHl-Logo.png"
import EstafetaLogo from "../../assets/Estafeta-Logo.png"
const QuotesContainer = () => {
    const [dataQuotesList, setDataQuotesList] = useState([])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (dataQuotesList.length > 0) {
            setDataQuotesList([])
        }
        const dataPayloadEstafeta = {
            height: e.target.height.value,
            width: e.target.width.value,
            package: "true",
            lenght: e.target.lenght.value,
            weight: e.target.weight.value,
            origin_zip: e.target.origin_zip.value,
            destiny_zip: e.target.destiny_zip.value,
            user_id: "4xUVTqVZ1n1FuBikezmQ",
        }
        const dataPayloadDHL = {
            date: e.target.date.value,
            origin_city: e.target.origin_city.value,
            origin_zip: e.target.origin_zip.value,
            destiny_city: e.target.destiny_city.value,
            destiny_zip: e.target.destiny_zip.value,
            weight: e.target.weight.value,
            lenght: e.target.lenght.value,
            width: e.target.width.value,
            height: e.target.height.value,
            user_id: "4xUVTqVZ1n1FuBikezmQ",
        }
        const quotesArr = []
        Api.getRatesEstafeta(dataPayloadEstafeta)
            .then((res) => {
                if (res?.data && res.data.length > 0) {
                    res.data.forEach(eachQuote => {
                        console.log("eachQuote", eachQuote)
                        let quoteObj = {}
                        quoteObj['parcelLogo'] = EstafetaLogo
                        quoteObj['serviceType'] = eachQuote.DescripcionServicio
                        quoteObj['weight'] = eachQuote.Peso
                        quoteObj['subTotal'] = eachQuote.Subtotal
                        quoteObj['IVA'] = eachQuote.IVA
                        quoteObj['Total'] = eachQuote.CostoTotal
                        quotesArr.push(quoteObj)
                    })
                }
                setDataQuotesList(quotesArr)
            })
        Api.getRatesDHL(dataPayloadDHL)
            .then((res) => {
                console.log("res DHL", res)
                // if (res?.data && res.data.length > 0) {
                //     let quoteObj = {}
                //     res.data.forEach(eachQuote => {
                //         quoteObj['parcelLogo'] = EstafetaLogo
                //         quoteObj['serviceType'] = eachQuote.DescripcionServicio
                //         quoteObj['weight'] = eachQuote.Peso
                //         quoteObj['subTotal'] = eachQuote.Subtotal
                //         quoteObj['IVA'] = eachQuote.IVA
                //         quoteObj['Total'] = eachQuote.CostoTotal
                //         setDataQuotesList([
                //             ...dataQuotesList,
                //             quoteObj])
                //     })
                // }
            })
    }

    return (
        <>
            <QuoterForm submitAction={handleSubmit} />
            {dataQuotesList.length > 0 && (<QuotesDetails quotesArr={dataQuotesList} />)}

        </>
    )
}

export default QuotesContainer;