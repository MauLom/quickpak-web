import React, { useRef, useState, memo } from 'react';
import { Box, Button, Stack, Heading, Table, Thead, Tbody, Tr, Th, Td, Input, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useToast } from '@chakra-ui/react';
import { updateDHLMatrix } from '../../lib/requests';

const dhlColumns = ['', 'Zona 1', 'Zona 2', 'Zona 3', 'Zona 4', 'Zona 5', 'Zona 6', 'Zona 7', 'Zona 8'];
const defaultRows = [...Array.from({ length: 30 }, (_, i) => (i + 1).toString()), 'Kg Adicional'];

const TableCell: React.FC<{
    inputRef: React.RefObject<HTMLInputElement>;
    defaultValue: string;
    readOnly?: boolean;
    onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    borderColor?: string;
    boxShadow?: string;
    rowIdx: number;
    colIdx: number;
    tabla: string;
    invalidCells: { tabla: string, row: number, col: number }[];
}> = ({
    inputRef,
    defaultValue,
    readOnly,
    onPaste,
    placeholder,
    borderColor,
    boxShadow,
    rowIdx,
    colIdx,
    tabla,
    invalidCells
}) => {
    const [isInvalid, setIsInvalid] = React.useState(false);
    React.useEffect(() => {
        setIsInvalid(invalidCells.some(cell => cell.tabla === tabla && cell.row === rowIdx && cell.col === colIdx));
    }, [invalidCells, rowIdx, colIdx, tabla]);
    const validate = (e: React.FocusEvent<HTMLInputElement>) => {
        if (readOnly) return;
        const val = e.target.value;
        if (val === '' || /^-?\d+(\.\d+)?$/.test(val)) {
            setIsInvalid(false);
        } else {
            setIsInvalid(true);
        }
        //Some comment
    };
    return (
        <Input
            ref={inputRef}
            defaultValue={defaultValue}
            size="xs"
            readOnly={readOnly}
            bg={readOnly ? 'gray.100' : undefined}
            onPaste={onPaste}
            placeholder={placeholder}
            borderColor={isInvalid ? 'red.400' : borderColor}
            boxShadow={isInvalid ? '0 0 0 2px #FC8181' : boxShadow}
            onBlur={validate}
        />
    );
};

const TableRow: React.FC<{
    row: string[];
    rowIdx: number;
    columns: string[];
    inputRefs: React.RefObject<HTMLInputElement>[][];
    handlePaste: (e: React.ClipboardEvent<HTMLInputElement>, rowIdx: number) => void;
    tabla: string;
    invalidCells: { tabla: string, row: number, col: number }[];
}> = ({
    row,
    rowIdx,
    columns,
    inputRefs,
    handlePaste,
    tabla,
    invalidCells
}) => {
    return (
        <Tr>
            {row.map((cell, colIdx) => (
                <Td key={colIdx}>
                    <TableCell
                        inputRef={inputRefs[rowIdx][colIdx]}
                        defaultValue={cell}
                        readOnly={colIdx === 0}
                        onPaste={rowIdx === 0 && colIdx === 1 ? (e) => handlePaste(e, rowIdx) : undefined}
                        placeholder={columns[colIdx] + (rowIdx === 0 && colIdx === 1 ? ' (pega aquí)' : '')}
                        borderColor={rowIdx === 0 && colIdx === 1 ? 'teal.400' : undefined}
                        boxShadow={rowIdx === 0 && colIdx === 1 ? '0 0 0 2px #38B2AC' : undefined}
                        rowIdx={rowIdx}
                        colIdx={colIdx}
                        tabla={tabla}
                        invalidCells={invalidCells}
                    />
                </Td>
            ))}
        </Tr>
    );
};

