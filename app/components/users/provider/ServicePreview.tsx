import { Button, Stack, Box } from '@chakra-ui/react';
import React from 'react';


interface ServiceData {
  provider_id: string;
  services: string[];
}

interface ServicePreviewProps {
  servicesData: ServiceData[];
  onServiceDetailsClick: (service: string, provider_id:string) => void;
}

const ServicePreview: React.FC<ServicePreviewProps> = ({ servicesData, onServiceDetailsClick }) => {
  return  (
    <Box>
      <h2>Servicios habilitados</h2>
      <ul>
        {servicesData.map((data, index) => (
          <li key={index}>
            <h3>{data.provider_id}</h3>
            <ul>
              {data.services.map((service, serviceIndex) => (
                <li key={serviceIndex}>
                  <Stack direction="row" gap={3}>
                    <Box>{service}</Box>
                    <Button onClick={() => onServiceDetailsClick(service, data.provider_id)}>Editar Matriz</Button>
                  </Stack>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default ServicePreview;
