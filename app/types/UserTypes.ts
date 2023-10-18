// UserTypes.ts

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    provider_access:Array<{provider_id:string, services:string[]}>
  }
  
  export interface UserEditFormProps {
    user: User;
    onSave: (editedUser: User) => void;
  }
  