// pages/api/providers.ts

import { NextApiRequest, NextApiResponse } from 'next';

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    try {
        // Fetch data from your backend API
        const response = await fetch(`${apiUrl}api/providers`); // Replace with your actual API URL
        if (!response.ok) {
            throw new Error('Failed to fetch data from the backend.');
        }

        const data = await response.json();

        // Respond with the fetched data
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { getHandler as GET };
