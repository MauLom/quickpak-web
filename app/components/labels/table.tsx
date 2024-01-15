import React, { useState, useEffect, useMemo } from 'react';
import { Box, Select, Table, TableContainer, Thead, Tbody, Tr, Th, Td, Input, Button } from '@chakra-ui/react';
import { getLabels, getUsers } from '../../lib/requests';
import { ParcelData, User, extractParcelData } from './utils';

const LabelsTable = () => {
    const [arrDataTable, setArrDataTable] = useState<ParcelData[]>([]);
    const [usersMap, setUsersMap] = useState<{ [key: string]: string }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterParcel, setFilterParcel] = useState('');
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsers();
                if (users.length > 0) {
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
        } catch (error) {
            console.error('Error fetching labels:', error);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleParcelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterParcel(event.target.value);
    };

    const parcelOptions = useMemo(() => {
        const uniqueParcels = new Set(arrDataTable.map(data => data.parcel));
        return Array.from(uniqueParcels);
    }, [arrDataTable]);

    const parcelFilteredItems = filterParcel
        ? arrDataTable.filter(item => item.parcel === filterParcel)
        : arrDataTable;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = parcelFilteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const filteredItems = currentItems.filter(item => {
        const labelID = item.labelID?.toString().toLowerCase() ?? "";
        const parcel = item.parcel?.toLowerCase() ?? "";
        const userName = usersMap[item.userId]?.toLowerCase() ?? "";
        return labelID.includes(searchTerm.toLowerCase()) ||
            parcel.includes(searchTerm.toLowerCase()) ||
            userName.includes(searchTerm.toLowerCase());
    });

    const renderedTableRows = useMemo(() => filteredItems.map((eachSet) => (
        <Tr key={eachSet.labelID}>
            <Td>{usersMap[eachSet.userId]}</Td>
            <Td>{eachSet.labelID}</Td>
            <Td>{eachSet.parcel}</Td>
            <Td>{eachSet.numberOfPieces}</Td> {/* New data */}
            <Td>{eachSet.dimensions.length}</Td> {/* New data */}
            <Td>{eachSet.dimensions.width}</Td> {/* New data */}
            <Td>{eachSet.dimensions.height}</Td> {/* New data */}
            <Td>{eachSet.description}</Td> {/* New data */}
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
            <Select placeholder="Filter by Parcel" onChange={handleParcelChange}>
                {parcelOptions.map((parcel, index) => (
                    <option key={index} value={parcel}>{parcel}</option>
                ))}
            </Select>
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Cliente</Th> {/* Previously Usuario */}
                            <Th>No. Guía</Th> {/* Previously Id Guia */}
                            <Th>Paqueteria</Th>
                            <Th>Piezas</Th> {/* New Column */}
                            <Th>Largo</Th> {/* New Column */}
                            <Th>Ancho</Th> {/* New Column */}
                            <Th>Alto</Th> {/* New Column */}
                            <Th>Contenido</Th> {/* New Column */}
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
