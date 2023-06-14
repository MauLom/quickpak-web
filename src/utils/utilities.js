import { getLabels } from "../services/labels"
import { getUsers } from "../services/users"
export const getDataTableLabels = (page, liwmit) => {
    // [IdCliente, Paqueteria, CP Origen, CP destino, No. Guia, Peso, Dimensiones]
    const arrFormatted = []
    const resolved = getLabels(page, liwmit)
        .then((data) => {
            //console.log(data.entries)
            data.entries.forEach(eachLabel => {
                let nombreCliente = eachLabel.userId == "4xUVTqVZ1n1FuBikezmQ" ? "RedBox" : "SRS Express"

                let eachTableElement = [eachLabel._id, nombreCliente, eachLabel.type]
                switch (eachLabel.type) {
                    case "Estafeta":
                        eachTableElement.push(eachLabel.request.dataOrigen.direccion.zip)
                        eachTableElement.push(eachLabel.request.dataDestino.direccion.zip)
                        eachTableElement.push(`${eachLabel.response.labelPetitionResult.elements[0]?.wayBill}` || "error")
                        eachTableElement.push(eachLabel.request.peso)
                        eachTableElement.push(`${eachLabel.request.alto}`)
                        eachTableElement.push(`${eachLabel.request.ancho}`)
                        eachTableElement.push(`${eachLabel.request.largo}`)
                        eachTableElement.push(`${eachLabel.response.labelPetitionResult.elements[0]?.trackingCode ? eachLabel.response.labelPetitionResult.elements[0].trackingCode : "S/N"}`)



                        break;
                    case "DHL":
                        const weight = eachLabel.request.packages[0]?.Weight

                        eachTableElement.push(eachLabel.request.oZip)
                        eachTableElement.push(eachLabel.request.dZip)
                        eachTableElement.push(`${eachLabel.response.ShipmentResponse?.ShipmentIdentificationNumber}` || "error")
                        eachTableElement.push(typeof weight === "string" ? weight : weight.Value)
                        eachTableElement.push(`${eachLabel.request.packages[0].Dimensions.Height}`)
                        eachTableElement.push(`${eachLabel.request.packages[0].Dimensions.Width}`)
                        eachTableElement.push(`${eachLabel.request.packages[0].Dimensions.Length}`)
                        eachTableElement.push(`${eachLabel.response.ShipmentResponse.PackagesResult?.PackageResult?.TrackingNumber ? eachLabel.response.ShipmentResponse.PackagesResult.PackageResult[0].TrackingNumber:"S/N"}` )

                        break;
                    default:
                        console.error("No se reconoce la paquteria de la etiqueta")
                        break;
                }
                arrFormatted.push(eachTableElement)
            })
            return arrFormatted
        })
    return resolved
}

export const getDataUsers = () => {
    const arrUsers = []
    const resolved = getUsers()
        .then((data) => {
            data.users.forEach(eachUser => {
                arrUsers.push(eachUser)
            })
            return arrUsers
        })
    return resolved
}

export const formatDataTableUsers = (dataUnformatted) => {
    const arrFormatted = []
    console.log("dataRaw", dataUnformatted)
    dataUnformatted.forEach(eachUser => {
        let eachElement = [
            eachUser.referencia,
            eachUser.idServices
        ]
        arrFormatted.push(eachElement)
    })
    return arrFormatted
}

// Inicio de bloque para generar reporte de guias generadas por usuarios 

export const dataReports = (userId) => {
    const arrFormatted = []
    const resolved = getLabels(0, 1500)
        .then((data) => {
            console.log(data)
            data.entries.forEach(eachLabel => {
                let nombreCliente = eachLabel.userId == "4xUVTqVZ1n1FuBikezmQ" ? "RedBox" : "SRS Express"

                let eachTableElement = [eachLabel._id, nombreCliente, eachLabel.type]
                var user = ""
                if (userId === "4xUVTqVZ1n1FuBikezmQ") {
                    user = "RedBox"
                    if (user === eachTableElement[1]) {
                        arrFormatted.push(eachTableElement)
                    }

                } else {
                    user = "SRS Express"
                    if (user === eachTableElement[1]) {
                        arrFormatted.push(eachTableElement)
                    }
                }
            })
            return arrFormatted
        })
    return resolved
}
export const dataTraking = (userId) => {
    const arrFormatted = []
    const resolved = getLabels(0, 1500)
        .then((data) => {
            
            data.entries.forEach(eachLabel => {
                let nombreCliente = eachLabel.userId == "4xUVTqVZ1n1FuBikezmQ" ? "RedBox" : "SRS Express"

                let eachTableElement = [nombreCliente, eachLabel.type]

                switch (eachLabel.type) {
                    case "Estafeta":
                        eachTableElement.push(eachLabel.response.labelPetitionResult.elements[0]?.trackingCode ? eachLabel.response.labelPetitionResult.elements[0].trackingCode : false)


                        break;
                    case "DHL":
                        const weight = eachLabel.request.packages[0]?.Weight

                        eachTableElement.push(eachLabel.response.ShipmentResponse.PackagesResult?.PackageResult?.TrackingNumber ? eachLabel.response.ShipmentResponse.PackagesResult.PackageResult[0].TrackingNumber : false)

                        break;
                    default:
                        console.error("No se reconoce la paquteria de la etiqueta")
                        break;
                }

                var user = ""
                if (eachTableElement[2] === false) {

                } else {


                    if (userId === "4xUVTqVZ1n1FuBikezmQ") {
                        user = "RedBox"
                        if (user === eachTableElement[0]) {
                            arrFormatted.push(eachTableElement)
                        }

                    } else {
                        user = "SRS Express"
                        if (user === eachTableElement[0]) {
                            arrFormatted.push(eachTableElement)
                        }
                    }
                }
            })
            return arrFormatted
        })
    return resolved
}