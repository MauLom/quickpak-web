import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    List,
    ListItem,
    Button,
    Stack
} from '@chakra-ui/react';
import { AddressModalProps } from './utils';
const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, addresses, onAddressSelect }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Choose an Address</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <List spacing={3}>
                        {addresses.map((address, index) => (
                            <ListItem key={index} cursor="pointer" onClick={() => onAddressSelect(address)}>
                                {/* Display address details here */}
                                {address.nomb} - {address.street}
                            </ListItem>
                        ))}
                    </List>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AddressModal;
