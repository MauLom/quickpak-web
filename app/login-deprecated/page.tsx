'use client'
import { Button, Grid, GridItem } from '@chakra-ui/react'
import LoginForm from './form'

export default function Login() {
    return (
        <Grid
            templateRows='repeat(1, 1fr)'
            templateColumns='repeat(2, 1fr)'
        >
            <GridItem>
                Some background
            </GridItem>
            <GridItem>
                <LoginForm />
            </GridItem>
        </Grid>
    )
}