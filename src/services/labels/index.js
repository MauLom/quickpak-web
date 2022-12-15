import axios from "axios"

const URL = "https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2"

export const getLabels = async (page, limit) => {
    const result = axios.get(`${URL}labelsData?page=${page}&limit=${limit}`, {
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
    })
        .then(res => {
            return res.data
        })
        .catch(error => { console.error("error fetching getLabels", error) })
    return result
}