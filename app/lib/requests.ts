const URL = "https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2/api/"
//const URL = "http://localhost:8080/"
export async function getUsers() {
    const res = await fetch(`${URL}users`)
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    return res.json()
}

export async function getQuotes(quotesData: any) {
    const bodyUnParsed: any = quotesData
    let packagesArrForDHL: any = []
    let dataEstafeta: any = undefined
    if (bodyUnParsed?.package.length <= 1) {
        let bodyEstafeta = {
            "alto": bodyUnParsed?.package[0]?.height,
            "ancho": bodyUnParsed?.package[0]?.width,
            "esPaquete": true,
            "largo": bodyUnParsed?.package[0]?.length,
            "peso": bodyUnParsed?.package[0]?.weight,
            "originZip": bodyUnParsed?.data?.originZip,
            "destinyZip": bodyUnParsed?.data?.destinyZip,
            "userId": bodyUnParsed?.userId
        }

        const res = await fetch(`${URL}getRates/estafeta`, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyEstafeta),
        })
        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }
        dataEstafeta = res.json()
    }

    bodyUnParsed?.package.forEach((eachPackage: any, idx: any) => {
        let dhlPackageObj = {
            "@number": (idx + 1),
            "Weight": { "Value": eachPackage?.weight },
            "Dimensions": { "Length": eachPackage?.length, "Width": eachPackage?.width, "Height": eachPackage?.height }
        }
        packagesArrForDHL.push(dhlPackageObj)
    })
    let bodyDHL = {
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
    }
    let dataDHL: any = undefined
    const resDHL = await fetch(`${URL}getRates`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyDHL),
    })
    if (!resDHL.ok) {
        throw new Error('Failed to fetch data from DHL')
    }
    dataDHL = resDHL.json()
    let result: any = { data: "", dataDHL: "" }
    dataEstafeta !== undefined && await dataEstafeta.then((data: any) => {
        result.data = data
    })
    dataDHL !== undefined && await dataDHL.then((data: any) => {
        result.dataDHL = data
    })

    return result

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
    let packages:any = []
    /// Example obj quote : { "@number": 1, "Weight": "2", "Dimensions": { "Length": "10", "Width": "10", "Height": "10" } }
    data?.quotes?.package.forEach((each:any,idx:number) =>{
        packages.push({ "@number": idx+1, "Weight": each.weight, "Dimensions": { "Length": each.length, "Width": each.width, "Height": each.height } })
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

    const res = await fetch(`${URL}generateLabel`, {
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