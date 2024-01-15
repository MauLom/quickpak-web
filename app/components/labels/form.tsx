// Additional imports if needed
import React, { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Heading, FormControl, FormLabel, Input, Button, Select, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Link } from '@chakra-ui/react';
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
import QuotesForm from '../quotes/form';
import { generateDHLLabel, generateEstafetaLabel } from '../../lib/requests';

interface FormData {
    [key: string]: string;
}

const LabelsForm = (props: any) => {
    const formRef = React.useRef<HTMLFormElement>(null);
    const [selectedCarrier, setSelectedCarrier] = useState('');
    const [dataQuotes, setDataQuotes] = useState({});
    const [labelString, setLabelString] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checkboxChecked, setCheckboxChecked] = useState(false);

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
            // Add more validation checks as required
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isFormValid()) {
            return; // Stop the form submission if validation fails
        }
        const formData = new FormData(event.currentTarget);
        const payload = Object.fromEntries(formData.entries());

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
                toastSuccess('Success', 'Label generated successfully');
                setLabelString(jsonResponse?.data?.ShipmentResponse?.LabelImage[0]?.GraphicImage || jsonResponse?.data?.data);
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

    const downloadLabel = (pdfString: string) => {
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
            `etiqueta${selectedCarrier}.pdf`,
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
                                <FormControl>
                                    <FormLabel>Nombre de contacto</FormLabel>
                                    <Input name="nombR" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Empresa</FormLabel>
                                    <Input name="compR" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Teléfono de contacto</FormLabel>
                                    <Input name="phoneR" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <Input name="emailR" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Calle y número</FormLabel>
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
                                    <FormLabel>Nombre de compañía / Empresa</FormLabel>
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
                        <Button onClick={() => { downloadLabel }}>
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
