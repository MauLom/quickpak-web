'use client'
import { FC, useState } from "react"
import { AddIcon, MinusIcon } from "@chakra-ui/icons"
import { Box, Button, Card, CardBody, FormControl, FormLabel, Grid, GridItem, Input } from "@chakra-ui/react"

interface PackagesProps {
    packagesArr: Array<any>;
    setPackages: any;
    updatePackage: any;
    popPackage: any;
    addPackage: any;
}

const Packages: FC<PackagesProps> = (props) => {
  

    return (
        <Box>
            <Card>
                <CardBody>
                    {props?.packagesArr.map((each: any, idx: any) => (
                        <Grid templateColumns='repeat(6, 1fr)' gap={2} key={`packageId-${idx}`}>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Peso</FormLabel>
                                    <Input onChange={(e) => props?.updatePackage(e, idx, each)} name="weight" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Alto</FormLabel>
                                    <Input onChange={(e) => props?.updatePackage(e, idx, each)} name="height" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Ancho</FormLabel>
                                    <Input onChange={(e) => props?.updatePackage(e, idx, each)} name="width" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Largo</FormLabel>
                                    <Input onChange={(e) => props?.updatePackage(e, idx, each)} name="length" />
                                </FormControl>
                            </GridItem>

                            {idx === (props?.packagesArr.length - 1) &&
                                <GridItem colSpan={2} textAlign={"end"}>
                                    {props?.packagesArr.length > 1 && (
                                        <Button onClick={props?.popPackage}>
                                            <MinusIcon />
                                        </Button>
                                    )}
                                    <Button onClick={props?.addPackage}>
                                        <AddIcon />
                                    </Button>
                                </GridItem>}

                        </Grid>
                    ))}

                </CardBody>
            </Card>
        </Box>
    )
}
export default Packages