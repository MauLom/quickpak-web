import { getLabels } from "../services/labels"

export const getDataTableLabels =  (page, liwmit) => {
    // [IdCliente, Paqueteria, CP Origen, CP destino, No. Guia, Peso, Dimensiones]
    const arrFormatted = []
    const resolved =  getLabels(page, liwmit)
        .then((data) => {
            data.entries.forEach(eachLabel => {
                let nombreCliente = eachLabel.userId == "4xUVTqVZ1n1FuBikezmQ"? "RedBox": "SRS Express"

                let eachTableElement = [eachLabel._id,nombreCliente, eachLabel.type]
                switch (eachLabel.type) {
                    case "Estafeta":
                        eachTableElement.push(eachLabel.request.dataOrigen.direccion.zip)
                        eachTableElement.push(eachLabel.request.dataDestino.direccion.zip)
                        eachTableElement.push(`${eachLabel.response.labelPetitionResult.elements[0]?.wayBill}` || "error")
                        eachTableElement.push(eachLabel.request.peso)
                        eachTableElement.push(`${eachLabel.request.alto}x${eachLabel.request.ancho}x${eachLabel.request.largo}`)
                        break;
                    case "DHL":
                        const weight = eachLabel.request.packages[0]?.Weight

                        eachTableElement.push(eachLabel.request.oZip)
                        eachTableElement.push(eachLabel.request.dZip)
                        eachTableElement.push(`${eachLabel.response.ShipmentResponse?.ShipmentIdentificationNumber}` || "error")
                        eachTableElement.push(typeof weight === "string"? weight : weight.Value)
                        eachTableElement.push(`${eachLabel.request.packages[0].Dimensions.Height}x${eachLabel.request.packages[0].Dimensions.Width}x${eachLabel.request.packages[0].Dimensions.Length}`)
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