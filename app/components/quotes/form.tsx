'use client'
import { useState } from "react"
import {
    Box, Grid, GridItem, Heading,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button,
    useToast,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Image,
} from "@chakra-ui/react"
import Packages from "./packages"
import isEmpty from "../../utils/isEmpty"
import { useSession, signIn, signOut } from "next-auth/react"
import { getQuotes } from "../../lib/requests"


const QuotesForm = () => {
    const { data: session } = useSession()
    const [packagesArr, setPackagesArr] = useState([{ weight: 0, height: 0, width: 0, length: 0 }])
    const [quotesArr, setQuotesArr] = useState([])
    const toast = useToast()
    function doSubmit(data: any) {
        getQuotes(data).then(result => {
            if (result?.data && result.data.length > 0) {
                let newArr = JSON.parse(JSON.stringify(quotesArr))
                result.data.forEach((eachQuote: any) => {
                    let quoteObj: any = {}
                    quoteObj['parcelLogo'] = <Image src="https://www.estafeta.com/-/media/Images/Estafeta/Brand/logotipo-estafeta.svg?la=es&hash=8921A2FC9CD511FCE66DB199D611F5205497DF86" alt="Estafeta logo" />
                    quoteObj['serviceType'] = eachQuote.DescripcionServicio
                    quoteObj['weight'] = eachQuote.Peso
                    quoteObj['subTotal'] = eachQuote.Subtotal
                    quoteObj['IVA'] = eachQuote.IVA
                    quoteObj['Total'] = eachQuote.CostoTotal
                    newArr.push(quoteObj)
                })
                setQuotesArr(newArr)
            }
        })
    }
    function validateSubmit(e: any) {
        e.preventDefault()
        let titleToast = ""
        let message = ""
        let statusToast: "error" | "info" | "loading" | "success" | "warning" = "error"
        let dataToBeSended: { package?: any, data?: object, userId?: string | null | undefined } = {}

        let formInputsNames = ["date", "originZip", "originCity", "destinyZip", "destinyCity"]
        for (let i = 0; i < formInputsNames.length; i++) {
            switch (formInputsNames[i]) {
                case "date":
                    if (isEmpty(e.target.date.value)) {
                        message = "La fecha no puede estar vacia"
                        i = formInputsNames.length
                    }
                    break;
                case "originZip":
                    if (isEmpty(e.target.originZip.value)) {
                        message = "El CP de origen no puede estar vacio"
                        i = formInputsNames.length
                    }
                    break;
                case "originCity":
                    if (isEmpty(e.target.originCity.value)) {
                        message = "La ciudad de origen no puede estar vacia"
                        i = formInputsNames.length
                    }
                    break;
                case "destinyZip":
                    if (isEmpty(e.target.destinyZip.value)) {
                        message = "El CP de destino no puede estar vacio"
                        i = formInputsNames.length
                    }
                    break;
                case "destinyCity":
                    if (isEmpty(e.target.destinyCity.value)) {
                        message = message = "La ciudad de destino no puede estar vacia"
                        i = formInputsNames.length
                    }
                    break;
            }
            if (i === (formInputsNames.length - 1) && message === "") {
                statusToast = "loading"
                titleToast = "Procesando datos"
            } else {
                statusToast = "error"
                titleToast = "Error en formulario"
            }
        }
        if (message == "") {
            let doEval = true;
            let j = 0;
            while (doEval) {
                if (packagesArr[j]?.height == 0) {
                    message = "Hay campos vacios en el(los) paquete(s)"
                    statusToast = "error"
                    titleToast = "Error en paquete(s)"
                    doEval = false
                }
                if (packagesArr[j]?.width == 0) {
                    message = "Hay campos vacios en el(los) paquete(s)"
                    statusToast = "error"
                    titleToast = "Error en paquete(s)"
                    doEval = false
                }
                if (packagesArr[j]?.length == 0) {
                    message = "Hay campos vacios en el(los) paquete(s)"
                    statusToast = "error"
                    titleToast = "Error en paquete(s)"
                    doEval = false
                }
                if (packagesArr[j]?.weight == 0) {
                    message = "Hay campos vacios en el(los) paquete(s)"
                    statusToast = "error"
                    titleToast = "Error en paquete(s)"
                    doEval = false
                }
                j++;
                j >= (packagesArr.length) && (doEval = false);
            }
        }

        if (statusToast == "loading") {
            dataToBeSended.package = packagesArr;
            dataToBeSended.data = {
                originZip: e.target?.originZip?.value,
                originCity: e.target?.originCity.value,
                destinyZip: e.target?.destinyZip.value,
                destinyCity: e.target?.destinyCity.value
            }
            dataToBeSended.userId = "enc0UiLq0oNXm1GTFHB8"
        }
        doSubmit(dataToBeSended)
        toast({
            title: titleToast,
            description: `${message}`,
            status: statusToast,
            duration: 5000,
            isClosable: true
        })
    }
    function addPackage() {
        setPackagesArr([...packagesArr, { weight: 0, height: 0, width: 0, length: 0 }])
    }
    function popPackage() {
        let arrAsVar = JSON.parse(JSON.stringify(packagesArr))
        arrAsVar.pop()
        setPackagesArr(arrAsVar)
    }
    function updatePackage(e: any, idx: any, obj: any) {
        let propToBeChanged: string = e?.target?.name
        let newArr = JSON.parse(JSON.stringify(packagesArr))
        obj[propToBeChanged] = Number.parseInt(e?.target?.value)
        newArr[idx] = obj
        setPackagesArr(newArr)
    }

    return (
        <Box>
            <Grid>
                <GridItem>
                    <Heading> Informacion de cotizacion</Heading>
                    <form onSubmit={(e) => { validateSubmit(e) }}>
                        <Grid templateColumns='repeat(4, 1fr)' gap={2}>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Fecha</FormLabel>
                                    <Input
                                        placeholder="Select Date and Time"
                                        size="md"
                                        type="datetime-local"
                                        name="date"
                                        min={Date()}
                                    />
                                    <FormHelperText>fecha de envio del paquete</FormHelperText>
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Codigo postal de origen</FormLabel>
                                    <Input name="originZip" type='number' />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Ciudad de origen</FormLabel>
                                    <Input name="originCity" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Codigo postal de destino</FormLabel>
                                    <Input name="destinyZip" type='number' />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Ciudad de destino</FormLabel>
                                    <Input name="destinyCity" />
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={4}>
                                <Packages packagesArr={packagesArr} setPackages={setPackagesArr} popPackage={popPackage} addPackage={addPackage} updatePackage={updatePackage} />
                            </GridItem>
                            <GridItem>
                                <Button type="submit">
                                    Continuar
                                </Button>
                            </ GridItem >
                        </Grid>
                    </form>
                </GridItem>

                {quotesArr.length > 0 &&
                    <GridItem>
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Paqueteria</Th>
                                        <Th>Servicio</Th>
                                        <Th>Sub total</Th>
                                        <Th>Total</Th>
                                        <Th>Ver mas</Th>
                                        <Th>Generar Guia</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {quotesArr.map((eachService:any) => (
                                        <Tr>
                                            <Td>
                                                {eachService?.parcelLogo}
                                            </Td>
                                            <Td>
                                                {eachService?.serviceType}
                                            </Td>
                                            <Td>
                                                {eachService?.subTotal}
                                            </Td>
                                            <Td>
                                                {eachService?.Total}
                                            </Td>
                                            <Td>
                                                <Accordion allowToggle>
                                                    <AccordionItem>
                                                        <AccordionButton _expanded={{ bg: 'tomato', color: 'white' }}>
                                                            <Box as="span" flex='1' textAlign='left'>
                                                                Detalles
                                                            </Box>
                                                            <AccordionIcon />
                                                        </AccordionButton>
                                                        <AccordionPanel>
                                                            Lorem ipsum ...
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                </Accordion>
                                            </Td>
                                            <Td>
                                                <Button disabled={true}>
                                                    Hacer Guia
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </GridItem>}


            </Grid>
        </Box>
    )

}

export default QuotesForm

