import React, { useState, useEffect, useMemo } from 'react';
import { Box, Select, Table, TableContainer, TableCaption, Thead, Tbody, Tr, Th, Td, Input, Button } from '@chakra-ui/react';
import { getLabels, getUsers } from '../../lib/requests';
import { ParcelData, User, extractParcelData } from './utils';

const LabelsTable = () => {
    const [origenLabels, setOrigenLabels] = useState<string>('');
    const [arrDataTable, setArrDataTable] = useState<ParcelData[]>([]);
    const [userQuotes, setUserQuotes] = useState<string>('');
    const [usersOptions, setUsersOptions] = useState<User[]>([]);
    const [usersMap, setUsersMap] = useState<{ [key: string]: string }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsers();
                if (users.length > 0) {
                    setUsersOptions(users);
                    setUsersMap(users.reduce((acc: { [key: string]: string }, user: User) => {
                        acc[user._id] = user.userName;
                        return acc;
                    }, {}));
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleProviderChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        try {
            const dataRes = await getLabels(event.target.value);
            if (dataRes.length > 0) {
                setArrDataTable(extractParcelData(dataRes));
            }
            setOrigenLabels(event.target.value);
        } catch (error) {
            console.error('Error fetching labels:', error);
        }
    };

    const handleChangeUsuarioCotizacion = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUserQuotes(e.target.value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = arrDataTable.slice(indexOfFirstItem, indexOfLastItem);

    const filteredItems = currentItems.filter(item => {
        const labelID = item.labelID?.toString().toLowerCase() ?? "";
        const parcel = item.parcel?.toLowerCase() ?? "";
        const userName = usersMap[item.userId]?.toLowerCase() ?? "";

        return labelID.includes(searchTerm.toLowerCase()) ||
            parcel.includes(searchTerm.toLowerCase()) ||
            userName.includes(searchTerm.toLowerCase());
        // Add more conditions if needed
    });


    const renderedTableRows = useMemo(() => filteredItems.map((eachSet) => (
        <Tr key={eachSet.labelID}>
            <Td>{usersMap[eachSet.userId]}</Td>
            <Td>{eachSet.labelID}</Td>
            <Td>{eachSet.parcel}</Td>
            <Td>{eachSet.dimensions}</Td>
            <Td>{eachSet.weight}</Td>
        </Tr>
    )), [filteredItems, usersMap]);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <Box>
            <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <Select placeholder='Selecciona el origen de datos' onChange={handleProviderChange}>
                <option value='Labels'>Guias en plataforma WEB</option>
                <option value='generatedLabels'>Guias de Integraciones</option>
            </Select>
            {/* <Select placeholder="Usuario para cotizar" value={userQuotes} onChange={handleChangeUsuarioCotizacion}>
                {usersOptions.map((user) => (
                    <option key={user._id} value={user._id}>{user.userName}</option>
                ))}
            </Select> */}
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Usuario</Th>
                            <Th>Id Guia</Th>
                            <Th>Paqueteria</Th>
                            <Th>Dimensiones</Th>
                            <Th>Peso</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {renderedTableRows}
                    </Tbody>
                </Table>
            </TableContainer>
            <Box>
                {[...Array(Math.ceil(arrDataTable.length / itemsPerPage)).keys()].map(number => (
                    <Button key={number} onClick={() => paginate(number + 1)}>
                        {number + 1}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default LabelsTable;
