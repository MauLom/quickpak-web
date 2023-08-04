'use client'
import { FC, ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
    children?: ReactNode;
}

const Providers: FC<ProvidersProps> = (props) => {
    return (
        <SessionProvider>
            <ChakraProvider>
                {props.children}
            </ChakraProvider>
        </SessionProvider>
    )

}

export default Providers;