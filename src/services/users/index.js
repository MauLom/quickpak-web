import axios from 'axios';

// const URL = 'https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2';
const URL = "http://localhost:8080"

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
