// Netlify Function: fooddata.js
// Proxy per USDA FoodData Central API
// Cerca alimenti per nome e restituisce i dati nutrizionali

const fetch = require('node-fetch');

const API_KEY = 'Jw1JYdl4kuTbM47E6gUNShrep0fcMsrcXUwmBy0l';
const SEARCH_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

exports.handler = async function(event, context) {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  const query = body.query || '';
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing query parameter' })
    };
  }

  // Costruisci la richiesta per FoodData Central
  const url = `${SEARCH_URL}?api_key=${API_KEY}`;
  const payload = {
    query: query,
    pageSize: 5 // Limita i risultati per esempio
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Errore da FoodData Central', details: await response.text() })
      };
    }

    const data = await response.json();
    // Restituisci direttamente la risposta USDA (puoi normalizzare in seguito)
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore di rete o server', details: error.message })
    };
  }
};
