const URL = process.env.NEXT_PUBLIC_API_URL
//const URL = "http://localhost:8080/"
import { AddressData } from "../types/Address";

export async function getUsers() {
    try {
        const res = await fetch(`${URL}users`);
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        throw new Error(`Error occurred while fetching data: ${error.message}`);
    }
}

export async function getUser(id: string) {
    try {
        const res = await fetch(`${URL}users/${id}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        return await res.json();
    } catch (error: any) {
        throw new Error(`Error occurred while fetching data: ${error.message}`);
    }
}

export async function getQuotes(quotesData: any): Promise<{ data: any; dataDHL: any }> {
    try {
        const bodyUnParsed: any = quotesData;

        const fetchEstafeta = async () => {
            if (bodyUnParsed?.package?.length !== 1) return;

            const bodyEstafeta = {
                "alto": bodyUnParsed?.package[0]?.height,
                "ancho": bodyUnParsed?.package[0]?.width,
                "esPaquete": true,
                "largo": bodyUnParsed?.package[0]?.length,
                "peso": bodyUnParsed?.package[0]?.weight,
                "originZip": bodyUnParsed?.data?.originZip,
                "destinyZip": bodyUnParsed?.data?.destinyZip,
                "userId": bodyUnParsed?.userId,
                "seguro": bodyUnParsed?.data?.insurance
            };

            const res = await fetch(`${URL}rates/estafeta`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyEstafeta),
            });

            if (!res.ok) {
                /// TODO Handle possible errors 
                return {};
            }

            return res.json();
        };

        const fetchDHL = async () => {
            const packagesArrForDHL = bodyUnParsed?.package.map((eachPackage: any, idx: any) => ({
                "@number": (idx + 1),
                "Weight": { "Value": eachPackage?.weight },
                "Dimensions": { "Length": eachPackage?.length, "Width": eachPackage?.width, "Height": eachPackage?.height }
            }));

            const bodyDHL = {
                "timestamp": bodyUnParsed?.data?.date + "+GMT+0500",
                "shipperCity": bodyUnParsed?.data?.originCity,
                "shipperCountryCode": "MX",
                "shipperZip": bodyUnParsed?.data?.originZip,
                "recipientCity": bodyUnParsed?.data?.destinyCity,
                "recipientCountryCode": "MX",
                "recipientZip": bodyUnParsed?.data?.destinyZip,
                "packages": packagesArrForDHL,
                "insurance": bodyUnParsed?.data?.insurance,
                "userId": bodyUnParsed?.userId
            };

            const resDHL = await fetch(`${URL}rates/DHL`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyDHL),
            });

            if (!resDHL.ok) {
                throw new Error('Failed to fetch data from DHL');
            }

            return resDHL.json();
        };

        const [dataEstafeta, dataDHL] = await Promise.all([fetchEstafeta(), fetchDHL()]);

        return { data: dataEstafeta, dataDHL };
    } catch (error) {
        throw new Error(`Error occurred during processing: ${(error as Error).message}`);
    }
}

export async function getLabels(originLabels: any) {

    try {
        const resLabels = await fetch(`${URL}generateLabel?origin=${originLabels}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        return resLabels.json()
    }
    catch (error) {
        throw new Error(`Error occurred during processing: ${(error as Error).message}`);
    }
}

export async function deleteUser(userId: any) {
    const res = await fetch(`${URL}users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return res.json()
}

export async function generateEstafetaLabel(data: any) {
    let bodyEstafeta = {
        "alto": data?.quotes.package[0]?.height,
        "ancho": data?.quotes.package[0]?.length,
        "esPaquete": true,
        "largo": data?.quotes.package[0]?.width,
        "peso": data?.quotes.package[0]?.weight,
        "userId": data?.quotes.userId,
        "seguro": "0",
        "tipoServicioId": 70,
        "descripcionPaquete": data?.descPckg || "descripcion de paquete",
        "dataOrigen": {
            "direccion": {
                "zip": data?.quotes.data.originZip,
                "estado": data?.quotes.data.originCity,
                "ciudad": data?.quotes.data.originZip,
                "area": data.colR,
                "calle1": data.streetR,
                "calle2": "",
                "numInt": "",
                "numExt": "00",
                "entreCalles": "",
                "referencia": data.refR
            },
            "contacto": {
                "razonSocial": data.compR,
                "nombreCortoDomicilio": data.compR,
                "nombreContacto": data.nombR,
                "telefono": data.phoneR,
                "celular": data.phoneR,
                "email1": data.mailR,
                "email2": data.mailR,
                "RFC": "AOPB010102ROA"
            }
        },
        "dataDestino": {
            "direccion": {
                "zip": data?.quotes.data.destinyZip,
                "estado": data?.quotes.data.destinyCity,
                "ciudad": data?.quotes.data.destinyZip,
                "area": data.colD,
                "calle1": data.streetD,
                "calle2": "",
                "numInt": "",
                "numExt": "00",
                "entreCalles": "",
                "referencia": data.refD
            },
            "contacto": {
                "razonSocial": data.compD,
                "nombreCortoDomicilio": data.compD,
                "nombreContacto": data.nombD,
                "telefono": data.phoneD,
                "celular": data.phoneD,
                "email1": data.mailD,
                "email2": data.mailD,
                "RFC": "AOPB010102ROA"
            }
        }
    }
    const res = await fetch(`${URL}generateLabel/estafeta`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyEstafeta),
    })
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    return res
}

export async function generateDHLLabel(data: any) {
    let packages: any = []
    /// Example obj quote : { "@number": 1, "Weight": "2", "Dimensions": { "Length": "10", "Width": "10", "Height": "10" } }
    data?.quotes?.package.forEach((each: any, idx: number) => {
        packages.push({ "@number": idx + 1, "Weight": each.weight, "Dimensions": { "Length": each.length, "Width": each.width, "Height": each.height } })
    })
    let formattedDate = data?.quotes?.data.date.split("T", 1)
    const payload = {
        "service": "G",
        "date": formattedDate,
        "desc": data?.descPckg || "descripcion de paquete",
        "userId": data?.quotes.userId,

        "oName": data.nombR,
        "oCompany": data.compR,
        "oPhone": data.phoneR,
        "oEmail": data.mailR,
        "oStreets": data.streetR,
        "oCity": data?.quotes.data.originCity,
        "oZip": data?.quotes.data.originZip,

        "dName": data.nombD,
        "dCompany": data.compD,
        "dPhone": data.phoneD,
        "dEmail": data.mailD,
        "dStreets": data.streetD,
        "dCity": data?.quotes.data.destinyCity,
        "dZip": data?.quotes.data.destinyZip,
        "packages": packages
    }

    const res = await fetch(`${URL}generateLabel/DHL`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    return res
}

export async function saveAddressToNotebook(userId: string, addressData: AddressData) {
    try {
        const res = await fetch(`${URL}directionsNotebook/saveAddress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, addressData })
        });

        if (!res.ok) {
            throw new Error(`Failed to save address: ${res.status} ${res.statusText}`);
        }

        return await res.json();
    } catch (error: any) {
        throw new Error(`Error occurred while saving address: ${error.message}`);
    }
}

