import React from 'react';
import { AccordionPanel, Stack, Box, Text, List, ListItem, Divider } from "@chakra-ui/react";

interface DayDetails {
    [key: string]: string;
}

interface ServiceDetails {
    DiasEntrega?: DayDetails;
    TarifaBase?: number;
    DescripcionServicio?: string;
    Peso?: number;
    CostoReexpedicion?: string;
    seguro?: string;
    Subtotal?: string;
    IVA?: string;
    CostoTotal?: string;
}

interface EachServiceType {
    parcelLogo?: {
        src: string;
        alt: string;
    };
    serviceType?: string;
    weight?: number;
    subTotal?: string;
    IVA?: string;
    Total?: string;
    details?: ServiceDetails;
    zone?: string;
    provider?: string;
    Dias?: DayDetails;
    seguro?: string;
}

interface RenderEstafetaDetailsProps {
    eachService: EachServiceType;
}


function formatDate(dateString: any) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


function renderCostItem(label: string, cost: number) {
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between">
                <Box>{label}</Box>
                <Box>{`$${cost?.toFixed(2)}`}</Box>
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


export const renderEstafetaDetails = (eachService: any) => {
    const renderDaysList = (days: DayDetails | undefined) => {
        if (!days) return <Text>No days available</Text>;

        return (
            <Stack direction="row">
                {Object.entries(days).map(([day, value]) => (
                    value && <Box key={day}>{day}</Box>
                ))}
            </Stack>
        );
    };

    return (
        <AccordionPanel>
            <Stack direction="row" spacing={4}>
                <Box flex="1">
                    <Stack spacing={2}>
                        <Text fontWeight="bold">Zone: {eachService.zone || 'N/A'}</Text>
                        <Text>Peso: {eachService.details?.Peso || 'error'}</Text>
                        <Box>
                            <Text fontWeight="bold">Dias de Entrega:</Text>
                            {renderDaysList(eachService.Dias)}
                        </Box>
                    </Stack>
                </Box>
                <Box flex="1">
                    <Stack spacing={2}>
                        {eachService.details?.CostoReexpedicion && eachService.details.CostoReexpedicion !== "0.00" &&
                            <Text>Reexpedicion/AR: {eachService.details.CostoReexpedicion}</Text>}
                        <Text>Servicio: ${eachService.details.TarifaBase}</Text>
                        {eachService.seguro !== "0.00" && <Text>Seguro: ${eachService.seguro}</Text>}
                        <Divider />
                        <Text>SubTotal: ${eachService.subTotal}</Text>
                        <Text>I.V.A.: ${eachService.details?.IVA || 'error'}</Text>
                    </Stack>
                </Box>
            </Stack>
        </AccordionPanel>
    );
}


