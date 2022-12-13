import axios from "axios"

const URL = "http://68.183.17.99:7000/"

export const getLabels = async (page, limit) => {
    const result = axios.get(`${URL}labelsData?page=${page}&limit=${limit}`)
        .then(res => {
            return res.data
        })
        .catch(error => { console.error("error fetching getLabels", error) })
    return result
}