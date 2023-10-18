'use client'
import { Box, Button, GridItem, Grid } from "@chakra-ui/react"
import UsersTable from "./table";
import { useState } from "react";
import UserManagement from "./UserManagement";
import { User } from "./UserTypes";



const UsersLayout = () => {
    const [showForm, setShowForm] = useState(false)
    const [isEditUser, setIsEditUser] = useState(false)
    const [userData, setUserData] = useState<User>({
        id: 0,
        name: '',
        email: '',
        role: ' ',
        provider_access: []
        // Initialize other user data fields
    })
    const showUserRegisterForm = (e: any) => {
        setShowForm(!showForm)
        if (undefined !== e['_id']) {
            setIsEditUser(true)
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
                        {/* <UserRegister userData={userData} isEdit={isEditUser} /> */}
                        <UserManagement selectedUser={userData} />
                    </GridItem>
                )}
            </Grid>
        </Box>
    )
}




export default UsersLayout;