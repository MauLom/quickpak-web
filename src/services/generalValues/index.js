import axios from "axios"

const URL = "https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2"
//const URL = "http://localhost:8080"

const CORSHEADER =  {
    "headers": {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
}
export const getValues = async () => {
    const result = await axios.get(`${URL}/generalValues`, CORSHEADER)
    return result
}

export const updateValues = async (data) => {
    const result = await axios.post(`${URL}/generalValues`, {
        aerial: data.aerial,
        land: data.land
    }, CORSHEADER)
    return result
}