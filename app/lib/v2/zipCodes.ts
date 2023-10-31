
export async function getZipCodeData(zipCode: number): Promise<any> {
  // Define the URL for your API endpoint
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // Create the request body
  // Define request headers, including the content type
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const requestOptions: RequestInit = {
    method: "GET",
    headers,
  };

  try {
    const response = await fetch(`${apiUrl}zip/${zipCode}`, requestOptions);
    if (!response.ok) {
      throw new Error('Failed to post data to the server');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
