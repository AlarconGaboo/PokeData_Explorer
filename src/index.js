const axios = require('axios');
const pokemonNames = require('../data/pokemonNames');
const apiEndpoints = require('../data/apiEndpoints');

// Función para hacer una petición a la API con reintentos y retraso
const fetchData = async (url, retries = 3, delay = 10000) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      console.error(`Demasiadas peticiones a ${url}. Intentando nuevamente en ${delay / 1000} segundos...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchData(url, retries - 1, delay * 2); // Reintentar con un mayor retraso
    } else {
      console.error(`Error al hacer la llamada a ${url}:`, error.message);
      throw error; // Re-lanzar el error si no es el esperado o se agotaron los reintentos
    }
  }
};

// Función para obtener y mostrar datos de Pokémon con delay entre cada solicitud
const fetchPokemonData = async (pokemon, delay = 10000) => {
  try {
    // Construir URL de la API de Pokémon
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    // Esperar el retraso antes de realizar la solicitud
    await new Promise(resolve => setTimeout(resolve, delay));
    const response = await axios.get(url);
    const { name, abilities, types } = response.data;
    console.log(`Pokémon: ${name}`);
    console.log(`Habilidades: ${abilities.map(ab => ab.ability.name).join(', ')}`);
    console.log(`Tipos: ${types.map(type => type.type.name).join(', ')}`);
    console.log('---------------------------------');
  } catch (error) {
    console.error(`Error al obtener datos del Pokémon ${pokemon}:`, error.message);
  }
};

// Ejecutar consultas a las APIs y mostrar los datos
const run = async () => {
  // Obtener datos de la API de Pokémon con un retraso entre cada solicitud
  for (const pokemon of pokemonNames) {
    await fetchPokemonData(pokemon);
  }

  // Consultar otras APIs con un retraso entre cada solicitud
  for (const endpoint of apiEndpoints) {
    try {
      const data = await fetchData(endpoint);
      console.log(`Datos de API ${endpoint}:`, data);
      console.log('---------------------------------');
    } catch (error) {
      console.error(`Error al hacer la llamada a ${endpoint}:`, error.message);
      console.log(`Datos de API ${endpoint}: undefined`);
      console.log('---------------------------------');
    }
  }
};

run();
