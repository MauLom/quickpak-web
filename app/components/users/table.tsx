import React from 'react'
import { GetServerSideProps } from 'next'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    useToast,
    Button, ButtonGroup, Box
} from '@chakra-ui/react'

import { SettingsIcon, DeleteIcon } from '@chakra-ui/icons'
import { deleteUser, getUsers } from '../../lib/requests'

async function UsersTable(props: any) {
    const [dataTable, setDataTable] = React.useState([])
    const toast = useToast()


    React.useEffect(() => {
        toast({
            title: "Cargando usuarios",
            description: ``,
            status: "loading",
            duration: 5000,
            isClosable: true
          })
        getUsers().then(data => {
            console.log("This?")
            setDataTable(data)
            toast({
                title: "Usuarios cargados",
                description: ``,
                status: "success",
                duration: 5000,
                isClosable: true
              })
        })

    }, [])

    const goToEdit = (userData: any) => {
        props.handleShowForm(userData)
    }

    return (
        <Box>
             <TableContainer style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table variant='simple'>
                    {/* <TableCaption>Lista de usuarios registrados</TableCaption> */}
                    <Thead>
                        <Tr>
                            <Th>Nombre de usuario</Th>
                            <Th>Rol</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {dataTable.map(
                            each => {
                                return (
                                    <Tr key={each['_id']}>
                                        <Td>{each['userName']}</Td>
                                        <Td>{each['role']}</Td>
                                        <Td>
                                            <ButtonGroup>
                                                <Button onClick={() => { goToEdit(each) }}>
                                                    <SettingsIcon />
                                                </Button>
                                                <Button>
                                                    <DeleteIcon onClick={() => { deleteUser(each["_id"]) }} />
                                                </Button>
                                            </ButtonGroup>
                                        </Td>
                                    </Tr>
                                )
                            }
                        )}

                    </Tbody>
                    {/* <Tfoot>
                            <Tr>
                                <Th>To convert</Th>
                                <Th>into</Th>
                                <Th isNumeric>multiply by</Th>
                            </Tr>
                        </Tfoot> */}
                </Table>
            </TableContainer>


        </Box>
    )
}


export default UsersTable;
