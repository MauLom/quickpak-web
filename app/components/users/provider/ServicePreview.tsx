import React from 'react';

interface ServicePreviewProps {
  availableServices: string[];
}

const ServicePreviewComponent: React.FC<ServicePreviewProps> = ({
  availableServices,
}) => {
  return (
    <div>
      <ul>
        {availableServices.map((service, index) => (
          <li key={index}>{service}</li>
        ))}
      </ul>
    </div>
  );
};

export default ServicePreviewComponent;
