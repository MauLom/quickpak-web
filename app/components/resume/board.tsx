import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
    Card,
    CardBody,
    Image,
    Stack,
    Heading,
    Text,
    Divider,
    CardFooter,
    ButtonGroup,
    Button
} from '@chakra-ui/react'

const ResumeBoard = () => {

    return (
        <Stack direction="row" gap={2} justifyContent="space-around">

            <Card maxW='sm' shadow="lg">
                <CardBody textAlign="center">
                    <Stat>
                        {/* <StatLabel>Usuarios activos</StatLabel> */}
                        <StatNumber>349</StatNumber>
                        <StatHelpText>
                            <StatArrow type='increase' />
                            23.36%
                        </StatHelpText>
                    </Stat>
                    <Stack mt='6' spacing='3'>
                        <Heading size='md'>Guias generadas</Heading>
                        <Text>
                            Cantidad de etiquetas creadas y el cambio en las ultimas 24hs
                        </Text>
                    </Stack>
                </CardBody>
                <Divider />
                {/* <CardFooter>
                    <ButtonGroup spacing='2'>
                        <Button variant='solid' colorScheme='blue'>
                            Buy now
                        </Button>
                        <Button variant='ghost' colorScheme='blue'>
                            Add to cart
                        </Button>
                    </ButtonGroup>
                </CardFooter> */}
            </Card>

            <Card maxW='sm' shadow="lg">
                <CardBody textAlign="center">
                    <Stat>
                        <StatNumber>45</StatNumber>
                        <StatHelpText>
                            <StatArrow type='decrease' />
                            9.05%
                        </StatHelpText>
                    </Stat>
                    <Stack mt='6' spacing='3'>
                        <Heading size='md'>Usuarios Activos</Heading>
                        <Text>
                            Numero de cuentas registradas y el cambio en las ultimas 24hs
                        </Text>
                    </Stack>
                </CardBody>
                <Divider />
                {/* <CardFooter>
                    <ButtonGroup spacing='2'>
                        <Button variant='solid' colorScheme='blue'>
                            Buy now
                        </Button>
                        <Button variant='ghost' colorScheme='blue'>
                            Add to cart
                        </Button>
                    </ButtonGroup>
                </CardFooter> */}
            </Card>

            <Card maxW='sm' shadow="lg">
                <CardBody textAlign="center">
                    <Stat>
                        <StatNumber>250</StatNumber>
                        <StatHelpText>
                            <StatArrow type='decrease' />
                            5.05%
                        </StatHelpText>
                    </Stat>
                    <Stack mt='6' spacing='3'>
                        <Heading size='md'>Cotizaciones Realizadas</Heading>
                        <Text>
                            Numero de veces que se han consultado los servicios de paqueterias y el cambio en las ultimas 24hs
                        </Text>
                    </Stack>
                </CardBody>
                <Divider />
                {/* <CardFooter>
                    <ButtonGroup spacing='2'>
                        <Button variant='solid' colorScheme='blue'>
                            Buy now
                        </Button>
                        <Button variant='ghost' colorScheme='blue'>
                            Add to cart
                        </Button>
                    </ButtonGroup>
                </CardFooter> */}
            </Card>


        
        </Stack>
    )

}

export default ResumeBoard