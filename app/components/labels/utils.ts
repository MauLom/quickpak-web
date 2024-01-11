// utils.ts

export interface ParcelData {
    userId: string;
    labelID: string;
    parcel: string;
    dimensions: string;
    weight: number;
    createdAt: number;
}

export interface User {
    _id: string;
    email: string;
    password: string;
    string_reference: string;
    role: string;
    userName: string;
    provider_access: Array<{
        provider_id: string;
        services: string[];
    }>;
}

export function extractParcelData(arr: any[]): ParcelData[] {
    return arr.map(item => {
        const userId = item.userId;
        const labelID = item.response?.labelPetitionResult?.elements[0]?.wayBill ||
            item.response?.ShipmentResponse?.ShipmentIdentificationNumber;
        const parcel = item.data?.parcel || item.type;

        let dimensions = "";
        let weight = 0;
        if (item.request?.packages?.[0]) {
            const pkg = item.request.packages[0];
            dimensions = `${pkg.Dimensions?.Height || ''}x${pkg.Dimensions?.Width || ''}x${pkg.Dimensions?.Length || ''}`;
            weight = pkg.Weight;
        } else {
            dimensions = `${item.request?.alto || ''}x${item.request?.ancho || ''}x${item.request?.largo || ''}`;
            weight = item.request?.peso;
        }

        const createdAt = item.createdAt;

        return { userId, labelID, parcel, dimensions, weight, createdAt };
    });
}
