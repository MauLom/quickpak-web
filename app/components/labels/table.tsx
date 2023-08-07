'use client'
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
} from '@chakra-ui/react'
const LabelsTable = () => {
    return (
        <>
            <TableContainer>
                <Table variant='simple'>
                    <TableCaption>Imperial to metric conversion factors</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Usuario</Th>
                            <Th>Id Guia</Th>
                            <Th>Paqueteria</Th>
                            <Th>Alto</Th>
                            <Th>Ancho</Th>
                            <Th>Largo</Th>
                            <Th>Peso</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Prueba</Td>
                            <Td>111111</Td>
                            <Td>Estafeta</Td>
                            <Td>15</Td>
                            <Td>15</Td>
                            <Td>15</Td>
                            <Td>15</Td>
                        </Tr>
                        <Tr>
                            <Td>Test</Td>
                            <Td>121212</Td>
                            <Td>DHL</Td>
                            <Td>15</Td>
                            <Td>10</Td>
                            <Td>10</Td>
                            <Td>10</Td>
                        </Tr>
                    </Tbody>

                </Table>
            </TableContainer>
        </>
    )
}
export default LabelsTable