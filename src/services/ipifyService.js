// src/services/ipifyService.js

const API_KEY = import.meta.env.VITE_IPIFY_API_KEY;
const API_BASE_URL = 'https://geo.ipify.org/api/v2/country,city';

export async function getLocationData(query = '') {
  let queryParam = '';

  if (query) {
    if (/^[0-9.]+$/.test(query)) {
      queryParam = `&ipAddress=${query}`;
    } else {
      queryParam = `&domain=${query}`;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}?apiKey=${API_KEY}${queryParam}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location data. Please check the IP or domain.');
    }
    return await response.json();
  } catch (error) {
    console.error("IPify Service Error:", error);
    throw error;
  }
}