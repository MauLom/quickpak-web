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

async function getData() {
    const res = await fetch("https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2/usersData")
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

async function UsersTable() {
    const [dataTable, setDataTable] = React.useState([])
    React.useEffect(() => {
        getData().then(data => {
            setDataTable(data?.users)
        })

    }, [])

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
                            each => (
                                <Tr>
                                    <Td>{each?.userName}</Td>
                                    <Td>{each?.role}</Td>
                                    <Td>
                                        <ButtonGroup>
                                            <Button>
                                                <SettingsIcon />
                                            </Button>
                                            <Button>
                                                <DeleteIcon />
                                            </Button>
                                        </ButtonGroup>
                                    </Td>
                                </Tr>
                            )
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

// export default UsersTable;

export default UsersTable;
