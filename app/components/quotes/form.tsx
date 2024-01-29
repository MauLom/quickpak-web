'use client'
import { useState, useEffect } from "react"
import {
    Box, Grid, GridItem, Heading,
    FormControl,
    FormLabel,
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
    Tr,
    Th,
    Td,
    TableContainer,
    Image,
    Checkbox,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Select,
    Stack
} from "@chakra-ui/react"
import Packages from "./packages"
import isEmpty from "../../utils/isEmpty"
import { useSession } from "next-auth/react"
import { getQuotes, getUser, getUsers } from "../../lib/requests"
import LabelsForm from "../labels/form"
import { getZipCodeData } from "../../lib/v2/zipCodes"
import { getCookie } from '../../lib/manageUserSession'
import { renderDHLDetails, renderEstafetaDetails } from "./renderAccordeonUtils"
interface Iuser {
    id: string,
    name: string,
    matriz: string,
    role: string
}
interface User {
    _id: string;
    userName: string;
    provider_access: { provider_id: string; services: string[] }[];
}


const QuotesForm = ({ ...props }) => {
    const { data: session } = useSession()
    const [packagesArr, setPackagesArr] = useState([{ weight: 0, height: 0, width: 0, length: 0 }])
    const [quotesArr, setQuotesArr] = useState([])
    const [includeInsurance, setIncludeInsurance] = useState()
    const [isOpenModalLabels, setIsOpenModalLabels] = useState(false)
    const [user, setUser] = useState<Iuser>({ id: "", name: "", matriz: "", role: "" })
    const [userQuotes, setUserQuotes] = useState("")
    const [originCity, setOriginCity] = useState("")
    const [destinyCity, setDestinyCity] = useState("")
    const [usersOptions, setUsersOptions] = useState<any>([])
    const [labelData, setLabelData] = useState({})
    const [dataQuotes, setDataQuotes] = useState({})
    const toast = useToast()

    async function getUsersForSelect() {
        const users = await getUsers()
        users.length > 0 && setUsersOptions(users)
    }

    async function loadUserFromId(id: string) {
        const data = await getUser(id)
        const userParsed = {
            id: data._id,
            name: data.userName,
            matriz: data.provider_access,
            role: data.role
        }
        setUser(userParsed)
    }

    useEffect(() => {
        const data = { userId: getCookie("userId"), userRole: getCookie("userRole") }

        if (data.userId && data.userRole) {
            loadUserFromId(data.userId)
            setUserQuotes(data.userId)
        }
        if (data.userRole === "admin") {
            getUsersForSelect()
        }
    }, [session])


    function doSubmit(data: any) {
        !props?.isLabel &&
            getQuotes(data)
                .then(result => {
                    let dataObj = result
                    let parsedArr = JSON.parse(JSON.stringify(quotesArr))
                    if (dataObj?.data?.data && dataObj?.data?.data.length > 0) {
                        dataObj?.data?.data.forEach((eachQuote: any) => {
                            let quoteObj: any = {}
                            quoteObj['parcelLogo'] = <Image src="https://www.estafeta.com/-/media/Images/Estafeta/Brand/logotipo-estafeta.svg?la=es&hash=8921A2FC9CD511FCE66DB199D611F5205497DF86" alt="Estafeta logo" />
                            quoteObj['serviceType'] = eachQuote.DescripcionServicio
                            quoteObj['weight'] = eachQuote.Peso
                            quoteObj['subTotal'] = eachQuote.Subtotal
                            quoteObj['IVA'] = eachQuote.IVA
                            quoteObj['Total'] = eachQuote.CostoTotal
                            quoteObj['details'] = eachQuote
                            quoteObj['zone'] = dataObj?.data?.zone
                            quoteObj['oc'] = dataObj?.data?.ocurreForzoso
                            quoteObj['provider'] = "Estafeta"
                            quoteObj['Dias'] = eachQuote?.DiasEntrega
                            quoteObj['seguro'] = eachQuote?.seguro
                            parsedArr.push(quoteObj)
                        })
                    }
                    //const filteredCharges = charges.filter(charge => charge.ChargeCode === targetChargeCode);
                    dataObj?.dataDHL?.data.forEach((eachQuote: any) => {
                        let quoteObj: any = {}
                        quoteObj['parcelLogo'] = <Image maxH="7rem" padding="10px"
                            backgroundColor="#FFCC00" borderRadius="5px" src="https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg" alt="DHL logo" />
                        let foundServiceBase = eachQuote?.Charges.Charge.filter((charge: any) => charge.ChargeName === eachQuote.ServiceName)
                        quoteObj['baseService'] = foundServiceBase[0].ChargeAmount
                        quoteObj['ff'] = eachQuote?.Charges.Charge.find(((charge: any) => charge?.ChargeCode === "FF"))?.ChargeAmount
                        quoteObj['ii'] = eachQuote?.Charges.Charge.find(((charge: any) => charge?.ChargeCode === "II"))?.ChargeAmount
                        quoteObj['yy'] = eachQuote?.Charges.Charge.find(((charge: any) => charge?.ChargeCode === "YY"))?.ChargeAmount
                        quoteObj['oo'] = eachQuote?.Charges.Charge.find(((charge: any) => charge?.ChargeCode === "OO"))?.ChargeAmount
                        quoteObj['yb'] = eachQuote?.Charges.Charge.find(((charge: any) => charge?.ChargeCode === "YB"))?.ChargeAmount
                        quoteObj['ye'] = eachQuote?.Charges.Charge.find(((charge: any) => charge?.ChargeCode === "YE"))?.ChargeAmount
                        quoteObj['serviceType'] = eachQuote.ServiceName
                        quoteObj['weight'] = eachQuote?.QuotedWeight
                        quoteObj['subTotal'] = eachQuote?.Charges.Charge.find(((charge: any) => charge?.ChargeType === "SubTotal"))?.ChargeAmount
                        quoteObj['IVA'] = eachQuote?.Charges.Charge.find(((charge: any) => charge?.ChargeType === "IVA"))?.ChargeAmount
                        quoteObj['Total'] = eachQuote?.TotalNet?.Amount
                        quoteObj['details'] = eachQuote
                        quoteObj['zone'] = result?.dataDHL?.zone
                        quoteObj['provider'] = "DHL"
                        quoteObj['fecEntrega'] = eachQuote?.DeliveryTime
                        parsedArr.push(quoteObj)

                    })
                    setQuotesArr(parsedArr)
                    // })
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
                date: e.target?.date.value,
                originZip: e.target?.originZip?.value,
                originCity: e.target?.originCity.value,
                destinyZip: e.target?.destinyZip.value,
                destinyCity: e.target?.destinyCity.value,
                insurance: includeInsurance ? e.target?.insurance.value : 0
            }

            dataToBeSended.userId = userQuotes !== "" ? userQuotes : "enc0UiLq0oNXm1GTFHB8"
            setDataQuotes(dataToBeSended)
            doSubmit(dataToBeSended)
        }

        if (props?.isLabel) {
            statusToast === "loading" ?
                props.transferData(dataToBeSended)
                :
                toast({
                    title: titleToast,
                    description: `${message}`,
                    status: statusToast,
                    duration: 5000,
                    isClosable: true
                })
        } else {
            toast({
                title: titleToast,
                description: `${message}`,
                status: statusToast,
                duration: 5000,
                isClosable: true
            })
        }
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
        const numero = parseFloat(e?.target?.value);
        obj[propToBeChanged] =  Math.ceil(numero);
        newArr[idx] = obj
        setPackagesArr(newArr)
    }
    function changeIncludeInsurance(e: any) {
        setIncludeInsurance(e.target.checked)
    }
    function emptyToReDoQuotes() {
        setQuotesArr([])
    }
    function handleDoGuide(quote: any) {
        setLabelData({ "provider": quote.provider, service: quote.serviceType })
        setIsOpenModalLabels(true)
    }

    const handleChangeUsuarioCotizacion = (e: any) => {
        setUserQuotes(e.target.value)
    }
    async function handleZipOriginChange(e: any) {
        if (e.target.value.length === 5) {
            const dataFromZip = await getZipCodeData(e.target.value)
            setOriginCity(dataFromZip.codigo_postal.municipio)
        }
    }
    function handleOriginCityManualChange(e: any) {
        setOriginCity(e.target.value)
    }
    function handleDestinyCityManualChange(e: any) {
        setDestinyCity(e.target.value)
    }
    async function handleZipDestinyChange(e: any) {
        if (e.target.value.length === 5) {
            const dataFromZip = await getZipCodeData(e.target.value)
            setDestinyCity(dataFromZip.codigo_postal.municipio)
        }
    }

    function renderAccordeonDetails(eachService:any) {
        switch (eachService?.provider) {
            case "DHL":
                return renderDHLDetails(eachService);
            case "Estafeta":
                return renderEstafetaDetails(eachService);
            default:
                return <AccordionPanel>No se pueden cargar estos detalles</AccordionPanel>;
        }
    }
    return (
        <Box>
            <Grid>
                <GridItem>
                    {user.role === "admin" &&
                        <Select placeholder="Usuario para cotizar" value={userQuotes} onChange={handleChangeUsuarioCotizacion}>

                            {usersOptions.length > 0 && usersOptions.map((user: any) => (
                                <option key={user._id} value={user._id}>{user.userName}</option>
                            ))}
                        </Select>
                    }
                    {props.isLabel ? <></> : <Heading> Informacion de cotizacion</Heading>}
                    <form onSubmit={(e) => { validateSubmit(e) }}>
                        <Grid templateColumns='repeat(4, 1fr)' gap={3}>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Codigo postal de origen</FormLabel>
                                    <Input name="originZip" type='number' onChange={handleZipOriginChange} />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Ciudad de origen</FormLabel>
                                    <Input value={originCity} name="originCity" onChange={handleOriginCityManualChange} />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Codigo postal de destino</FormLabel>
                                    <Input name="destinyZip" type='number' onChange={handleZipDestinyChange} />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Ciudad de destino</FormLabel>
                                    <Input value={destinyCity} name="destinyCity" onChange={handleDestinyCityManualChange} />
                                </FormControl>
                            </GridItem>
                            <GridItem >
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
                            <GridItem verticalAlign={"end"}>
                                <Checkbox value={includeInsurance} onChange={changeIncludeInsurance}><b>Incluir seguro</b></Checkbox>
                                <Text>Indicar si se prefiere asegurar el envio</Text>
                            </GridItem>
                            {includeInsurance &&
                                <GridItem >
                                    <FormControl>
                                        <FormLabel>Seguro</FormLabel>
                                        <Input
                                            disabled={!includeInsurance}
                                            placeholder="Monto de seguro"
                                            size="md"
                                            type="number"
                                            name="insurance"
                                        />
                                        {/* <FormHelperText>fecha de envio del paquete</FormHelperText> */}
                                    </FormControl>
                                </GridItem>
                            }

                            <GridItem colSpan={4}>
                                <Packages packagesArr={packagesArr} setPackages={setPackagesArr} popPackage={popPackage} addPackage={addPackage} updatePackage={updatePackage} />
                            </GridItem>
                            <GridItem padding={4}>
                                {props?.isLabel ?
                                    <Button colorScheme='teal' type="submit">
                                        Validar
                                    </Button> :
                                    quotesArr.length > 0 ?
                                        <Button onClick={emptyToReDoQuotes}>Re cotizar</Button> :
                                        <Button type="submit">
                                            Continuar
                                        </Button>

                                }

                            </ GridItem >
                        </Grid>
                    </form>
                </GridItem>

                {quotesArr?.length > 0 &&
                    <GridItem>
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Paqueteria</Th>
                                        <Th>Servicio</Th>
                                        {/* <Th>Sub total</Th> */}
                                        <Th>Total</Th>
                                        <Th>Ver mas</Th>
                                        <Th>Generar Guia</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {quotesArr?.map((eachService: any) => (
                                        <Tr key={`${Math.floor(Math.random() * 99)}-${eachService?.Total}`}>
                                            <Td>
                                                {eachService?.parcelLogo}
                                            </Td>
                                            <Td>
                                                {eachService?.serviceType}
                                            </Td>
                                            {/* <Td>
                                                ${eachService?.subTotal}
                                            </Td> */}
                                            <Td>
                                                ${eachService?.Total}
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
                                                        {renderAccordeonDetails(eachService)}
                                                    </AccordionItem>
                                                </Accordion>
                                            </Td>
                                            <Td>
                                                <Button onClick={() => { handleDoGuide(eachService) }}>
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
            <Modal size="xl" closeOnOverlayClick={false} isOpen={isOpenModalLabels} onClose={() => { setIsOpenModalLabels(false) }}>
                <ModalOverlay />
                <ModalContent minWidth="fit-content"
                    height="fit-content">
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <LabelsForm hideQuotes={true} labelData={labelData} quotesData={dataQuotes} />

                        </Box>
                    </ModalBody>

                </ModalContent>
            </Modal>
        </Box>
    )

}

export default QuotesForm

