
export async function saveUserPricing(payloadData: any): Promise<any> {
  // Define the URL for your API endpoint
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''; // Replace with your actual API endpoint

  // Create the request body
  const requestBody = JSON.stringify(payloadData);

  // Define request headers, including the content type
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Create the request object
  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    body: requestBody,
  };

  try {
    // Send the POST request
    const queryId = ``
    const response = await fetch(`${apiUrl}api/userPricing`, requestOptions);

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



export async function getUserPricing(user_id: number,provider_id:string, service:string): Promise<any> {
  // Define the URL for your API endpoint
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''; // Replace with your actual API endpoint

  // Create the request body

  // Define request headers, including the content type
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Create the request object
  const requestOptions: RequestInit = {
    method: "GET",
    headers,
  };

  try {
    // Send the POST request
    const queryId = ``
    const response = await fetch(`${apiUrl}api/userPricing?user_id=${user_id}&provider_id=${provider_id}&service=${service}`, requestOptions);
    if (response.status === 404) {
      
      return { message: 'Resource not found', data: [] };
    } else if (!response.ok) {
      throw new Error('Failed to post data to the server');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
