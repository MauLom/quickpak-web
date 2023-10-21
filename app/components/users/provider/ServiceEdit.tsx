import React, { useState, useEffect } from 'react';
import { ProviderWithServices, User, UserServicesData } from '../../../types/UsersRelated';
import { Button } from '@chakra-ui/react';
import { saveUser } from '../../../lib/v2/saveUsers';

interface ServiceEditComponentProps {
  providersWithServices: ProviderWithServices[] | undefined;
  userServicesData: UserServicesData[] | undefined;
  userData: User; // Pass userData as a prop
  onUserDataChange: (newUserData: User) => void; // Callback function to update userData
  
}

const ServiceEditComponent: React.FC<ServiceEditComponentProps> = ({
  providersWithServices,
  userServicesData,
  userData,
  onUserDataChange,
  
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvider(event.target.value);
    setSelectedServices([]); // Reset selected services when the provider changes
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const service = event.target.name;
    if (event.target.checked) {
      setSelectedServices((prevServices) => [...prevServices, service]);
    } else {
      setSelectedServices((prevServices) => prevServices.filter((s) => s !== service));
    }
  };

  const handleSave = async () => {
    // Create a copy of the user data
    const updatedUserData = { ...userData };
  
     // Ensure that provider_access is an array in case it's undefined or null
     if (!Array.isArray(updatedUserData.provider_access)) {
      updatedUserData.provider_access = [];
    }

    // Find the index of the user data with the same provider_id
    const userIndex = updatedUserData.provider_access.findIndex(
      (access: any) => access.provider_id === selectedProvider
    );
  
    // Create or update the access object
    const access = {
      provider_id: selectedProvider,
      services: selectedServices,
    };
  
    // If the user data with the same provider_id exists, update it; otherwise, add it
    if (userIndex !== -1) {
      updatedUserData.provider_access[userIndex] = access;
    } else {
      updatedUserData.provider_access.push(access);
    }
  
    // Update the user data in the component state
    onUserDataChange(updatedUserData);
  
    // Save the updated user data to the backend
    saveUser(updatedUserData);
  };
  
  useEffect(() => {
    if (userServicesData) {
      // Check user services and pre-select checkboxes accordingly
      const userAvailableServices = userServicesData?.find((data: any) => data.provider_id === selectedProvider);

      if (userAvailableServices) {
        setSelectedServices(userAvailableServices.services);
      }
    }
  }, [selectedProvider, userServicesData]);

  return (
    <div>
      <h2>Edit Services</h2>
      <label>Select a provider:</label>
      <select value={selectedProvider} onChange={handleProviderChange}>
        <option value="">Select a provider</option>
        {providersWithServices?.map((provider) => (
          <option key={provider._id.$oid} value={provider.name}>
            {provider.name}
          </option>
        ))}
      </select>
      {selectedProvider && providersWithServices && (
        <div>
          <h3>Available Services for {selectedProvider}:</h3>
          {providersWithServices
            .find((provider) => provider.name === selectedProvider)
            ?.services.map((service: any, index: number) => (
              <div key={`${service}-${index}`}>
                <label>
                  <input
                    type="checkbox"
                    name={service}
                    checked={selectedServices.includes(service)}
                    onChange={handleServiceChange}
                  />
                  {service}
                </label>
              </div>
            ))}
        </div>
      )}

      {/* Previsualizador de selecciones */}
      {/* <div>
        <h3>Selected Services:</h3>
        {selectedServices.length === 0 ? (
          <p>No services selected.</p>
        ) : (
          <ul>
            {selectedServices.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        )}
      </div> */}
      <Button colorScheme='teal' onClick={handleSave}>
        Guardar cambios
      </Button>
    </div>
  );
};

export default ServiceEditComponent;
