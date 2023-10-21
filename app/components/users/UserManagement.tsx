import { Button, Input, Box, Heading, Grid, GridItem, FormControl, FormLabel } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import ServiceEditComponent from './provider/ServiceEdit';
import ServicePreviewComponent from './provider/ServicePreview';
import { User } from '../../types/UsersRelated';
import Spreadsheet from 'react-spreadsheet';
import defaultSpreadsheetData from '../../utils/defaultSpreadsheet.json'
import { saveUser } from '../../lib/v2/saveUsers';
import { spreadSheetDataToUserPricing, userPricingToSpreadsheet } from '../../utils/collectionsConversions'
import { getUserPricing, saveUserPricing } from '../../lib/v2/userPricing';



function extractAvailableServices(data: { provider_id: string; services: string[] }[]): string[] {
  const services: string[] = [];

  for (const entry of data) {
    services.push(...entry.services);
  }

  return services;
}
interface UserManagementProps {
  selectedUser: User
}
const UserManagement: React.FC<UserManagementProps> = ({ selectedUser }) => {
  const [userData, setUserData] = useState<User>({
    _id: 0,
    userName: '',
    email: '',
    role: '',
    password: '',
    string_reference: '',
    provider_access: []
  });

  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [providers, setProviders] = useState([])
  const [showSheet, setShowSheet] = useState(false)
  const [serviceToEdit, setServiceToEdit] = useState("")
  const [providerToEdit, setProviderToEdit] = useState("")
  const [dataMatriz, setDataMatriz] = useState<any>([])
  const fetchProviders = async () => {
    try {
      const URL = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${URL}api/provider`);

      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }

      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setUserData(selectedUser)
      if (selectedUser?.provider_access?.length > 0) {
        const availableServices = extractAvailableServices(selectedUser.provider_access)
        setAvailableServices(availableServices)
      }
      fetchProviders()
    }
  }, []);

  const handleServiceEditToggle = () => {
    setIsEditingServices(!isEditingServices);
    !isEditingServices && setShowSheet(false)
  };

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleShowEditSheets = async (service: string, provider: string) => {
    setServiceToEdit(service)
    setProviderToEdit(provider)
    const matrizFromBD = await getUserPricing(userData._id, provider, service)
    console.log("response",)
    if (undefined !== matrizFromBD?.pricing) {
      const parsedData = userPricingToSpreadsheet(matrizFromBD.pricing)
      setDataMatriz(parsedData)
    }
    else { setDataMatriz(defaultSpreadsheetData.DHL) }
    setShowSheet(true)
  }

  const handleSaveUserChanges = (e: any) => {
    e.preventDefault()
    saveUser(userData)
  };

  const handleSaveUserPricing = () => {
    const parsed = spreadSheetDataToUserPricing(dataMatriz)
    const payload = {
      "user_id": userData._id,
      "provider_id": providerToEdit,
      "service": serviceToEdit,
      "pricing": parsed
    }
    saveUserPricing(payload)

  }



  return (
    <Box padding={4}>

      <Heading size="md">Editar la informacion de usuario</Heading>
      <form>
        <Grid templateColumns='repeat(3, 1fr)' gap={3}>
          <GridItem>
            <FormControl>
              <FormLabel>User Name:</FormLabel>
              <Input
                type="text"
                name="userName"
                value={userData.userName}
                onChange={handleUserDataChange}
              />
            </FormControl>

          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Email:</FormLabel>
              <Input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleUserDataChange}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Clave:</FormLabel>
              <Input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleUserDataChange}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Referencia:</FormLabel>
              <Input
                type="string"
                name="string_reference"
                value={userData.string_reference}
                onChange={handleUserDataChange}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Role:</FormLabel>
              <Input
                type="text"
                name="role"
                value={userData.role}
                onChange={handleUserDataChange}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <Button onClick={handleSaveUserChanges}>Guardar la informacion de usuario</Button>
          </GridItem>

        </Grid>

      </form>

      {/* Available Services Section */}
      <Box textAlign="initial" margin={4}>
        <Grid templateColumns='repeat(2, 1fr)' gap={2}>
          <GridItem>
            <Heading size="sm" margin={3}>Servicios de paqueteria</Heading >
            <Button onClick={handleServiceEditToggle}>
              {isEditingServices ? 'Ver matrices de servicios' : 'Ver editor servicios'}
            </Button>
            {isEditingServices ? (
              <ServiceEditComponent providersWithServices={providers} userServicesData={userData.provider_access} userData={userData} onUserDataChange={setUserData} />
            ) : (
              <ServicePreviewComponent servicesData={userData.provider_access} onServiceDetailsClick={(service, provider) => { handleShowEditSheets(service, provider) }} />
            )}
          </GridItem>
          <GridItem>
            {/* Sheets edition section */}
            {showSheet && (
              <Box maxW="100%" maxH="300px" overflow="auto">
                <Heading size="md">Matriz de datos {serviceToEdit}</Heading>
                <Spreadsheet data={dataMatriz} onChange={setDataMatriz} />
              </Box>
            )}
            {showSheet && <Button onClick={handleSaveUserPricing}>Guardar datos</Button>}
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserManagement;
