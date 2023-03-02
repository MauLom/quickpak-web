import axios from "axios"

const URL = "https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2"
const CORSHEADER = {
    "headers": {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
}

export const getLabels = async (page, limit) => {
    const result = axios.get(`${URL}/labelsData?page=${page}&limit=${limit}`, CORSHEADER)
        .then(res => {
            return res.data
        })
        .catch(error => { console.error("error fetching getLabels", error) })
    return result
}
export const generateLabelEstafeta = async (dataPayload) => {
    const result = axios.post(`${URL}/generateLabel/estafeta`, dataPayload, CORSHEADER)
        .then(res => {
            return res.data
        })
        .catch(error => { console.error("error generating label estafeta", error) })
    return result
}
export const generateLabelDHL = async (dataPayload) => {
    const result = axios.post(`${URL}/generateLabel`, dataPayload, CORSHEADER)
        .then(res => {
            return res.data
        })
        .catch(error => { console.error("error generating label DHL", error) })
    return result
}
export const getImageFroZPL = (zpl) => {
    const result = axios.post("https://api.labelary.com/v1/printers/8dpmm/labels/4x8/", zpl, {
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
        }
    })
    .then(res => {
        return res
    })
    return result
}