export default function AltaMatrizDHL({ userId, onSave, initialMatrix }: { userId: string, onSave: (pricing_matrix: any) => void, initialMatrix?: any }) {
    const toast = useToast();
    const [separator, setSeparator] = useState<string>(", ");
    const [invalidCells, setInvalidCells] = useState<{ tabla: string, row: number, col: number }[]>([]);
    const [clientReference, setClientReference] = useState<string>("");
    const nRefs = useRef(
        defaultRows.map(() => dhlColumns.map(() => React.createRef<HTMLInputElement>()))
    );
    const gRefs = useRef(
        defaultRows.map(() => dhlColumns.map(() => React.createRef<HTMLInputElement>()))
    );

    // Precarga de datos si initialMatrix existe
    React.useEffect(() => {
        if (initialMatrix) {
            if (Array.isArray(initialMatrix.N)) {
                initialMatrix.N.forEach((row: any[], i: number) => {
                    row.forEach((cell: any, j: number) => {
                        if (nRefs.current[i] && nRefs.current[i][j] && nRefs.current[i][j].current) {
                            nRefs.current[i][j].current!.value = cell.value ?? '';
                        }
                    });
                });
            }
            if (Array.isArray(initialMatrix.G)) {
                initialMatrix.G.forEach((row: any[], i: number) => {
                    row.forEach((cell: any, j: number) => {
                        if (gRefs.current[i] && gRefs.current[i][j] && gRefs.current[i][j].current) {
                            gRefs.current[i][j].current!.value = cell.value ?? '';
                        }
                    });
                });
            }
            if (typeof initialMatrix.clientReference === 'string') {
                setClientReference(initialMatrix.clientReference);
            }
        }
    }, [initialMatrix]);

    const handlePaste = (
        e: React.ClipboardEvent<HTMLInputElement>,
        tabla: 'n' | 'g',
        rowIdx: number
    ) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text");
        const rowSep = /\r?\n/;
        const colSep = text.includes("\t") ? "\t" : separator;
        const rowsPaste = text.split(rowSep).filter(r => r.trim() !== "");
        const refs = tabla === 'n' ? nRefs.current : gRefs.current;
        for (let i = 0; i < rowsPaste.length && (rowIdx + i) < refs.length; i++) {
            const cols = rowsPaste[i].split(colSep);
            for (let j = 1; j < refs[rowIdx + i].length && j <= cols.length; j++) {
                let clean = cols[j - 1].replace(/\$/g, '').replace(/\s/g, '').replace(/,/g, '.');
                clean = clean.replace(/[^\d.\-]/g, '');
                // Si no es número válido, poner 0
                if (!/^(-?\d+)(\.\d+)?$/.test(clean)) clean = '0';
                const ref = refs[rowIdx + i][j];
                if (ref.current) ref.current.value = clean;
            }
        }
    };

    const handleSave = async () => {
        // Validar que todos los valores editables sean decimales
        const isDecimal = (val: string) => /^-?\d+(\.\d+)?$/.test(val);
        let invalids: { tabla: string, row: number, col: number }[] = [];
        // Validar matriz N
        nRefs.current.forEach((rowRefs, i) => {
            rowRefs.forEach((ref, j) => {
                if (j !== 0 && ref.current) {
                    const val = ref.current.value;
                    if (val !== '' && !isDecimal(val)) {
                        invalids.push({ tabla: 'N', row: i, col: j });
                    }
                }
            });
        });
        // Validar matriz G
        gRefs.current.forEach((rowRefs, i) => {
            rowRefs.forEach((ref, j) => {
                if (j !== 0 && ref.current) {
                    const val = ref.current.value;
                    if (val !== '' && !isDecimal(val)) {
                        invalids.push({ tabla: 'G', row: i, col: j });
                    }
                }
            });
        });
        setInvalidCells(invalids);
        if (invalids.length > 0) {
            toast({
                title: 'No se puede guardar',
                description: 'Hay celdas con valores no decimales en la matriz DHL.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
            return;
        }
        const matrizN = nRefs.current.map((rowRefs, i) =>
            rowRefs.map((ref, j) => ({
                value: ref.current ? ref.current.value : '',
                readOnly: j === 0
            }))
        );
        const matrizG = gRefs.current.map((rowRefs, i) =>
            rowRefs.map((ref, j) => ({
                value: ref.current ? ref.current.value : '',
                readOnly: j === 0
            }))
        );
        const pricing_matrix_dhl = {
            N: matrizN,
            G: matrizG
        };

        await onSave(pricing_matrix_dhl);
    };

    // Limpia todas las celdas editables de la matriz indicada
    const clearMatrix = (refs: React.RefObject<HTMLInputElement>[][]) => {
        refs.forEach((rowRefs, i) => {
            rowRefs.forEach((ref, j) => {
                if (j !== 0 && ref.current) ref.current.value = '';
            });
        });
    };

    return (
        <Box mt={4}>
            <Heading size="sm" mb={2}>Matriz de precios DHL</Heading>
            <Stack spacing={4}>
                <Box mb={2}>
                    <label style={{ fontWeight: 500 }}>Separador de columnas: </label>
                    <Input
                        value={separator}
                        onChange={e => setSeparator(e.target.value)}
                        size="xs"
                        width="80px"
                        display="inline-block"
                        ml={2}
                        mr={2}
                    />
                    <span style={{ fontSize: 12, color: '#888' }}>
                        (por defecto: coma, si pegas desde Excel se usará tabulación)
                    </span>
                </Box>
                <Accordion allowToggle defaultIndex={[]}> 
                    <AccordionItem>
                        <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>N</Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            <Button size="xs" colorScheme="red" mb={2} onClick={() => clearMatrix(nRefs.current)}>
                                Limpiar matriz
                            </Button>
                            <Table size="sm" variant="simple" bg="white" borderRadius={6} boxShadow="md">
                                <Thead>
                                    <Tr>
                                        {dhlColumns.map((col, idx) => (
                                            <Th key={idx}>{col}</Th>
                                        ))}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {defaultRows.map((row, rowIdx) => (
                                        <TableRow
                                            key={rowIdx}
                                            row={[row, ...Array(dhlColumns.length - 1).fill('')]
                                            }
                                            rowIdx={rowIdx}
                                            columns={dhlColumns}
                                            inputRefs={nRefs.current}
                                            handlePaste={(e) => handlePaste(e, 'n', rowIdx)}
                                            tabla="N"
                                            invalidCells={invalidCells}
                                        />
                                    ))}
                                </Tbody>
                            </Table>
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>G</Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            <Button size="xs" colorScheme="red" mb={2} onClick={() => clearMatrix(gRefs.current)}>
                                Limpiar matriz
                            </Button>
                            <Table size="sm" variant="simple" bg="white" borderRadius={6} boxShadow="md">
                                <Thead>
                                    <Tr>
                                        {dhlColumns.map((col, idx) => (
                                            <Th key={idx}>{col}</Th>
                                        ))}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {defaultRows.map((row, rowIdx) => (
                                        <TableRow
                                            key={rowIdx}
                                            row={[row, ...Array(dhlColumns.length - 1).fill('')]
                                            }
                                            rowIdx={rowIdx}
                                            columns={dhlColumns}
                                            inputRefs={gRefs.current}
                                            handlePaste={(e) => handlePaste(e, 'g', rowIdx)}
                                            tabla="G"
                                            invalidCells={invalidCells}
                                        />
                                    ))}
                                </Tbody>
                            </Table>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                <Button colorScheme="blue" onClick={handleSave}>
                    Guardar
                </Button>
            </Stack>
        </Box>
    );
}
