import axios from "axios"

const URL = "https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2"

export const getRatesEstafeta = (data) => {
    const payload = {
        "alto": data.height,
        "ancho": data.width,
        "esPaquete": data.package,
        "largo": data.lenght,
        "peso": data.weight,
        "originZip": data.origin_zip,
        "destinyZip": data.destiny_zip,
        "userId": data.user_id
    }

    const result = axios.post(`${URL}getRates/estafeta`, payload)
        .then((res) => {
            return res.data
        })
        .catch(err => { console.error("Error fetching getRates Estafeta: ", err) })

    return result
}

export const getRatesDHL = (data) => {
    const payload = {
        "timestamp": data.date,
        "shipperCity": data.origin_city,
        "shipperCountryCode": "MX",
        "shipperZip": data.origin_zip,
        "recipientCity": data.destiny_city,
        "recipientCountryCode": "MX",
        "recipientZip": data.destiny_zip,
        "packages": [{ "@number": 1, "Weight": { "Value": data.weight, }, "Dimensions": { "Length": data.lenght, "Width": data.width, "Height": data.height} }],
        "insurance": "0",
        "userId": data.user_id
    }
    const result = axios.post(`${URL}getRates/`, payload)
        .then((res) => {
            console.log("Inside?", res)
            return res.data
        })
        .catch(err => { console.error("Error fetching getRates Estafeta: ", err) })

    return result

}