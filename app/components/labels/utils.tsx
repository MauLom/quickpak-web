// utils.ts
import { Box, Grid, GridItem, Heading, FormControl, FormLabel, Input, Button, Select, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Link } from '@chakra-ui/react';
import { AddressData } from '../../types/Address';
interface FormFieldProps {
    label: string;
    name: string;
}
export interface NotebookActionsProps {
    suffix: string;
}

export interface ParcelData {
    userId: string;
    labelID: string;
    parcel: string;
    numberOfPieces: number; // New field
    dimensions: {
        length: string;
        width: string;
        height: string;
    };
    description: string; // New field
    weight: number;
    createdAt: number;
}

export interface User {
    _id: string;
    email: string;
    password: string;
    string_reference: string;
    role: string;
    userName: string;
    provider_access: Array<{
        provider_id: string;
        services: string[];
    }>;
}

export interface Direction {
    nomb: string;
    comp: string;
    phone: string;
    email: string;
    street: string;
    col: string;
    ref: string;
}

export interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    addresses: AddressData[];
    onAddressSelect: ( address: AddressData) => void;
}

export function extractParcelData(arr: any[]): ParcelData[] {
    return arr.map(item => {
        const userId = item.userId;
        const labelID = item.response?.labelPetitionResult?.elements[0]?.wayBill ||
            item.response?.ShipmentResponse?.ShipmentIdentificationNumber;
        const parcel = item.data?.parcel || item.type;

        const numberOfPieces = item.request?.packages?.[0]?.NumberOfPieces || 1; // Example extraction

        let dimensions = {
            length: item.request?.packages?.[0]?.Dimensions?.Length || item.request?.largo || '',
            width: item.request?.packages?.[0]?.Dimensions?.Width || item.request?.ancho || '',
            height: item.request?.packages?.[0]?.Dimensions?.Height || item.request?.alto || '',
        };

        const description = item.request?.description || ''; // Example extraction

        let weight = item.request?.packages?.[0]?.Weight || item.request?.peso || 0;

        const createdAt = item.createdAt;

        return { userId, labelID, parcel, numberOfPieces, dimensions, description, weight, createdAt };
    });
}

export const FormField: React.FC<FormFieldProps> = ({ label, name }) => (
    <FormControl>
        <FormLabel>{label}</FormLabel>
        <Input name={name} />
    </FormControl>
);
