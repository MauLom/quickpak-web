import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, ButtonGroup, useToast, Spinner, Input, Stack, FormControl, FormLabel } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, CopyIcon, RepeatIcon } from '@chakra-ui/icons';
import { getClients, deleteClient, createClient,updateClient } from '../../lib/requests';

export default function ClientsLayout() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', basic_auth_username: '', basic_auth_pass: '' });
    const [creating, setCreating] = useState(false);
    const [lastPassword, setLastPassword] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [lastGeneratedPassword, setLastGeneratedPassword] = useState<{ [userId: string]: string }>({});
    const toast = useToast();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const data = await getClients();
            setClients(data);
        } catch (error) {
            toast({
                title: 'Error al cargar clientes',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        }
        setLoading(false);
    };

    const handleDelete = async (user_id: string) => {
        try {
            await deleteClient(user_id);
            toast({
                title: 'Cliente eliminado',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fetchClients();
        } catch (error) {
            toast({
                title: 'Error al eliminar cliente',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const response = await createClient(form);
            toast({
                title: 'Cliente creado',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setForm({ name: '', basic_auth_username: '', basic_auth_pass: '' });
            setLastPassword(response.plainPassword || null);
            setShowPassword(true);
            fetchClients();
        } catch (error: any) {
            toast({
                title: 'Error al crear cliente',
                description: error?.message || '',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        }
        setCreating(false);
    };

    const handleCopyPassword = async () => {
        if (lastPassword) {
            await navigator.clipboard.writeText(lastPassword);
            toast({
                title: 'Contraseña copiada al portapapeles',
                status: 'info',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handleRegeneratePassword = async (user_id: string) => {
        try {
            const newPassword = Math.random().toString(36).slice(-10);
            await updateClient({ user_id, basic_auth_pass: newPassword });
            setLastGeneratedPassword(prev => ({ ...prev, [user_id]: newPassword }));
            await navigator.clipboard.writeText(newPassword);
            toast({
                title: 'Contraseña regenerada y copiada',
                description: newPassword,
                status: 'success',
                duration: 4000,
                isClosable: true,
            });
            fetchClients();
        } catch (error: any) {
            toast({
                title: 'Error al regenerar contraseña',
                description: error?.message || '',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        }
    };

    // Sugerencias de usuario
    const generateSuggestions = (name: string, existingUsernames: string[]) => {
        if (!name) return [];
        // Iniciales de cada palabra
        const initials = name.trim().split(/\s+/).map(w => w[0].toUpperCase()).join('');
        const suggestions = [
            initials,
            initials + '1',
            initials + '123',
            initials + Math.floor(Math.random() * 1000)
        ];
        // Filtrar sugerencias que ya existen en la BD
        return suggestions.filter(s => !existingUsernames.includes(s));
    };
    const existingUsernames = clients.map((c: any) => c.basic_auth_username?.toUpperCase?.() || '');
    const userSuggestions = generateSuggestions(form.name, existingUsernames);

    return (
        <Box paddingX={50} padding={10}>
            <h2 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: 12 }}>Administrar clientes</h2>
            <Box mb={8}>
                <form onSubmit={handleCreate} style={{ position: 'relative' }}>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={5} align="center" width="100%">
                        <FormControl isRequired position="relative">
                            <FormLabel>Nombre</FormLabel>
                            <Input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" />
                        </FormControl>
                        <FormControl isRequired position="relative">
                            <FormLabel>Usuario</FormLabel>
                            <Input name="basic_auth_username" value={form.basic_auth_username} onChange={handleChange} placeholder="Usuario" autoComplete="off" />
                            {form.name && userSuggestions.length > 0 && (
                                <Box mt={1} position="absolute" left={0} top="100%" width="100%" zIndex={10} bg="white" p={2} borderRadius={6} boxShadow="md">
                                    <span style={{ fontSize: '0.9em', color: '#888' }}>Sugerencias: </span>
                                    {userSuggestions.map((s, idx) => (
                                        <Button key={idx} size="xs" variant="ghost" colorScheme="gray" ml={1} onClick={() => setForm(f => ({ ...f, basic_auth_username: s }))}>{s}</Button>
                                    ))}
                                </Box>
                            )}
                        </FormControl>
                        <FormControl isRequired position="relative">
                            <FormLabel>Contraseña</FormLabel>
                            <Input name="basic_auth_pass" value={form.basic_auth_pass} onChange={handleChange} placeholder="Contraseña" />
                        </FormControl>
                        <Box flex="1" />
                        <FormControl minW="120px" maxW="160px" display="flex" flexDirection="column" alignItems="flex-end">
                            <FormLabel mb={1} textAlign="right" w="100%">Acciones</FormLabel>
                            <Button colorScheme="teal" type="submit" isLoading={creating}><AddIcon /></Button>
                        </FormControl>
                    </Stack>
                </form>
            </Box>
            {loading ? (
                <Spinner />
            ) : (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Nombre</Th>
                            <Th>Usuario</Th>
                            <Th textAlign="right">Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {clients.map((client: any) => (
                            <Tr key={client.user_id}>
                                <Td>{client.name}</Td>
                                <Td>{client.basic_auth_username}</Td>
                                <Td textAlign="right">
                                    <ButtonGroup>
                                        <Button colorScheme="blue" size="sm" leftIcon={<RepeatIcon />} onClick={() => handleRegeneratePassword(client.user_id)}>
                                            Regenerar y copiar contraseña
                                        </Button>
                                        <Button colorScheme="red" onClick={() => handleDelete(client.user_id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </ButtonGroup>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
        </Box>
    );
}
