import React, { useState } from 'react';
import { ProviderWithServices } from './ProviderWithServicesType'; // Import the interface

interface ServiceEditComponentProps {
  providersWithServices: ProviderWithServices[] | undefined;
}

const ServiceEditComponent: React.FC<ServiceEditComponentProps> = ({ providersWithServices }) => {
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
            ?.services.map((service:any) => (
              <div key={service}>
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
      <div>
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
      </div>
    </div>
  );
};

export default ServiceEditComponent;
