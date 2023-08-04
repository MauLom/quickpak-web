'use client'
import React from 'react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Box,
    Button,

    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,

    Grid,
    GridItem
} from '@chakra-ui/react'

const LoginForm = () => {

    const [isOpenMessage, setIsOpenMessage] = React.useState(false)
    // const { isOpen, onOpen, onClose } = React.useDisclosure()
    return (
        <Box>
            <Grid>
                <GridItem>
                    <FormControl>
                        <FormLabel>Direccion de correo</FormLabel>
                        <Input type='email' />
                        <FormHelperText>Correo electronico donde se enviaron tus credenciales de acceso</FormHelperText>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel>Contraseña</FormLabel>
                        <Input type='password' />
                        <FormHelperText>Si aun no asignas una, verifica tu correo electronico</FormHelperText>
                    </FormControl>
                </GridItem>
                <GridItem> <Button colorScheme="cyan" onClick={() => { }}>Conectar</Button></GridItem>
                <GridItem>  <Button onClick={() => { setIsOpenMessage(true) }}>¿Problemas para iniciar sesion?</Button></GridItem>
            </Grid>

            <Modal closeOnOverlayClick={false} isOpen={isOpenMessage} onClose={() => { setIsOpenMessage(false) }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Contacta con nuestro soporte</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        Envianos un correo al ....
                        Con tus datos, de no tener una cuenta se asignara una, si ya tienes y no recuerdas tu contrasena, se enviara una nueva al correo de la cuenta
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => { setIsOpenMessage(false) }}>Ok!</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        </Box>
    )
}

export default LoginForm