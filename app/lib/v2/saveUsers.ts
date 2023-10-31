
export async function saveUser(userData:any): Promise<any> {
    // Define the URL for your API endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''; // Replace with your actual API endpoint

    // Create the request body
    const requestBody = JSON.stringify(userData);

    // Define request headers, including the content type
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Create the request object
    const requestOptions: RequestInit = {
      method: userData._id !== 0 ? 'PUT' : 'POST',
      headers,
      body: requestBody,
    };

    try {
      // Send the POST request
      const queryId = `${userData['_id'] !== 0 ? "/" + userData._id : ""}`
      const response = await fetch(`${apiUrl}users${queryId}`, requestOptions);

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
