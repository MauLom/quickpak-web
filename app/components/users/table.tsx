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

    Button, ButtonGroup, Box
} from '@chakra-ui/react'

import { SettingsIcon, DeleteIcon } from '@chakra-ui/icons'
import { getUsers } from '../../lib/requests'

async function UsersTable(props:any) {
    const [dataTable, setDataTable] = React.useState([])
    React.useEffect(() => {
        getUsers().then(data => {
            console.log("data", data)
            setDataTable(data)
        })

    }, [])

    const goToEdit = (userData: any) => {
        props.handleShowForm(userData)
    }

    return (
        <Box>
            <TableContainer>
                <Table variant='simple'>
                    <TableCaption>Lista de usuarios registrados</TableCaption>
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
                                        <Td>{each['name']}</Td>
                                        <Td>{each['role']}</Td>
                                        <Td>
                                            <ButtonGroup>
                                                <Button onClick={() => { goToEdit(each) }}>
                                                    <SettingsIcon />
                                                </Button>
                                                <Button>
                                                    <DeleteIcon />
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
