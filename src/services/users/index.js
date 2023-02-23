import axios from 'axios';
import {CONSTANTS} from '../../utils/consts'
// const URL = 'https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2';
const URL = "https://clownfish-app-b2q4a.ondigitalocean.app"
//const URL = CONSTANTS.URL

export const getUsers = async () => {
  const result = axios
    .get(`${URL}/usersData`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error('error fetching getLabels', error);
    });
  return result;
};
export const login = async (referencia, cifrado) => {
  console.log("refe", referencia)
  console.log("cifrado", cifrado)
  return await axios
    .post(`${URL}/getUsers`, {
      "referencia": referencia,
      "idServices": cifrado
    })
    .then(res =>{
      return res
    })
    .catch(error =>{
      console.error("Error on login:", error)
    })
}