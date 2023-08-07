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

const doSubmit = (e: any) => {
    e.preventDefault()
    console.log("Submit did!", e?.target?.date.value)
}


const QuotesForm = () => {
    return (
        <Box>
            <Grid>
                <GridItem>
                    <Heading> Informacion de cotizacion</Heading>
                    <form onSubmit={(e) => { doSubmit(e) }}>
                        <Grid templateColumns='repeat(4, 1fr)' gap={2}>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Fecha</FormLabel>
                                    <Input
                                        placeholder="Select Date and Time"
                                        size="md"
                                        type="datetime-local"
                                        name="date"
                                    />
                                    <FormHelperText>fecha de envio del paquete</FormHelperText>
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Codigo postal de origen</FormLabel>
                                    <Input type='number' />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Ciudad de origen</FormLabel>
                                    <Input />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Codigo postal de destino</FormLabel>
                                    <Input type='number' />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Ciudad de destino</FormLabel>
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

export default QuotesForm

