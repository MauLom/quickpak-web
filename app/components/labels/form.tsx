// Additional imports if needed
import React, { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Heading, FormControl, FormLabel, Input, Button, Select, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Link } from '@chakra-ui/react';
import { Checkbox } from '@chakra-ui/react'
import QuotesForm from '../quotes/form';
import { generateDHLLabel, generateEstafetaLabel } from '../../lib/requests';
import { FormField } from './utils';
const LabelsForm = (props: any) => {
    const formRef = React.useRef<HTMLFormElement>(null);
    const [selectedCarrier, setSelectedCarrier] = useState('');
    const [dataQuotes, setDataQuotes] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [pdfString, setPdfString] = useState('')
    const [labelId, setLabelId] = useState('')
    const toast = useToast();

    useEffect(() => {
        if (props.hideQuotes) {
            setSelectedCarrier(props.labelData?.provider);
            setDataQuotes(props?.quotesData);
        }
    }, [props.hideQuotes, props.labelData, props.quotesData]);

    const isFormValid = (): boolean => {
        if (formRef.current) {
            const descPckg = formRef.current["descPckg"].value;
            if (!descPckg) {
                toastError('Validation Error', 'Description of the package is required.');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isFormValid()) {
            return; // Stop the form submission if validation fails
        }
        const formData = new FormData(event.currentTarget);
        const dataForm = Object.fromEntries(formData.entries());
        const payload = { ...dataForm, 'quotes': dataQuotes }
        try {
            let response;
            switch (selectedCarrier) {
                case 'DHL':
                    response = await generateDHLLabel(payload);
                    break;
                case 'Estafeta':
                    response = await generateEstafetaLabel(payload);
                    break;
                default:
                    throw new Error('No carrier selected');
            }
            const jsonResponse = await response.json();

            if (jsonResponse) {
                console.log("jsonResponse", jsonResponse)
                switch (selectedCarrier) {
                    case 'DHL':
                        setPdfString(jsonResponse.data.ShipmentResponse.LabelImage[0].GraphicImage)
                        setLabelId(jsonResponse.data.ShipmentResponse.ShipmentIdentificationNumber)
                        break;
                    case 'Estafeta':
                        setPdfString(jsonResponse.data.data)
                        setLabelId(jsonResponse.data.labelPetitionResult.elements[0].wayBill)
                        break;
                }
                toastSuccess('Success', 'Label generated successfully');
                setIsModalOpen(true);
            }
        } catch (error: any) {
            toastError('Error', error.message);
        }
    };

    const toastSuccess = (title: string, description: string) => {
        toast({
            title,
            description,
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
    };

    const toastError = (title: string, description: string) => {
        toast({
            title,
            description,
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    };

    const downloadLabel = (pdfString: string, fileName:string) => {
        console.log("This is being called")
        const byteCharacters = atob(pdfString);
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
            `${fileName}.pdf`,
        );

        document.body.appendChild(link);
        link.click();
    }

    const handleChangePaqueteria = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCarrier(event.target.value);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckboxChecked(event.target.checked);
    };
    const getDataFromQuotes = (data: any) => {
        setDataQuotes(data);
        toast({
            title: "Éxito Validando Datos",
            description: `Continúa con la información del envío`,
            status: "success",
            duration: 3000,
            isClosable: true
        });
    };

    return (
        <Box >
            <Grid>
                <GridItem>
                    <Heading> Información de guía</Heading>
                    {!props.hideQuotes && <Select placeholder="Paqueteria" value={selectedCarrier} onChange={handleChangePaqueteria}>
                        <option value='DHL'>DHL</option>
                        <option value='Estafeta'>Estafeta</option>
                    </Select>}

                    {!props.hideQuotes && <QuotesForm isLabel={true} transferData={getDataFromQuotes} />}
                    <br />
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <FormControl>
                            <FormLabel>Descripción del contenido</FormLabel>
                            <Input name='descPckg' />
                        </FormControl>
                        <Heading as='h4' size="lg">Remitente</Heading>
                        <Grid templateColumns='repeat(4, 1fr)' gap={2}>
                            <GridItem>
                                <FormField label="Nombre de contacto" name="nombR" />
                            </GridItem>
                            <GridItem>
                                <FormField label="Empresa" name="compR" />
                            </GridItem>
                            <GridItem>
                                <FormField label="Teléfono de contacto" name="phoneR" />
                            </GridItem>
                            <GridItem>
                                <FormField label="Correo Electrónico" name="emailR" />
                            </GridItem>
                            <GridItem>
                                <FormField label="Calle y número" name="streetR" />
                            </GridItem>
                            <GridItem>
                                <FormField label="Colonia" name="colR" />
                            </GridItem>
                            <GridItem>
                                <FormField label="Referencias" name="refR" />
                            </GridItem>
                        </Grid>
                        <hr />
                        <Heading as='h4' size="lg">Destinatario</Heading>

                        <Grid templateColumns='repeat(4, 1fr)' gap={2}>
                            <GridItem>
                                <FormField label="Nombre de contacto" name="nombD" />
                            </GridItem>
                            <GridItem>
                                <FormField label="Nombre de compañía / Empresa" name="compD" />
                            </GridItem>
                            <GridItem>
                                <FormField label="Teléfono de contacto" name="phoneD" />
                            </GridItem>
                            <GridItem>
                                <FormField label="Correo Electrónico" name="emailD" />
                            </GridItem>
                            <GridItem>
                                <FormField label="Calle y número" name="streetD" />
                            </GridItem>
                            <GridItem>
                                <FormField label="Colonia" name="colD" />
                            </GridItem>
                            <GridItem>
                                <FormField label="Referencias" name="refD" />
                            </GridItem>
                        </Grid>

                        <GridItem>
                            <Checkbox
                                isChecked={checkboxChecked}
                                onChange={handleCheckboxChange}
                            >
                                He leido y acepto los <Link href="#">terminos y condiciones</Link>
                            </Checkbox>
                        </GridItem>
                        <Button type="submit" isDisabled={!checkboxChecked}>
                            Continuar
                        </Button>
                    </form>
                </GridItem>

            </Grid>
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Etiqueta {selectedCarrier}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Button onClick={() => { downloadLabel(pdfString, labelId) }}>
                            Descargar etiqueta
                        </Button>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => { setIsModalOpen(false) }}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default LabelsForm;
