'use client'
import React from "react"
import { Box, Button, FormControl, FormLabel, Grid, GridItem, Input, InputGroup, InputRightElement, Icon } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"

const UserRegister = () => {
    const [showPassword, setShowPassword] = React.useState(false)
    const handlePasswordShow = () => setShowPassword(!showPassword)


    const createUser = (e: any) => {
        e.preventDefault()
        console.log("Create User!", { mail: e.target.email.value, userName: e.target.username.value, password: e.target.password.value })
    }

    return (
        <Box>
            <form onSubmit={(e) => { createUser(e) }}>
                <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                    <GridItem >
                        <FormControl>
                            <FormLabel>Nombre de usuario</FormLabel>
                            <Input name="username" />
                        </FormControl>
                    </GridItem>
                    <GridItem >
                        <FormControl>
                            <FormLabel>Clave</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="*******"
                                    size="lg"
                                    name="password"
                                />
                                <InputRightElement width="3rem">
                                    <Button h="1.5rem" size="sm" onClick={handlePasswordShow}>
                                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </GridItem>
                    <GridItem >
                        <FormControl>
                            <FormLabel>Correo electronico</FormLabel>
                            <Input name="email" type="email" />
                        </FormControl>
                    </GridItem>
                    <GridItem>
                        <Button type="submit" colorScheme="teal">
                            Crear usuario
                        </Button>
                    </GridItem>
                </Grid>
            </form>
        </Box>
    )
}

export default UserRegister;