export async function getNotebookByUserId(userId: string) {
    try {
        const res = await fetch(`${URL}directionsNotebook/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch notebook: ${res.status} ${res.statusText}`);
        }

        return await res.json();
    } catch (error: any) {
        throw new Error(`Error occurred while fetching notebook: ${error.message}`);
    }
}

export async function updateClient({ user_id, name, email, role, userName, password, basic_auth_username, basic_auth_pass, is_active, pricing_matrix, reference_dhl, reference_estafeta }: 
    { user_id: string, name?: string, email?:string, role:string, userName:string, password:string, basic_auth_username?: string, basic_auth_pass?: string, is_active?: boolean, pricing_matrix?: any, reference_dhl?: string, reference_estafeta?: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}userPricing`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, name,email, role, userName, password, basic_auth_username, basic_auth_pass, is_active, pricing_matrix, reference_dhl, reference_estafeta }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al actualizar cliente');
    }
    return res.json();
}

export async function createClient({ name,email, role, userName, password, basic_auth_username, basic_auth_pass, reference_dhl, reference_estafeta }: 
    { name: string, email?:string, role:string, userName:string, password:string, basic_auth_username: string, basic_auth_pass?: string, reference_dhl?: string, reference_estafeta?: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}userPricing`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, role, userName, password, basic_auth_username, basic_auth_pass, reference_dhl, reference_estafeta }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al crear cliente');
    }
    return res.json();
}

export async function getClients({ page = 1, limit = 10, search = "" }: { page?: number; limit?: number; search?: string }) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}userPricing/all?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) throw new Error('Error al obtener clientes');
    return res.json();
}

export async function deleteClient(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}userPricing?user_id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) throw new Error('Error al eliminar cliente');
    return res.json();
}

export async function getClientByUserId(user_id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}userPricing?user_id=${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al obtener cliente');
    }
    return res.json();
}

export async function updateDHLMatrix(user_id: string, pricing_matrix_dhl: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}userPricing/dhl`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, pricing_matrix_dhl }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al actualizar matriz DHL');
    }
    return res.json();
}

export async function updateEstafetaMatrix(user_id: string, pricing_matrix_estafeta: any, ) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}userPricing/estafeta`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, pricing_matrix_estafeta }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al actualizar matriz Estafeta');
    }
    return res.json();
}