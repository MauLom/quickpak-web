'use client'
import { Box, Button, GridItem, Grid } from "@chakra-ui/react"
import UsersTable from "./table";
import { useState } from "react";
import UserRegister from "./register";




const UsersLayout = () => {
    const [showForm, setShowForm] = useState(false)

    const showUserRegisterForm = () => {
        console.log("func called")
        setShowForm(!showForm)
    }

    return (
        <Box>
            <Grid templateColumns='repeat(1, 1fr)' gap={3} textAlign='center'>
                <GridItem >
                    <UsersTable  />
                </GridItem>
                <GridItem>
                    <Button onClick={() => showUserRegisterForm()}>
                        Agregar nuevo usuario
                    </Button>
                </GridItem>
                {showForm && (
                    <GridItem>
                        <UserRegister />
                    </GridItem>
                )}
            </Grid>
        </Box>
    )
}




export default UsersLayout;