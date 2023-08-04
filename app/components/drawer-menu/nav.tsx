'use client'
import * as React from "react"
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,

    Button,
    ButtonGroup,
    useDisclosure,
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { FC, ReactNode } from 'react';


interface NavigationProps {
    menuOptions: Array<any>;
    changeContent: any;
}
const DrawerNavigation: FC<NavigationProps> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>

            <Button colorScheme='teal' onClick={onOpen}>
                <HamburgerIcon />
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <ButtonGroup flexDirection={"column"} gap={3}>
                            {props?.menuOptions?.map((eachOption) => (
                                <Button onClick={() => { props?.changeContent(eachOption?.component) }}>{eachOption?.label}</Button>
                            ))}
                        </ButtonGroup>

                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default DrawerNavigation
