'use client'
import { Box, GridItem, Grid, Button } from '@chakra-ui/react';
import * as React from 'react'
import { Spreadsheet } from "react-spreadsheet";
function ConvertPage() {
    const [dataSpreadsheet, setDataSpreadsheet] = React.useState<any>([])
    const defaultDatosTabla: any = [
        [{ value: "", readOnly: true }, { value: "Zona 1", readOnly: true }, { value: "Zona 2", readOnly: true }, { value: "Zona 3", readOnly: true }, { value: "Zona 4", readOnly: true }, { value: "Zona 5", readOnly: true }, { value: "Zona 6", readOnly: true }, { value: "Zona 7", readOnly: true }, { value: "Zona 8", readOnly: true }, { value: "", readOnly: true }],
        [{ value: "1", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "2", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "3", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "4", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "5", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "6", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "7", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "8", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "9", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "10", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "11", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "12", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "13", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "14", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "15", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "16", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "17", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "18", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "19", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "20", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "21", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "22", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "23", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "24", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "25", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "26", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "27", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "28", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "29", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "30", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],
        [{ value: "KGadicional", readOnly: true }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }, { value: "", }],

    ]
    function convertToJson(data: any) {
        let onString = JSON.stringify(data);
        onString = onString.replaceAll('null', '{"value":""}');
        onString = onString.replaceAll('$', '');
        onString = onString.replaceAll('.', ',');
    
        navigator.clipboard.writeText(onString).then(() => {
            console.log('JSON string copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy JSON string to clipboard: ', err);
        });
    
        console.log(onString);
    }
    

    React.useEffect(() => {
        setDataSpreadsheet(defaultDatosTabla)
    }, [])
    return (
            <Grid templateColumns='repeat(2, 1fr)' gap={2}>
                <GridItem>
                    <Spreadsheet data={dataSpreadsheet} onChange={setDataSpreadsheet}/>
                </GridItem>
                <GridItem>
                    <Button onClick={()=>{convertToJson(dataSpreadsheet)}}>
                        Convertir a JSON
                    </Button>
                </GridItem>
            </Grid>
            
        )

}

export default ConvertPage;