import * as React from 'react'
import { useEffect, useState } from "react";
import QuoterForm from "../../components/QuoterForm";
import QuotesDetails from "../../components/QuotesDetails";
import * as Api from "../../services/quotes"
import DHLLogo from "../../assets/DHL-Logo.png"
import EstafetaLogo from "../../assets/Estafeta-Logo.png"
import { Select } from "baseui/select";
import { UserCtx } from "../../context/userContext";
const QuotesContainer = () => {
    const userData = React.useContext(UserCtx)
    const [dataQuotesList, setDataQuotesList] = useState([])
    const [userQuotes, setUserQuotes] = useState();
    const [userId, setUserId] = useState("")
    const [dateValue, setDateValue] = useState()
    const [dateFormatted, setDateFormatted] = useState("")
    if (userData.userName !== "admin") {
        useEffect(() => {
            if (userId === "") {
                setUserId(userData.servicesId)
            }
        }, [userId, setUserId])
    }


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
            user_id: userId,
        }
        const dataPayloadDHL = {
            date: dateFormatted,
            origin_city: e.target.origin_city.value,
            origin_zip: e.target.origin_zip.value,
            destiny_city: e.target.destiny_city.value,
            destiny_zip: e.target.destiny_zip.value,
            weight: e.target.weight.value,
            lenght: e.target.lenght.value,
            width: e.target.width.value,
            height: e.target.height.value,
            user_id: userId,
        }
        userData.handleChangeRateData(dataPayloadDHL)
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
                //setDataQuotesList(quotesArr)
            })
        Api.getRatesDHL(dataPayloadDHL)
            .then((res) => {
                console.log("res DHL", res)
                if (res?.data && res.data.length > 0) {
                    res.data.forEach(eachQuote => {
                        let quoteObj = {}
                        const findCharges = (chargeToBeLooked) => {
                            return eachQuote?.Charges.Charge.find(element => element.ChargeType === chargeToBeLooked).ChargeAmount
                        }
                        quoteObj['parcelLogo'] = DHLLogo
                        quoteObj['serviceType'] = eachQuote["@type"]
                        quoteObj['weight'] = eachQuote.QuotedWeight
                        quoteObj['subTotal'] = findCharges("SubTotal")
                        quoteObj['IVA'] = findCharges("IVA")
                        quoteObj['Total'] = eachQuote.TotalNet.Amount
                        quotesArr.push(quoteObj)
                    })
                    setDataQuotesList(quotesArr)

                }
            })
    }
    const handleDateChangeValue = (newDate) => {
        const dateAsType = new Date(newDate[0])
        setDateValue(newDate)
        setDateFormatted(dateAsType.toISOString())
    }
    const optionsUsers = [
        { label: "REDBOX", id: "4xUVTqVZ1n1FuBikezmQ" },
        { label: "SRS Express", id: "enc0UiLq0oNXm1GTFHB8" },
    ]

    const handleChangeUser = (params) => {
        setUserId(params.value[0].id)
        setUserQuotes(params.value)
        setDataQuotesList([])
    }

    return (
        <>
            {userData.userName === "admin" && <Select
                options={optionsUsers}
                value={userQuotes}
                placeholder="Selecciona el usuario para cotizar"
                onChange={params => handleChangeUser(params)}
            />}

            <QuoterForm submitAction={handleSubmit} dateValue={dateValue} changeDateValue={handleDateChangeValue} />
            {dataQuotesList.length > 0 && (<QuotesDetails quotesArr={dataQuotesList} />)}
        </>
    )
}

export default QuotesContainer;