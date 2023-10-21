'use client'
import { Box, Button, GridItem, Grid } from "@chakra-ui/react"
import UsersTable from "./table";
import { useState } from "react";
import UserManagement from "./UserManagement";
import { User } from "../../types/UsersRelated";



const UsersLayout = () => {
    const [showForm, setShowForm] = useState(false)
    const [userData, setUserData] = useState<User>({
        _id: 0,
        userName: '',
        email: '',
        role: ' ',
        password: "",
        string_reference: "",
        provider_access: []
    })
    const showUserRegisterForm = (e: any) => {
        setShowForm(!showForm)
        if (undefined !== e['_id']) {
            setUserData(e)
        }
    }

    return (
        <Box>
            <Grid templateColumns='repeat(1, 1fr)' gap={3} textAlign='center'>
                <GridItem >
                    <UsersTable handleShowForm={(e: any) => { showUserRegisterForm(e) }} />
                </GridItem>
                {!showForm && (
                    <GridItem>
                        <Button onClick={(e) => showUserRegisterForm(e)}>
                            Agregar nuevo usuario
                        </Button>
                    </GridItem>
                )}

                {showForm && (
                    <GridItem>
                        <UserManagement selectedUser={userData} />
                    </GridItem>
                )}
            </Grid>
        </Box>
    )
}




export default UsersLayout;