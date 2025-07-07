import React, { useEffect, useState } from 'react';
import {
	Box, Table, Thead, Tbody, Tr, Th, Td, Button, ButtonGroup, useToast, Spinner, Input, Stack, FormControl,
	FormLabel, Checkbox, Card, CardHeader, CardBody, CardFooter, Avatar, Flex, Text, Badge,
	AvatarBadge
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, CopyIcon, RepeatIcon, SettingsIcon } from '@chakra-ui/icons';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { getClients, deleteClient, createClient, updateClient, getClientByUserId, updateDHLMatrix, updateEstafetaMatrix } from '../../lib/requests';
import AltaMatrizUsuario from './AltaMatrizEstafeta';
import AltaMatrizDHL from './AltaMatrizDHL';


export default function ClientsLayout() {
	const [clients, setClients] = useState([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState({ name: '', basic_auth_username: '', basic_auth_pass: '' });
	const [creating, setCreating] = useState(false);
	const [lastPassword, setLastPassword] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [lastGeneratedPassword, setLastGeneratedPassword] = useState<{ [userId: string]: string }>({});
	const [selectedClient, setSelectedClient] = useState<any>(null);
	const [loadingEstafeta, setLoadingEstafeta] = useState(false);
	const [loadingDHL, setLoadingDHL] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
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

	const handleToggleActive = async (client: any) => {
		try {
			await updateClient({ user_id: client.user_id, is_active: !client.is_active });
			toast({
				title: `Cliente ${!client.is_active ? 'activado' : 'desactivado'}`,
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
			fetchClients();
		} catch (error: any) {
			toast({
				title: 'Error al actualizar estado',
				description: error?.message || '',
				status: 'error',
				duration: 4000,
				isClosable: true,
			});
		}
	};

	// Handler para abrir modal de configuración
	const handleOpenSettings = async (client: any) => {
		// Carga la info actualizada del usuario desde la base de datos
		try {
			const found = await getClientByUserId(client.user_id);
			const matrizEstafetaActiva = !!(found.pricing_matrix_estafeta && (
				Array.isArray(found.pricing_matrix_estafeta.Terrestre) && found.pricing_matrix_estafeta.Terrestre.length > 0 ||
				Array.isArray(found.pricing_matrix_estafeta['Dia Sig.']) && found.pricing_matrix_estafeta['Dia Sig.'].length > 0
			));
			const matrizDHLActiva = !!(found.pricing_matrix_dhl && (
				Array.isArray(found.pricing_matrix_dhl.N) && found.pricing_matrix_dhl.N.length > 0 ||
				Array.isArray(found.pricing_matrix_dhl.G) && found.pricing_matrix_dhl.G.length > 0
			));
			setSelectedClient({
				...found,
				matriz_estafeta_activa: matrizEstafetaActiva,
				matriz_dhl_activa: matrizDHLActiva,
			});
			onOpen();
		} catch (e) {
			toast({
				title: 'Error al cargar datos del usuario',
				status: 'error',
				duration: 4000,
				isClosable: true,
			});
		}
	};
	
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
							<Th>Activo</Th>
							<Th textAlign="right">Acciones</Th>
						</Tr>
					</Thead>
					<Tbody>
						{clients.map((client: any) => (
							<Tr key={client.user_id}>
								<Td>{client.name}</Td>
								<Td>{client.basic_auth_username}</Td>
								<Td>
									<Checkbox
										size="md"
										colorScheme='teal'
										isChecked={client.is_active}
										_readOnly='true'
									>
									</Checkbox>
								</Td>
								<Td textAlign="right">
									<ButtonGroup size="sm">
										<Button
											bg="gray.700"
											color="white"
											_hover={{ bg: 'gray.800' }}
											onClick={() => handleOpenSettings(client)}
											title="Configurar usuario"
											aria-label="Configurar usuario"
										>
											<SettingsIcon />
										</Button>
										<Button
											colorScheme="blue"
											size="sm"
											onClick={() => handleRegeneratePassword(client.user_id)}
											title="Regenerar y copiar contraseña"
											aria-label="Regenerar y copiar contraseña"
										>
											<RepeatIcon />
										</Button>
										<Button
											size="sm"
											colorScheme={client.is_active ? 'yellow' : 'teal'}
											variant="outline"
											onClick={() => handleToggleActive(client)}
											title={client.is_active ? 'Desactivar usuario' : 'Activar usuario'}
											aria-label={client.is_active ? 'Desactivar usuario' : 'Activar usuario'}
										>
											{client.is_active ? '⏸' : '▶'}
										</Button>
										<Button
											size='sm'
											colorScheme="red"
											onClick={() => handleDelete(client.user_id)}
											title="Eliminar cliente"
											aria-label="Eliminar cliente"
										>
											<DeleteIcon />
										</Button>
									</ButtonGroup>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			)}
			{/* Modal de configuración de usuario */}
			<Modal isOpen={isOpen} onClose={onClose} size="xxl" >
				<ModalOverlay />
				<ModalContent m={8}>
					<ModalHeader>Configuración de usuario</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{selectedClient && (
							<Card boxShadow="lg" borderRadius={10} mb={4}>
								<CardHeader fontSize="lg" bg="gray.50" borderTopRadius={10}>
									<Flex>
										<Avatar name={selectedClient.name} >
											<AvatarBadge boxSize='1.25em' bg={selectedClient.is_active ? 'teal' : 'red'}></AvatarBadge>
										</Avatar>
										<Box ml='3'>
											<Text fontWeight='bold'>
												{selectedClient.name}
											</Text>
											<Text fontSize='sm'>{selectedClient.basic_auth_username}</Text>
										</Box>
										{/* Botones para activar/desactivar matrices */}
										<Box ml='auto' display="flex" alignItems="center" gap={2}>
											<Button
												size="sm"
												colorScheme={selectedClient.matriz_estafeta_activa ? 'teal' : 'gray'}
												variant={selectedClient.matriz_estafeta_activa ? 'solid' : 'outline'}
												onClick={async () => {
													setLoadingEstafeta(true);
													if (selectedClient.matriz_estafeta_activa) {
														// Eliminar matriz Estafeta en BD
														try {
															await updateEstafetaMatrix(selectedClient.user_id, {});
															setSelectedClient((c: any) => ({ ...c, matriz_estafeta_activa: false, pricing_matrix_estafeta: {} }));
															toast({
																title: 'Matriz Estafeta eliminada',
																status: 'success',
																duration: 3000,
																isClosable: true,
															});
														} catch (error: any) {
															toast({
																title: 'Error al eliminar matriz',
																description: error?.message || '',
																status: 'error',
																duration: 4000,
																isClosable: true,
															});
														}
													} else {
														setSelectedClient((c: any) => ({ ...c, matriz_estafeta_activa: true }));
													}
													setTimeout(() => setLoadingEstafeta(false), 600); // Simula carga
												}}
												isLoading={loadingEstafeta}
											>
												{selectedClient.matriz_estafeta_activa ? 'Eliminar matriz Estafeta' : 'Agregar matriz Estafeta'}
											</Button>
											<Button
												size="sm"
												colorScheme={selectedClient.matriz_dhl_activa ? 'teal' : 'gray'}
												variant={selectedClient.matriz_dhl_activa ? 'solid' : 'outline'}
												onClick={async () => {
													setLoadingDHL(true);
													if (selectedClient.matriz_dhl_activa) {
														// Eliminar matriz DHL en BD
														try {
															await updateDHLMatrix(selectedClient.user_id, {});
															setSelectedClient((c: any) => ({ ...c, matriz_dhl_activa: false, pricing_matrix_dhl: {} }));
															toast({
																title: 'Matriz DHL eliminada',
																status: 'success',
																duration: 3000,
																isClosable: true,
															});
														} catch (error: any) {
															toast({
																title: 'Error al eliminar matriz',
																description: error?.message || '',
																status: 'error',
																duration: 4000,
																isClosable: true,
															});
														}
													} else {
														setSelectedClient((c: any) => ({ ...c, matriz_dhl_activa: true }));
													}
													setTimeout(() => setLoadingDHL(false), 600); // Simula carga
												}}
												isLoading={loadingDHL}
											>
												{selectedClient.matriz_dhl_activa ? 'Eliminar matriz DHL' : 'Agregar matriz DHL'}
											</Button>
										</Box>
									</Flex>
								</CardHeader>
								<CardBody>
									{/* Alta de matriz personalizada tipo Estafeta */}
									{selectedClient.matriz_estafeta_activa && !loadingEstafeta && (
										<AltaMatrizUsuario
											userId={selectedClient.user_id}
											initialMatrix={selectedClient.pricing_matrix_estafeta}
											onSave={async (pricing_matrix_estafeta: any) => {
												try {
													await updateEstafetaMatrix(selectedClient.user_id, pricing_matrix_estafeta);
													toast({
														title: 'Matriz Estafeta guardada',
														status: 'success',
														duration: 3000,
														isClosable: true,
													});
												} catch (error: any) {
													toast({
														title: 'Error al guardar matriz',
														description: error?.message || '',
														status: 'error',
														duration: 4000,
														isClosable: true,
													});
												}
											}}
										/>
									)}
									{/* Alta de matriz personalizada tipo DHL */}
									{selectedClient.matriz_dhl_activa && !loadingDHL && (
										<AltaMatrizDHL
											userId={selectedClient.user_id}
											initialMatrix={selectedClient.pricing_matrix_dhl}
											onSave={async (pricing_matrix_dhl: any) => {
												try {
													await updateDHLMatrix(selectedClient.user_id, pricing_matrix_dhl);
													toast({
														title: 'Matriz DHL guardada',
														status: 'success',
														duration: 3000,
														isClosable: true,
													});
												} catch (error: any) {
													toast({
														title: 'Error al guardar matriz',
														description: error?.message || '',
														status: 'error',
														duration: 4000,
														isClosable: true,
													});
												}
											}}
										/>
									)}
									{/* Loading visual para matrices */}
									{(loadingEstafeta || loadingDHL) && (
										<Box w="100%" py={10} textAlign="center">
											<Spinner size="lg" color="teal.500" />
											<Text mt={2} color="gray.600">Cargando matriz...</Text>
										</Box>
									)}
								</CardBody>
								<CardFooter>
									{/* Aquí puedes agregar acciones si lo deseas */}
								</CardFooter>
							</Card>
						)}
					</ModalBody>
					<ModalFooter>
						<Button onClick={onClose}>Cerrar</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
}
