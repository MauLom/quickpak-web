export interface ProviderWithServices {
    _id: {
      $oid: string;
    };
    name: string;
    services: string[];
  }
  