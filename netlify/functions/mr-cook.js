// Netlify Function: mr-cook.js
// Backend proxy per Mr. Cook AI Recipe Generator
// Sostituisci ENDPOINT_URL e API_KEY con i valori reali quando disponibili

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Ricevi i dati dal frontend (es: prompt, preferenze, ecc.)
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  // Prepara la richiesta per Mr. Cook
  const ENDPOINT_URL = 'https://api.mrcook.ai/recipe'; // Placeholder
  const API_KEY = 'INSERISCI_LA_TUA_API_KEY'; // Placeholder

  // Esempio di payload (adatta secondo la documentazione reale)
  const payload = {
    prompt: body.prompt || '',
    // ...altri parametri richiesti da Mr. Cook
  };

  try {
    const response = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Errore da Mr. Cook', details: await response.text() })
      };
    }

    const data = await response.json();

    // Normalizzazione base (adatta secondo la risposta reale)
    const recipe = {
      title: data.title || '',
      ingredients: data.ingredients || [],
      steps: data.steps || [],
      // ...altri campi secondo lo schema richiesto
    };

    return {
      statusCode: 200,
      body: JSON.stringify(recipe)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore di rete o server', details: error.message })
    };
  }
};
