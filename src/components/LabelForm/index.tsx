import * as React from 'react';

import { Input } from "baseui/input"
import { Button } from 'baseui/button';
import { FormControl } from "baseui/form-control";
import { Grid, Cell } from 'baseui/layout-grid';
import * as Styles from "./styles"
import { UserCtx } from '../../context/userContext';
import * as Api from "../../services/labels"

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton,
    SIZE,
    ROLE
} from "baseui/modal";

const LabelForm = () => {
    const [isOpenModal, setIsOpenModal] = React.useState(false)
    const [estafetaLabelString, setEstafetaLabelString] = React.useState("")
    const [ZPLstring, setZPLString] = React.useState("")
    const userData = React.useContext(UserCtx)

    const downloadTheEstafetaLabel = () => {
        console.log("estafetaLabelString", estafetaLabelString)
        const byteCharacters = atob(estafetaLabelString);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: '' });


        const url = window.URL.createObjectURL(
            blob,
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `etiquetaEstafeta.pdf`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);

    }

    const handleConvertZPLToIMG = () => {
        Api.getImageFroZPL(ZPLstring)
            .then(response =>
                // console.log("response", response)
                response.data
            )
            .then((blob) => {
                // Create blob link to download
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `etiquetaDHL.pdf`,
                );

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
            })
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        const dataRate = userData.rateData
        switch (userData.serviceProvider) {
            case "DHL":
                const objDefaultDHL = {
                    "service": userData.serviceType,
                    "date":dataRate.date,
                    "hora":"T23:55:00 GMT-06:00",
                    "userId": dataRate.user_id,
                    "oZip": dataRate.origin_zip,
                    "oCity": dataRate.origin_city,
                    "dCity": dataRate.destiny_city,
                    "dZip": dataRate.destiny_zip,
                    "packages": [
                        {
                            "@number": 1,
                            "Weight": dataRate.weight,
                            "InsuredValue": "0",
                            "Dimensions": {
                                "Length": dataRate.lenght,
                                "Width": dataRate.width,
                                "Height": dataRate.height
                            }
                        }
                    ],
                    "desc": e.target.desc.value,
                    "oName": e.target.oName.value,
                    "oCompany": e.target.oCompany.value,
                    "oPhone": e.target.oPhone.value,
                    "oEmail": e.target.oEmail.value,
                    "oStreets": e.target.oStreets1.value,
                    "oStreets2": e.target.oStreets2.value,
                    "oStreets3": e.target.oStreets3.value,
                    "dName": e.target.dName.value,
                    "dCompany": e.target.dCompany.value,
                    "dPhone": e.target.dPhone.value,
                    "dEmail": e.target.dEmail.value,
                    "dStreets": e.target.dStreets1.value,
                    "dStreets2": e.target.dStreets2.value,
                    "dStreets3": e.target.dStreets3.value
                }
                console.log("Payload", objDefaultDHL)
                Api.generateLabelDHL(objDefaultDHL)
                    .then(res => {
                        console.log("res...", res.data)
                        let auxZPLdecoded = atob(res?.data?.ShipmentResponse?.LabelImage[0]?.GraphicImage)
                        console.log("Res DHL", auxZPLdecoded)
                        setZPLString(auxZPLdecoded)
                        setIsOpenModal(true)
                    })

                break;
            case "Estafeta":
                const objDefaultEstafeta = {
                    "alto": dataRate.height,
                    "ancho": dataRate.width,
                    "esPaquete": true,
                    "largo": dataRate.lenght,
                    "peso": dataRate.weight,
                    "userId": dataRate.user_id,
                    "seguro": "0",
                    "descripcionPaquete": e.target.desc.value,
                    "tipoServicioId": "70",
                    "dataOrigen": {
                        "direccion": {
                            "zip": dataRate.origin_zip,
                            "estado": "Mexico",
                            "ciudad": dataRate.origin_city,
                            "area": "Mexico",
                            "calle1": e.target.oStreets1.value,
                            "calle2": e.target.oStreets3.value,
                            "numInt": "sn",
                            "numExt": "-",
                            "entreCalles": "SN",
                            "referencia": e.target.oStreets3.value
                        },
                        "contacto": {
                            "razonSocial": e.target.oCompany.value,
                            "nombreCortoDomicilio": e.target.oName.value,
                            "nombreContacto": e.target.oName.value,
                            "telefono": e.target.oPhone.value,
                            "celular": "0",
                            "email1": e.target.oEmail.value,
                            "email2": e.target.oEmail.value,
                            "RFC": "XAXX010101000"
                        }
                    },
                    "dataDestino": {
                        "direccion": {
                            "zip": dataRate.destiny_zip,
                            "estado": "Mexico",
                            "ciudad": dataRate.destiny_city,
                            "area": "Mexico",
                            "calle1": e.target.dStreets1.value,
                            "calle2": e.target.dStreets2.value,
                            "numInt": "SN",
                            "numExt": "-",
                            "entreCalles": "Referencia",
                            "referencia": e.target.dStreets3.value
                        },
                        "contacto": {
                            "razonSocial": e.target.dCompany.value,
                            "nombreCortoDomicilio": e.target.dName.value,
                            "nombreContacto": e.target.dName.value,
                            "telefono": e.target.dPhone.value,
                            "celular": "0",
                            "email1": e.target.dEmail.value,
                            "email2": e.target.dEmail.value,
                            "RFC": "XAXX010101000"
                        }
                    },
                    "content": "Documentos",
                    "additionalInfo": "CONTENIDO FRAGIL"
                }
                Api.generateLabelEstafeta(objDefaultEstafeta)
                    .then(res => {
                        setEstafetaLabelString(res?.data?.data)
                        setIsOpenModal(true)
                    })
                break;
            default:
                console.error("No se reconoce el servicio seleccionado")
        }
    }

    const handleBotonDescarga = () => {
        if (userData.serviceProvider === "Estafeta") {
            downloadTheEstafetaLabel()
        } else if (userData.serviceProvider === "DHL") {
            handleConvertZPLToIMG()
        }
    }
    return (
        <Styles.LabelFormStyle onSubmit={handleSubmit}>
            <Grid>
                <Cell span={10}>
                    <FormControl
                        label={() => "Descripcion del paquete"}
                        caption={() => "breve descripcion del contenido del paquete"}>
                        <Input name="desc" />
                    </FormControl>
                </Cell>

                <Cell span={3}>
                    <FormControl
                        label={() => "Nombre del sitio de origen"}
                        caption={() => "Sitio desde donde envian el paquete"}>
                        <Input name="oName" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Compania de origen"}
                        caption={() => "Nombre de compania desde donde se envia"}>
                        <Input name="oCompany" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Numero de contacto de origen"}
                        caption={() => "Contacto de origen"}>
                        <Input name="oPhone" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Email de origen"}
                        caption={() => "Correo electronico del contacto de origen"}>
                        <Input name="oEmail" />
                    </FormControl>
                </Cell>

                <Cell span={4}>
                    <FormControl
                        label={() => "Calle de referencia 1 de origen"}
                        caption={() => "*Opcional, referencia a origen"}>
                        <Input name="oStreets1" />
                    </FormControl>
                </Cell>
                <Cell span={4}>
                    <FormControl
                        label={() => "Calle de referencia 2 de origen"}
                        caption={() => "*Opcional, referencia a origen"}>
                        <Input name="oStreets2" />
                    </FormControl>
                </Cell>

                <Cell span={4}>
                    <FormControl
                        label={() => "Calle de referencia 3 de origen"}
                        caption={() => "*Opcional, referencia a origen"}>
                        <Input name="oStreets3" />
                    </FormControl>
                </Cell>

                {/*  */}

                <Cell span={3}>
                    <FormControl
                        label={() => "Nombre del sitio de destino"}
                        caption={() => "Sitio a donde envian el paquete"}>
                        <Input name="dName" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Compania de destino"}
                        caption={() => "Nombre compania de destino"}>
                        <Input name="dCompany" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Numero de contacto de destino"}
                        caption={() => "Numero de contacto del destino"}>
                        <Input name="dPhone" />
                    </FormControl>
                </Cell>
                <Cell span={3}>
                    <FormControl
                        label={() => "Email de destino"}
                        caption={() => "Correo electronico del contacto de destino"}>
                        <Input name="dEmail" />
                    </FormControl>
                </Cell>
                <Cell span={4}>
                    <FormControl
                        label={() => "Calle de referencia 1 de destino"}
                        caption={() => "*Opcional, referencia a destino"}>
                        <Input name="dStreets1" />
                    </FormControl>
                </Cell>
                <Cell span={4}>
                    <FormControl
                        label={() => "Calle de referencia 2 de destino"}
                        caption={() => "*Opcional, referencia a destino"}>
                        <Input name="dStreets2" />
                    </FormControl>
                </Cell>
                <Cell span={4}>
                    <FormControl
                        label={() => "Calle de referencia 3 de destino"}
                        caption={() => "*Opcional, referencia a destino"}>
                        <Input name="dStreets3" />
                    </FormControl>
                </Cell>
                <Cell span={12}>
                    <Button type="submit"  >Generar Guia</Button>
                </Cell>
            </Grid>
            <Modal
                onClose={() => setIsOpenModal(false)}
                closeable
                isOpen={isOpenModal}
                animate
                autoFocus
                size={SIZE.default}
                role={ROLE.dialog}
            >
                <ModalHeader>Se genero exitosamente la guia</ModalHeader>
                <ModalBody>
                    Haz click en el boton para descargar tu etiqueta
                </ModalBody>
                <ModalFooter>
                    <ModalButton >
                        Cancelar
                    </ModalButton>
                    <ModalButton onClick={() => handleBotonDescarga()}>
                        Descargar
                    </ModalButton>
                </ModalFooter>
            </Modal>
        </Styles.LabelFormStyle>
    )
}
export default LabelForm