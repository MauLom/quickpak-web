import React from 'react';
import { AccordionPanel, Stack, Box, Divider } from "@chakra-ui/react";

const renderDays = (obj: any) => {
    // Join the values of the object into a string
    const renderedDays = Object.entries(obj).map(([day, value]) => (
        <span key={day}>{`${day}:${value}`}</span>
    ));

    return <Stack direction="column">{renderedDays}</Stack>;
};

function formatDate(dateString: any) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


function renderCostItem(label: string, cost: number) {
    console.log("Every cost:", cost)
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between">
                <Box>{label}</Box>
                <Box>{`$${cost.toFixed(2)}`}</Box>
            </Stack>
        </Box>
    );
}

export function renderDHLDetails(eachService: any) {
    const charges = [
        { label: 'Servicio', cost: eachService?.baseService },
        { label: 'Cargo por combustible', cost: eachService?.ff },
        { label: 'Cargo por exceso de dimensiones', cost: eachService?.yb },
        { label: 'Cargo por area remota', cost: eachService?.oo },
        { label: 'Cargo por exceso de peso', cost: eachService?.yy },
        { label: 'Cargo por multipieza', cost: eachService?.ye },
        { label: 'Seguro $', cost: eachService?.ii },
    ];

    return (
        <AccordionPanel>
            <Stack direction="row" gap={4}>
                <Box>
                    <Stack direction="column">
                        <Box>{`${eachService?.zone}`}</Box>
                        <Box>{`Peso calculado: ${eachService?.weight || 'error'}`}</Box>
                        <Box>{`Fecha de entrega: ${formatDate(eachService?.fecEntrega)}`}</Box>
                    </Stack>
                </Box>
                <Box>
                    {charges.map((item, idx) => (
                        item.cost !== 0 && item.cost !== undefined && renderCostItem(item.label, item.cost)
                    ))}
                    <Divider margin={1} />
                    <Box>
                        {renderCostItem("SubTotal", Number(eachService?.subTotal))}
                    </Box>
                    <Box>
                        {renderCostItem("I.V.A", Number(eachService?.IVA))}
                    </Box>
                </Box>
            </Stack>
        </AccordionPanel>
    );
}

export function renderEstafetaDetails(eachService: any) {
    return (
        <AccordionPanel>
            <Stack direction="row">
                <Box>
                    <Stack>
                        <Box>{`${eachService?.zone}`}</Box>
                        {eachService?.oc && <Box>{`Ocurre Forzoso: ${eachService?.oc}`}</Box>}
                        <Box>{`Peso: ${eachService?.details?.Peso || 'error'}`}</Box>
                        {/* Assuming renderDays is another function you have */}
                        {renderDays(eachService?.Dias)}
                    </Stack>
                </Box>
                <Box>
                    <Stack>
                        {eachService?.details?.CostoReexpedicion > 0 && <Box>{`Reexpedicion/AR: ${eachService?.details?.CostoReexpedicion}`}</Box>}
                        <Box>{`Seguro: $${eachService?.seguro}`}</Box>
                        <Box>{`I.V.A.: $${eachService?.details?.IVA || 'error'}`}</Box>
                    </Stack>
                </Box>
            </Stack>
        </AccordionPanel>
    );
}




