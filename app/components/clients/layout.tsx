import React, { useEffect, useState } from 'react';
import {
	Box, Table, Thead, Tbody, Tr, Th, Td, Button, ButtonGroup, useToast, Spinner, Input, Stack, FormControl,
	FormLabel, Checkbox, Card, CardHeader, CardBody, CardFooter, Avatar, Flex, Text, Badge,
	AvatarBadge,
	VStack,
	Select,
	Heading,
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionButton,
	AccordionIcon
} from '@chakra-ui/react';
import { DeleteIcon, RepeatIcon, SettingsIcon, EditIcon } from '@chakra-ui/icons';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { getClients, deleteClient, createClient, updateClient, getClientByUserId, updateDHLMatrix, updateEstafetaMatrix } from '../../lib/requests';
import AltaMatrizUsuario from './AltaMatrizEstafeta';
import AltaMatrizDHL from './AltaMatrizDHL';

export default function ClientsLayout() {
	const [clients, setClients] = useState([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState({ name: '', email: '', role: 'usuario', userName: '', password: '', basic_auth_username: '', basic_auth_pass: '', reference_dhl: '', reference_estafeta: '' });
	const [creating, setCreating] = useState(false);
	const [lastPassword, setLastPassword] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [lastGeneratedPassword, setLastGeneratedPassword] = useState<{ [userId: string]: string }>({});
	const [selectedClient, setSelectedClient] = useState<any>(null);
	const [loadingEstafeta, setLoadingEstafeta] = useState(false);
	const [loadingDHL, setLoadingDHL] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const itemsPerPage = 10;
	const [isEditing, setIsEditing] = useState(false);
	const [editingUserId, setEditingUserId] = useState<string | null>(null);
	const [isAccordionOpen, setIsAccordionOpen] = useState(false);

	useEffect(() => {
		fetchClients(currentPage, itemsPerPage);
	}, [currentPage, searchTerm]);

	const fetchClients = async (page = 1, limit = itemsPerPage) => {
		setLoading(true);
		try {
			const data = await getClients({ page, limit, search: searchTerm });
			setClients(data.clients);
			setTotalPages(data.totalPages);
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

	const handleCreateOrUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setCreating(true);
		try {
			if (isEditing && editingUserId) {
				// Crea un objeto solo con los campos a actualizar
				const updateData: any = { user_id: editingUserId, ...form };
				if (!form.password) delete updateData.password;
				if (!form.basic_auth_pass) delete updateData.basic_auth_pass;
				await updateClient(updateData);
				toast({
					title: 'Cliente actualizado',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
			} else {
				const response = await createClient(form);
				toast({
					title: 'Cliente creado',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				setLastPassword(response.plainPassword || null);
				setShowPassword(true);
			}
			setForm({ name: '', email: '', role: 'usuario', userName: '', password: '', basic_auth_username: '', basic_auth_pass: '', reference_dhl: '', reference_estafeta: '' });
			setIsEditing(false);
			setEditingUserId(null);
			fetchClients();
		} catch (error: any) {
			toast({
				title: isEditing ? 'Error al actualizar cliente' : 'Error al crear cliente',
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

	// Sugerencias de usuario api
	const generateUserNameAPISuggestions = (name: string, existingUsernames: string[]) => {
		if (!name) return [];
		// Iniciales de cada palabra
		const initials = name.trim().split(/\s+/).map(w => w[0].toUpperCase()).join('');
		const suggestions = [
			(Math.random() + 1).toString(36).substring(2),
			initials,
			initials + Math.floor(Math.random() * 1000),
			initials + Math.floor(Math.random() * 1000),
			initials + Math.floor(Math.random() * 1000)
		];
		// Filtrar sugerencias que ya existen en la BD
		return suggestions.filter(s => !existingUsernames.includes(s));
	};

	// Sugerencias de usuario web
	const generateUserNameWebSuggestions = (name: string, existingUsernames: string[]) => {
		if (!name) return [];
		// Iniciales de cada palabra
		const initials = name.trim().split(/\s+/).map(w => w[0].toUpperCase()).join('');
		const suggestions = [
			initials,
			initials + Math.floor(Math.random() * 1000),
			name.split(' ').map(w => w.toUpperCase()).join('_'),
			name.split(' ').map(w => w.toUpperCase()).join('_') + Math.floor(Math.random() * 1000)
		];
		// Filtrar sugerencias que ya existen en la BD
		return suggestions.filter(s => !existingUsernames.includes(s));
	};

	console.log(clients)
	const existingUsernames = clients?.map((c: any) => c.basic_auth_username?.toUpperCase?.() || '');
	const existingUsernamesWeb = clients?.map((c: any) => c.userName?.toUpperCase?.() || '');
	const userSuggestions = generateUserNameAPISuggestions(form.name, existingUsernames);
	const userWebSuggestions = generateUserNameWebSuggestions(form.name, existingUsernamesWeb);

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
			<Heading style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: 12 }}>Administrar Usuarios</Heading>
			<Accordion allowToggle index={isAccordionOpen ? 0 : -1} onChange={(idx) => setIsAccordionOpen(idx === 0)}>
				<AccordionItem>
					<h1>
						<AccordionButton _expanded={{ bg: 'teal.100', color: 'teal.800' }}>
							<Box flex='1' textAlign='left' fontWeight={'bold'}>
								Usuarios
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h1>
					<AccordionPanel borderStyle={'solid'} borderWidth={2} borderColor="teal.100" padding={4}>
						<Box mb={8}>
							<form onSubmit={handleCreateOrUpdate} style={{ position: 'relative' }}>
								<Stack direction={{ base: 'column', md: 'row' }} spacing={5} align="center" width="100%" >
									<FormControl isRequired position="relative">
										<FormLabel>Nombre</FormLabel>
										<Input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" />
									</FormControl>
									<FormControl position="relative">
										<FormLabel>Correo</FormLabel>
										<Input name="email" value={form.email} onChange={handleChange} placeholder="correo@mail.com.mx" type='email' />
									</FormControl>
									<FormControl isRequired position="relative">
										<FormLabel>Rol</FormLabel>
										<Select isRequired id="role" name="role" value={form.role} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, role: e.target.value })} placeholder="Selecciona un rol">
											<option value="usuario">Ususario</option>
											<option value="admin">Administrador</option>
										</Select>
									</FormControl>
									<FormControl isRequired position="relative">
										<FormLabel>Referencia DHL</FormLabel>
										<Input name="reference_dhl" value={form.reference_dhl} onChange={handleChange} placeholder="Referencia DHL" />
									</FormControl>
									<FormControl isRequired position="relative">
										<FormLabel>Referencia Estafeta</FormLabel>
										<Input name="reference_estafeta" value={form.reference_estafeta} onChange={handleChange} placeholder="Referencia Estafeta" />
									</FormControl>
								</Stack>
								<Stack direction={{ base: 'column', md: 'row' }} spacing={5} align="center" width="100%" mt={5}>
									<Card width={'50%'} boxShadow="lg" borderRadius={10}>
										<CardHeader fontSize="lg" bg="gray.50" borderTopRadius={10}>Autenticación Web</CardHeader>
										<CardBody>
											<VStack>
												<FormControl isRequired position="relative">
													<FormLabel>Usuario</FormLabel>
													<Input name="userName" value={form.userName} onChange={handleChange} placeholder="Usuario" autoComplete="off" />
													{form.name && userWebSuggestions.length > 0 && !form.userName && (
														<Box mt={1} position="absolute" left={0} top="100%" width="100%" zIndex={10} bg="#E6FFFA" p={2} borderRadius={6} boxShadow="md">
															<span style={{ fontSize: '0.9em', color: '#888' }}>Sugerencias: </span>
															{userWebSuggestions.map((s, idx) => (
																<Button key={idx} size="xs" variant="ghost" colorScheme="blue" ml={1} onClick={() => setForm(f => ({ ...f, userName: s }))}>{s}</Button>
															))}
														</Box>
													)}
												</FormControl>
												<FormControl isRequired={!isEditing} position="relative">
													<FormLabel>Contraseña</FormLabel>
													<Input name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" type='password' />
												</FormControl>
											</VStack>
										</CardBody>
									</Card>
									<Card width={'50%'} boxShadow="lg" borderRadius={10}>
										<CardHeader fontSize="lg" bg="gray.50" borderTopRadius={10}>Autenticación API</CardHeader>
										<CardBody>
											<VStack>
												<FormControl isRequired position="relative">
													<FormLabel>Usuario</FormLabel>
													<Input name="basic_auth_username" value={form.basic_auth_username} onChange={handleChange} placeholder="Usuario" autoComplete="off" />
													{form.name && userSuggestions.length > 0 && !form.basic_auth_username && (
														<Box mt={1} position="absolute" left={0} top="100%" width="100%" zIndex={10} bg="#E6FFFA" p={2} borderRadius={6} boxShadow="md">
															<span style={{ fontSize: '0.9em', color: '#888' }}>Sugerencias: </span>
															{userSuggestions.map((s, idx) => (
																<Button key={idx} size="xs" variant="ghost" colorScheme="blue" ml={1} onClick={() => setForm(f => ({ ...f, basic_auth_username: s }))}>{s}</Button>
															))}
														</Box>
													)}
												</FormControl>
												<FormControl isRequired={!isEditing} position="relative">
													<FormLabel>Contraseña</FormLabel>
													<Input name="basic_auth_pass" value={form.basic_auth_pass} onChange={handleChange} placeholder="Contraseña" type='password' />
												</FormControl>
											</VStack>
										</CardBody>
									</Card>
								</Stack>
								<Stack flex={1} direction={{ base: 'column', md: 'row' }} spacing={5} align="center" width="100%" mt={5}>
									<Button colorScheme="teal" type="submit" isLoading={creating} my={5} ml='auto'>Guardar</Button>
									{isEditing && (
										<Button
											colorScheme="gray"
											variant="outline"
											onClick={() => {
												setIsEditing(false);
												setEditingUserId(null);
												setForm({ name: '', email: '', role: 'usuario', userName: '', password: '', basic_auth_username: '', basic_auth_pass: '', reference_dhl: '', reference_estafeta: '' });
											}}>
											Cancelar edición
										</Button>
									)}
								</Stack>
							</form>
						</Box>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
			<Box my={5}>
				<Input
					placeholder="Buscar por nombre"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					size="md"
					mb={4}
				/>
			</Box>
			{loading ? (
				<Spinner />
			) : (
				<>
					<Table variant="striped" size="sm" boxShadow="md" borderRadius={10} overflow="hidden" colorScheme='blue'>
						<Thead>
							<Tr>
								<Th textAlign="center">Nombre</Th>
								<Th textAlign="center">Usuario Web</Th>
								<Th textAlign="center">Referencia DHL</Th>
								<Th textAlign="center">Referencia Estafeta</Th>
								<Th textAlign="center">Usuario API</Th>
								<Th textAlign="center">Usuario API Activo</Th>
								<Th textAlign="center">Acciones</Th>
							</Tr>
						</Thead>
						<Tbody>
							{clients?.map((client: any) => (
								<Tr key={client.user_id}>
									<Td>{client.name}</Td>
									<Td textAlign="center">{client.userName}</Td>
									<Td textAlign="center">{client.reference_dhl}</Td>
									<Td textAlign="center">{client.reference_estafeta}</Td>
									<Td textAlign="center">{client.basic_auth_username}</Td>
									<Td textAlign="center">
										<Checkbox
											size="md"
											colorScheme="teal"
											isChecked={client.is_active}
											_readOnly='true'
										>
										</Checkbox>
									</Td>
									<Td textAlign="center">
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
												bg="teal"
												color="white"
												_hover={{ bg: 'gray.800' }}
												onClick={async () => {
													setIsAccordionOpen(true);
													setIsEditing(true);
													setEditingUserId(client.user_id);
													// Carga los datos del usuario desde la BD (opcional, si ya tienes todos los datos en client puedes usar directamente)
													const user = await getClientByUserId(client.user_id);
													setForm({
														name: user.name || '',
														email: user.email || '',
														role: user.role?.trim() || 'usuario',
														userName: user.userName || '',
														password: '',
														basic_auth_username: user.basic_auth_username || '',
														basic_auth_pass: '',
														reference_dhl: user.reference_dhl || '',
														reference_estafeta: user.reference_estafeta || ''
													});
												}}
												title="Editar usuario"
												aria-label="Editar usuario"
											>
												<EditIcon />
											</Button>
											<Button
												colorScheme="blue"
												size="sm"
												onClick={() => handleRegeneratePassword(client.user_id)}
												title="Regenerar y copiar contraseña del usuario API"
												aria-label="Regenerar y copiar contraseña del usuario API"
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
					<Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
						<Stack flexFlow={"row"} spacing={2} alignItems="center">
							<Button
								onClick={() => setCurrentPage(1)}
								isDisabled={currentPage === 1}>
								Inicio
							</Button>
							<Button
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								isDisabled={currentPage === 1}>
								Anterior
							</Button>
						</Stack>
						<Text>Página {currentPage} de {totalPages}</Text>
						<Stack flexFlow={"row"} spacing={2} alignItems="center">
							<Button
								onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
								isDisabled={currentPage === totalPages}>
								Siguiente
							</Button>
							<Button
								onClick={() => setCurrentPage(totalPages)}
								isDisabled={currentPage === totalPages}>
								Fin
							</Button>
						</Stack>
					</Box>
				</>
			)}
			{/* Modal de configuración de usuario */}
			<Modal isOpen={isOpen} onClose={onClose} onCloseComplete={fetchClients} size="xxl" >
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
									<br /><hr />
									<Box m={5}>
										<form
											onSubmit={async (e) => {
												e.preventDefault();
												const form = e.target as HTMLFormElement;
												const referenciaDHL = (form.DHL as HTMLInputElement).value;
												const referenciaEstafeta = (form.Estafeta as HTMLInputElement).value;
												try {
													console.log();
													await updateClient({
														user_id: selectedClient.user_id,
														reference_dhl: referenciaDHL,
														reference_estafeta: referenciaEstafeta,
													});
													toast({
														title: 'Referencias guardadas',
														status: 'success',
														duration: 3000,
														isClosable: true,
													});
												} catch (error: any) {
													toast({
														title: 'Error al guardar referencias',
														description: error?.message || '',
														status: 'error',
														duration: 4000,
														isClosable: true,
													});
												}
											}}
										>
											<Flex >
												<label><i>Referencia DHL:</i></label>
												<Input
													name="DHL"
													defaultValue={selectedClient.reference_dhl || ''}
													size="xs"
													minWidth={200}
													width="80px"
													display="inline-block"
													ml={2}
													mr={2}
													placeholder="Referencia DHL"
												/>
												<label><i>Referencia Estafeta:</i></label>
												<Input
													name="Estafeta"
													defaultValue={selectedClient.reference_estafeta || ''}
													size="xs"
													minWidth={200}
													width="80px"
													display="inline-block"
													ml={2}
													mr={2}
													placeholder="Referencia Estafeta"
												/>
												<Button type="submit" colorScheme="blue" size="sm" ml={2}>
													Guardar
												</Button>
											</Flex>
										</form>
									</Box>
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
						<Button onClick={() => { onClose(); fetchClients(); }}>Cerrar</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
}
