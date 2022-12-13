import axios from "axios"

const URL = "http://68.183.17.99:7000/"

export const getRatesEstafeta = async (data) => {
    const payload = {
        "alto":data.height,
         "ancho": data.width,
         "esPaquete": data.package,
         "largo":data.lenght,
         "peso": data.weight,
         "originZip": data.origin_zip,
         "destinyZip": data.destiny_zip,
         "userId": data.user_id
 }

    const result = axios.post(`${URL}getRates/estafeta`, payload)
    .then(res =>{
        console.log("res", res)
        return res.data
    })
    .catch(err => {console.error("Error fetching getRates Estafeta: ", err)})

    return result
}