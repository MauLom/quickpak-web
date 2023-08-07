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
const UsersTable = () => {
    return (
        <Box>
            <TableContainer>
                <Table variant='simple'>
                    <TableCaption>Lista de usuarios registrados</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Nombre de usuario</Th>
                            <Th>Ultima conexion</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Test</Td>
                            <Td>03/08/2023</Td>
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