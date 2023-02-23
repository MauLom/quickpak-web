import axios from "axios"

// const URL = "http://68.183.17.99:7000/"
const URL = "https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2/"

const CORSHeaders = {
    "headers": {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
}
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

    const result = axios.post(`${URL}getRates/estafeta`, payload,
        CORSHeaders
    )
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
        "packages": [{ "@number": 1, "Weight": { "Value": data.weight, }, "Dimensions": { "Length": data.lenght, "Width": data.width, "Height": data.height } }],
        "insurance": "0",
        "userId": data.user_id
    }
    const result = axios.post(`${URL}getRates/`, payload,
        CORSHeaders)
        .then((res) => {
            console.log("Inside get service", res)
            return res.data
        })
        .catch(err => { console.error("Error fetching getRates Estafeta: ", err) })

    return result

}