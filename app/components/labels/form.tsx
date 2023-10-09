'use client'
import * as React from 'react'
import {
    Box, Grid, GridItem, Heading,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button,
    Select,
    useToast,
    Divider
} from "@chakra-ui/react"
import QuotesForm from '../quotes/form'
import { generateEstafetaLabel } from '../../lib/requests'

const LabelsForm = (props: any) => {
    const [slctdPaqueteria, setSlctdPaqueteria] = React.useState("")
    const [dataQuotes, setDataQuotes] = React.useState({})
    const toast = useToast()

    const handleChangePaqueteria = (e: any) => {
        setSlctdPaqueteria(e.target.value)
    }

    const doSubmit = (e: any) => {
        e.preventDefault()
        let titleToast = ""
        let message = ""
        let statusToast: "error" | "info" | "loading" | "success" | "warning" = "error"
        if (slctdPaqueteria === "") {
            titleToast = "Error"
            message = "No se eligio una paqueteria para la guia"
            statusToast = "error"
        }
        /// Add Validation to no have dataQuotes
        if (dataQuotes) {
            ///Validation here
        }
        let payload = {
            quotes: dataQuotes,
            descPckg: e.target.descPckg.value,

            nombR: e.target.nombR?.value || "cannot read",
            compR: e.target.compR?.value || "cannot read",
            phoneR: e.target.phoneR?.value || "cannot read",
            mailR: e.target.emailR?.value || "cannot read",
            streetR: e.target.streetR?.value || "cannot read",
            colR: e.target.colR?.value || "cannot read",
            refR: e.target.refR?.value || "cannot read",

            nombD: e.target.nombD?.value || "cannot read",
            compD: e.target.compD?.value || "cannot read",
            phoneD: e.target.phoneD?.value || "cannot read",
            mailD: e.target.emailD?.value || "cannot read",
            streetD: e.target.streetD?.value || "cannot read",
            colD: e.target.colD?.value || "cannot read",
            refD: e.target.refD?.value || "cannot read",
        }
        generateEstafetaLabel(payload)
        toast({
            title: titleToast,
            description: `${message}`,
            status: statusToast,
            duration: 5000,
            isClosable: true
        })
    }

    const getDataFromQuotes = (data: any) => {
        setDataQuotes(data)
        toast({
            title: "Exito Validando Datos",
            description: `Continua con la informacion del envio`,
            status: "success",
            duration: 3000,
            isClosable: true
        })
    }

    return (
        <Box >
            <Grid>
                <GridItem>
                    <Heading> Informacion de guia</Heading>
                    {!props.hideQuotes && <Select placeholder="Paqueteria" value={slctdPaqueteria} onChange={handleChangePaqueteria}>
                        <option value='DHL'>DHL</option>
                        <option value='Estafeta'>Estafeta</option>
                    </Select>}

                    {!props.hideQuotes && <QuotesForm isLabel={true} transferData={getDataFromQuotes} />}
                    <br />
                    <form onSubmit={(e) => { doSubmit(e) }}>
                        <FormControl>
                            <FormLabel>Descripcion del contenido</FormLabel>
                            <Input name='descPckg' />
                        </FormControl>
                        <Heading as='h4' size="lg">Remitente</Heading>
                        <Grid templateColumns='repeat(4, 1fr)' gap={2}>

                            <GridItem>
                                <FormControl>
                                    <FormLabel>Nombre de contacto</FormLabel>
                                    <Input name="nombR" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Nombre de compañia / Empresa</FormLabel>
                                    <Input name="compR" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Telofono de contacto</FormLabel>
                                    <Input name="phoneR" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Correo Electronico</FormLabel>
                                    <Input name="emailR" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Calle y numero</FormLabel>
                                    <Input name="streetR" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Colonia</FormLabel>
                                    <Input name="colR" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Referencias</FormLabel>
                                    <Input name="refR" />
                                </FormControl>
                            </GridItem>
                        </Grid>
                        <hr />
                        <Heading as='h4' size="lg">Destinatario</Heading>

                        <Grid templateColumns='repeat(4, 1fr)' gap={2}>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Nombre de contacto</FormLabel>
                                    <Input name="nombD" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Nombre de compañia / Empresa</FormLabel>
                                    <Input name="compD" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Telofono de contacto</FormLabel>
                                    <Input name="phoneD" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Correo Electronico</FormLabel>
                                    <Input name="emailD" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Calle y numero</FormLabel>
                                    <Input name="streetD" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Colonia</FormLabel>
                                    <Input name="colD" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Referencias</FormLabel>
                                    <Input name="refD" />
                                </FormControl>
                            </GridItem>
                        </Grid>
                        <Button type="submit">
                            Continuar
                        </Button>
                    </form>
                </GridItem>

            </Grid>
        </Box>
    )
}

export default LabelsForm