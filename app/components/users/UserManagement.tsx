import { Button, Input } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import ServiceEditComponent from './provider/ServiceEdit';
import ServicePreviewComponent from './provider/ServicePreview';
import { User } from '../../types/UserTypes';
import { ProviderWithServices } from '../../types/ProviderWithServicesType';

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
    id: 0,
    name: '',
    email: '',
    role: '',
    provider_access: []
    // Initialize other user data fields
  });

  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [providers, setProviders] = useState([])

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
      const availableServices = extractAvailableServices(selectedUser.provider_access)
      setAvailableServices(availableServices)
      fetchProviders()
    }
  }, []); 

  const handleServiceEditToggle = () => {
    setIsEditingServices(!isEditingServices);
  };

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleServiceChange = (service: string) => {
    // Handle changes to available services
  };

  const handleSaveUserChanges = (e: any) => {
    e.preventDefault()
    // Send user data changes to your server
    // Example API call: updateUser(userData)
  };

  return (
    <div>
      <h2>User Management</h2>

      <h3>Edit User Data</h3>
      <form>
        <div>
          <label>User Name:</label>
          <Input
            type="text"
            name="userName"
            value={userData.name}
            onChange={handleUserDataChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <Input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleUserDataChange}
          />
        </div>
        <div>
          <label>Role:</label>
          <Input
            type="text"
            name="role"
            value={userData.role}
            onChange={handleUserDataChange}
          />
        </div>
        <div>
          <Button onClick={handleSaveUserChanges}>Save User Data</Button>
        </div>
      </form>

      {/* Available Services Section */}
      <h3>Available Services</h3>
      <Button onClick={handleServiceEditToggle}>
        {isEditingServices ? 'Done Editing' : 'Edit Services'}
      </Button>
      {isEditingServices ? (
        <ServiceEditComponent providersWithServices={providers} />
      ) : (
        <ServicePreviewComponent availableServices={availableServices} />
      )}
    </div>
  );
};

export default UserManagement;
