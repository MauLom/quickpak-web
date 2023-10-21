export interface UserServicesData {
    provider_id: string; // Provider ID
    services: string[]; // Array of service names
}
export interface User {
    _id: number;
    userName: string;
    email: string;
    role: string;
    password:string;
    string_reference:string;
    provider_access: Array<{ provider_id: string, services: string[] }>
}
export interface UserEditFormProps {
    user: User;
    onSave: (editedUser: User) => void;
}
export interface ProviderWithServices {
    _id: {
      $oid: string;
    };
    name: string;
    services: string[];
  }
  