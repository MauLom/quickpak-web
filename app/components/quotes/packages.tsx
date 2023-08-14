'use client'
import { useState } from "react"
import { AddIcon, MinusIcon } from "@chakra-ui/icons"
import { Box, Button, Card, CardBody, FormControl, FormLabel, Grid, GridItem, Input } from "@chakra-ui/react"

const Packages = () => {
    const [packagesArr, setPackagesArr] = useState([{ weight: 0, height: 0, width: 0, length: 0 }])

    function addPackage(){
        setPackagesArr([...packagesArr, { weight: 0, height: 0, width: 0, length: 0 }])
    }
    function popPackage(){
        let arrAsVar = JSON.parse(JSON.stringify(packagesArr))
        arrAsVar.pop()
        setPackagesArr(arrAsVar)
    }
    function updatePackage(e:any, idx:any, obj:any){
        let propToBeChanged: string = e?.target?.name
        let newArr = JSON.parse(JSON.stringify(packagesArr))
        obj[propToBeChanged] = Number.parseInt(e?.target?.value)
        newArr[idx] = obj
        setPackagesArr(newArr)
    }

    return (
        <Box>
            <Card>
                <CardBody>
                    {packagesArr.map((each, idx) => (
                        <Grid templateColumns='repeat(6, 1fr)' gap={2}>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Peso</FormLabel>
                                    <Input onChange={(e) => updatePackage(e, idx, each)} name="weight"/>
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Alto</FormLabel>
                                    <Input onChange={(e) => updatePackage(e, idx, each)} name="height" />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Ancho</FormLabel>
                                    <Input onChange={(e) => updatePackage(e, idx, each)} name="width"/>
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Largo</FormLabel>
                                    <Input onChange={(e) => updatePackage(e, idx, each)} name="length"/>
                                </FormControl>
                            </GridItem>

                            {idx === (packagesArr.length - 1) &&
                                <GridItem colSpan={2} textAlign={"end"}>
                                    {packagesArr.length > 1 && (
                                        <Button onClick={popPackage}>
                                            <MinusIcon />
                                        </Button>
                                    )}
                                    <Button onClick={addPackage}>
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