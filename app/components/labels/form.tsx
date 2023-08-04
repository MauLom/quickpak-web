'use client'
import {
    Box, Grid, GridItem, Heading,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button
} from "@chakra-ui/react"


const doSubmit = (e) => {
    console.log("Something with e", e)
}

const LabelsForm = () => {
    return (
        <Box>
            <Grid>
                <GridItem>
                    <Heading> Informacion de guia</Heading>
                    <form onSubmit={(e) => { doSubmit(e) }}>
                        <FormControl>
                            <FormLabel>Descripcion del contenido</FormLabel>
                            <Input />
                        </FormControl>
                        <Heading as='h4' size="lg">Remitente</Heading>
                        <Grid templateColumns='repeat(4, 1fr)' gap={2}>
                         
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Nombre de contacto</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Nombre de compañia / Empresa</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Telofono de contacto</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Correo Electronico</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Calle y numero</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Colonia</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Referencias</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                        </Grid>
                        <hr />
                        <Heading as='h4' size="lg">Destinatario</Heading>

                        <Grid templateColumns='repeat(4, 1fr)' gap={2}>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Nombre de contacto</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Nombre de compañia / Empresa</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Telofono de contacto</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Correo Electronico</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Calle y numero</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Colonia</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Referencias</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                        </Grid>
                        <Button type="submit">
                            Continuar
                        </Button>
                    </form>
                </GridItem>
                <GridItem>

                </GridItem>

            </Grid>
        </Box>
    )

}

export default LabelsForm