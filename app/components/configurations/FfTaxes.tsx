'use client'

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  IconButton,
  HStack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, SettingsIcon, DeleteIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

interface FFTax {
  _id?: string;
  paqueteria: string;
  tasaAerea: number;
  tasaTerrestre: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Provider {
  _id: string;
  name: string;
  services: string[];
}

interface ProviderAuthSetting {
  _id?: string;
  provider: string;
  account: string;
  user: string;
  password: string;
  scopes: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const ConfigurationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box p={6} maxW="1400px" mx="auto">
      <Heading mb={6} color="blue.600" display="flex" alignItems="center" gap={3}>
        <SettingsIcon />
        Panel de Configuración
      </Heading>

      <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <Text>Cargos de Combustible</Text>
              <Badge colorScheme="blue" variant="subtle">Taxes</Badge>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <Text>Cuentas de Proveedores</Text>
              <Badge colorScheme="green" variant="subtle">Auth</Badge>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <FfTaxesSection />
          </TabPanel>
          <TabPanel px={0}>
            <ProvidersAuthSection />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};


// Componente específico para la sección de FFTaxes
const FfTaxesSection: React.FC = () => {
  const [ffTaxes, setFfTaxes] = useState<FFTax[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FFTax>({
    paqueteria: '',
    tasaAerea: 0,
    tasaTerrestre: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const toast = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch Providers from API
  const fetchProviders = async () => {
    try {
      const response = await fetch(`${API_URL}provider`);
      if (response.ok) {
        const data = await response.json();
        setProviders(data);
      } else {
        throw new Error('Error al cargar los proveedores');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los proveedores',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Fetch FF Taxes from API
  const fetchFFTaxes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}v3/config/ffTax`);
      if (response.ok) {
        const data = await response.json();
        setFfTaxes(data);
      } else {
        throw new Error('Error al cargar las tasas de combustible');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las tasas de combustible',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new FF Tax
  const createFFTax = async (dataToSend: FFTax) => {
    if (!dataToSend.paqueteria || dataToSend.tasaTerrestre <= 0) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos requeridos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}v3/config/ffTax`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        await fetchFFTaxes();
        resetForm();
        toast({
          title: 'Éxito',
          description: 'Tasa de combustible creada correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Error al crear la tasa');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la tasa de combustible',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update FF Tax
  const updateFFTax = async (dataToSend: FFTax) => {
    if (!editingId) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}v3/config/ffTax/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        await fetchFFTaxes();
        resetForm();
        toast({
          title: 'Éxito',
          description: 'Tasa de combustible actualizada correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Error al actualizar la tasa');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la tasa de combustible',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(!editingId && ffTaxes?.find(p => p?.paqueteria.toLowerCase() === formData.paqueteria.toLowerCase())) {
        toast({
          title: 'Waring',
          description: 'El proveedor ya tiene una tasa de combustible configurada',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
    }
    
    const dataToSend = {
      ...formData,
      tasaAerea: Number(formData.tasaAerea),
      tasaTerrestre: Number(formData.tasaTerrestre)
    };
    if (editingId) {
      updateFFTax(dataToSend);
    } else {
      createFFTax(dataToSend);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      paqueteria: '',
      tasaAerea: 0,
      tasaTerrestre: 0,
    });
    setEditingId(null);
  };

  // Edit FF Tax
  const editFFTax = (ffTax: FFTax) => {
    setFormData({
      paqueteria: ffTax.paqueteria.toLowerCase(),
      tasaAerea: ffTax.tasaAerea,
      tasaTerrestre: ffTax.tasaTerrestre,
    });
    setEditingId(ffTax._id || null);
  };

  // Get provider display name
  const getProviderDisplayName = (paqueteria: string) => {
    const provider = providers.find(p => p.name.toLowerCase() === paqueteria.toLowerCase());
    return provider ? provider.name : paqueteria.toUpperCase();
  };

  // Load data on component mount
  useEffect(() => {
    fetchProviders();
    fetchFFTaxes();
  }, []);

  return (
    <Box>
      <Text mb={6} color="gray.600">
        Configure las tasas de combustible aéreo y terrestre para cada proveedor de paquetería.
      </Text>

      {/* Form Card */}
      <Card mb={8}>
        <CardHeader>
          <Heading size="md">
            {editingId ? 'Editar Cargo de Combustible' : 'Nuevo Cargo de Combustible'}
          </Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Paquetería</FormLabel>
                <Select
                  value={formData.paqueteria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paqueteria: e.target.value,
                    })
                  }
                  placeholder="Seleccione una paquetería"
                >
                  {providers.map((provider) => (
                    <option key={provider._id} value={provider.name.toLowerCase()}>
                      {provider.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Tasa Aérea</FormLabel>
                <Input
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="Ej: 10.50"
                  // value={formData.tasaAerea === 0 ? '' : String(formData.tasaAerea)}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      tasaAerea: Number.parseFloat(e.target.value) || 0
                    });
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Tasa Terrestre</FormLabel>
                <Input
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="Ej: 20.31"
                  // value={formData.tasaTerrestre === 0 ? '' : String(formData.tasaTerrestre)}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      tasaTerrestre: Number.parseFloat(e.target.value) || 0
                    });
                  }}
                />
              </FormControl>

              <HStack spacing={4}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={loading}
                  leftIcon={editingId ? <EditIcon /> : <AddIcon />}
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </Button>
                <Button onClick={resetForm} variant="outline">
                    Cancelar
                </Button>
              </HStack>
            </Stack>
          </form>
        </CardBody>
      </Card>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <Heading size="md">Cargos de Combustible Configurados</Heading>
        </CardHeader>
        <CardBody>
          {ffTaxes.length === 0 ? (
            <Text textAlign="center" color="gray.500" py={8}>
              No hay cargos de combustible configurados
            </Text>
          ) : (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Paquetería</Th>
                    <Th>Tasa Aérea</Th>
                    <Th>Tasa Terrestre</Th>
                    <Th>Fecha de Creación</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {ffTaxes.map((ffTax) => (
                    <Tr key={ffTax._id}>
                      <Td>
                        <Text fontWeight="bold" color="blue.600">
                          {getProviderDisplayName(ffTax.paqueteria)}
                        </Text>
                      </Td>
                      <Td>{ffTax.tasaAerea} $</Td>
                      <Td>{ffTax.tasaTerrestre} $</Td>
                      <Td>
                        {ffTax.createdAt
                          ? new Date(ffTax.createdAt).toLocaleDateString('es-MX')
                          : 'N/A'}
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="Editar"
                            icon={<EditIcon />}
                            size="sm"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => editFFTax(ffTax)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

// Componente específico para la sección de Providers Auth Settings  
const ProvidersAuthSection: React.FC = () => {
  const [providerAuthSettings, setProviderAuthSettings] = useState<ProviderAuthSetting[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<ProviderAuthSetting>({
    provider: '',
    account: '',
    user: '',
    password: '',
    scopes: '',
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const toast = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch Providers from API
  const fetchProviders = async () => {
    try {
      const response = await fetch(`${API_URL}provider`);
      if (response.ok) {
        const data = await response.json();
        setProviders(data);
      } else {
        throw new Error('Error al cargar los proveedores');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los proveedores',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Fetch Provider Auth Settings from API
  const fetchProviderAuthSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}v3/providers-auth-settings`);
      if (response.ok) {
        const data = await response.json();
        setProviderAuthSettings(data.data || []);
      } else {
        throw new Error('Error al cargar las cuentas de proveedores');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las cuentas de proveedores',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new Provider Auth Setting
  const createProviderAuthSetting = async (dataToSend: ProviderAuthSetting) => {
    if (!dataToSend.provider || !dataToSend.user || !dataToSend.password) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos requeridos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}v3/providers-auth-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        await fetchProviderAuthSettings();
        resetForm();
        toast({
          title: 'Éxito',
          description: 'Cuenta de proveedor creada correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la cuenta');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo crear la cuenta de proveedor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update Provider Auth Setting
  const updateProviderAuthSetting = async (dataToSend: ProviderAuthSetting) => {
    if (!editingId) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}v3/providers-auth-settings/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        await fetchProviderAuthSettings();
        resetForm();
        toast({
          title: 'Éxito',
          description: 'Cuenta de proveedor actualizada correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la cuenta');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar la cuenta de proveedor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete Provider Auth Setting
  const deleteProviderAuthSetting = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta cuenta?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}v3/providers-auth-settings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProviderAuthSettings();
        toast({
          title: 'Éxito',
          description: 'Cuenta de proveedor eliminada correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Error al eliminar la cuenta');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la cuenta de proveedor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSend = {
      ...formData,
    };
    
    if (editingId) {
      updateProviderAuthSetting(dataToSend);
    } else {
      createProviderAuthSetting(dataToSend);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      provider: '',
      account: '',
      user: '',
      password: '',
      scopes: '',
      isActive: true,
    });
    setEditingId(null);
  };

  // Edit Provider Auth Setting
  const editProviderAuthSetting = (setting: ProviderAuthSetting) => {
    setFormData({
      provider: setting.provider,
      account: setting.account || '',
      user: setting.user,
      password: setting.password,
      scopes: setting.scopes,
      isActive: setting.isActive,
    });
    setEditingId(setting._id || null);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (id: string) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Get provider display name
  const getProviderDisplayName = (providerName: string) => {
    const provider = providers.find(p => p.name.toLowerCase() === providerName.toLowerCase());
    return provider ? provider.name : providerName.toUpperCase();
  };

  // Load data on component mount
  useEffect(() => {
    fetchProviders();
    fetchProviderAuthSettings();
  }, []);

  // Group settings by provider
  const groupedSettings = providerAuthSettings.reduce((acc, setting) => {
    if (!acc[setting.provider]) {
      acc[setting.provider] = [];
    }
    acc[setting.provider].push(setting);
    return acc;
  }, {} as Record<string, ProviderAuthSetting[]>);

  return (
    <Box>
      <Text mb={6} color="gray.600">
        Configure las cuentas de autenticación para cada proveedor de paquetería. Puede agregar múltiples cuentas por proveedor.
      </Text>

      {/* Form Card */}
      <Card mb={8}>
        <CardHeader>
          <Heading size="md">
            {editingId ? 'Editar Cuenta de Proveedor' : 'Nueva Cuenta de Proveedor'}
          </Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Primera fila: Proveedor y Cuenta */}
              <HStack spacing={4} align="end">
                <FormControl isRequired flex="1">
                  <FormLabel>Proveedor</FormLabel>
                  <Select
                    value={formData.provider}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        provider: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="Seleccione un proveedor"
                  >
                    {providers.map((provider) => (
                      <option key={provider._id} value={provider.name.toUpperCase()}>
                        {provider.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl flex="1">
                  <FormLabel>Cuenta</FormLabel>
                  <Input
                    type="text"
                    placeholder="Número de cuenta (ej: 980966404)"
                    value={formData.account}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        account: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </HStack>

              {/* Segunda fila: Usuario, Contraseña y Scopes */}
              <HStack spacing={4} align="end">
                <FormControl isRequired flex="1">
                  <FormLabel>Usuario</FormLabel>
                  <Input
                    type="text"
                    placeholder="Usuario API"
                    value={formData.user}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        user: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl isRequired flex="1">
                  <FormLabel>Contraseña</FormLabel>
                  <Input
                    type="password"
                    placeholder="Contraseña API"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl flex="1">
                  <FormLabel>Scopes</FormLabel>
                  <Input
                    type="text"
                    placeholder="shipping,tracking,labels"
                    value={formData.scopes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scopes: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </HStack>

              {/* Tercera fila: Estado */}
              <HStack spacing={4} align="end">
                <FormControl maxW="200px">
                  <FormLabel>Estado</FormLabel>
                  <Select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.value === 'true',
                      })
                    }
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </Select>
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <Button
                  type="submit"
                  colorScheme="green"
                  isLoading={loading}
                  leftIcon={editingId ? <EditIcon /> : <AddIcon />}
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </Button>
                <Button onClick={resetForm} variant="outline">
                  Cancelar
                </Button>
              </HStack>
            </Stack>
          </form>
        </CardBody>
      </Card>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <Heading size="md">Cuentas de Proveedores Configuradas</Heading>
        </CardHeader>
        <CardBody>
          {Object.keys(groupedSettings).length === 0 ? (
            <Text textAlign="center" color="gray.500" py={8}>
              No hay cuentas de proveedores configuradas
            </Text>
          ) : (
            <VStack spacing={6} align="stretch">
              {Object.entries(groupedSettings).map(([providerName, settings]) => (
                <Box key={providerName}>
                  <Heading size="sm" mb={4} color="green.600" display="flex" alignItems="center" gap={2}>
                    {getProviderDisplayName(providerName)}
                    <Badge colorScheme="green" variant="subtle">
                      {settings.length} cuenta{settings.length !== 1 ? 's' : ''}
                    </Badge>
                  </Heading>
                  
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Información de la Cuenta</Th>
                          <Th>Estado</Th>
                          <Th>Fecha de Creación</Th>
                          <Th>Acciones</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {settings.map((setting) => (
                          <Tr key={setting._id}>
                            <Td>
                              <VStack align="start" spacing={3} py={2}>                              
                                {/* Información de la cuenta con indentación */}
                                <VStack align="start" spacing={1} pl={4}>
                                  <Text fontSize="sm" color="blue.600" fontWeight="medium">
                                    Cuenta: <Text as="span" fontWeight="normal" color="gray.700">{setting.account || 'N/A'}</Text>
                                  </Text>
                                  <Text fontSize="sm" color="blue.600" fontWeight="medium">
                                    Usuario: <Text as="span" fontWeight="normal" color="gray.700">{setting.user}</Text>
                                  </Text>
                                  <HStack spacing={2}>
                                    <Text fontSize="sm" color="blue.600" fontWeight="medium">
                                      Password: 
                                    </Text>
                                    <Text fontFamily="mono" color="gray.600" fontSize="sm">
                                      {showPassword[setting._id || ''] 
                                        ? setting.password 
                                        : '••••••••••••••'
                                      }
                                    </Text>
                                    <IconButton
                                      aria-label="Toggle password visibility"
                                      icon={showPassword[setting._id || ''] ? <ViewOffIcon /> : <ViewIcon />}
                                      size="xs"
                                      variant="ghost"
                                      onClick={() => togglePasswordVisibility(setting._id || '')}
                                    />
                                  </HStack>
                                  <Text fontSize="sm" color="blue.600" fontWeight="medium">
                                    Scopes: <Text as="span" fontWeight="normal" color="gray.700">{setting.scopes || 'N/A'}</Text>
                                  </Text>
                                </VStack>
                              </VStack>
                            </Td>
                            <Td>
                              <Badge colorScheme={setting.isActive ? 'green' : 'red'}>
                                {setting.isActive ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </Td>
                            <Td>
                              <Text fontSize="sm">
                                {setting.createdAt
                                  ? new Date(setting.createdAt).toLocaleDateString('es-MX')
                                  : 'N/A'}
                              </Text>
                            </Td>
                            <Td>
                              <HStack spacing={2}>
                                <IconButton
                                  aria-label="Editar"
                                  icon={<EditIcon />}
                                  size="sm"
                                  colorScheme="blue"
                                  variant="outline"
                                  onClick={() => editProviderAuthSetting(setting)}
                                />
                                <IconButton
                                  aria-label="Eliminar"
                                  icon={<DeleteIcon />}
                                  size="sm"
                                  colorScheme="red"
                                  variant="outline"
                                  onClick={() => deleteProviderAuthSetting(setting._id || '')}
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default ConfigurationPanel;
