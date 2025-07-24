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
import { AddIcon, EditIcon, SettingsIcon } from '@chakra-ui/icons';

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
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <FfTaxesSection />
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
                  value={formData.tasaAerea === 0 ? '' : String(formData.tasaAerea)}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      tasaAerea: e.target.value
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
                  value={formData.tasaTerrestre === 0 ? '' : String(formData.tasaTerrestre)}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      tasaTerrestre: e.target.value
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

export default ConfigurationPanel;
