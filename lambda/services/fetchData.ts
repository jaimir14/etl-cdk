const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000; // Delay of 1 second

/**
 * Fetches data from API using the provided country as a query parameter.
 * Includes retry logic with exponential backoff on network or server errors.
 *
 * @param {string} country - The country name to include as a query parameter in the API request.
 * @returns {Promise<any[]>} - A promise that resolves to an array of data retrieved from the API.
 *
 * @throws {Error} Throws an error if the API fails after all retry attempts,
 *                 or if the response is not an array.
 */
export async function fetchData(country: string): Promise<Response[]> {
  if(!country) {
    throw new Error("Missing required parameter: country")
  }
  
  const baseUrl = process.env.API_HOST;

  if(!baseUrl) {
    throw new Error("Missing required url property: API_HOST");
  }

  const url = new URL('search', baseUrl);
  url.searchParams.append('country', country);

  for(let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

    try {
      const response = await fetch(url.toString());
      console.log({response, url: url.toString()})
      if(!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      }

      const data = await response.json() as Response[];
      return data;
    } catch (error: any) {
      const isLastAttempt = attempt === MAX_RETRIES;

      console.warn(`Fetch attempt ${attempt} failed: ${error.message}`);

      if (isLastAttempt) {
        console.error("All fetch attempts failed.");
        throw error;
      }

      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Fetch failed after retries");
}