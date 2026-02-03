const { getStore } = require("@netlify/blobs");

const BLOB_KEY = "amaraltour-trips";

// context é obrigatório nas Functions 1ª geração para o Blobs funcionar
exports.handler = async (event, context) => {
  const headers = { "Content-Type": "application/json" };
  let store;

  try {
    store = getStore({ name: "amaraltour", context });
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Erro ao conectar com Blobs: " + err.message,
      }),
    };
  }

  // ─── GET — retorna todas as viagens ───
  if (event.httpMethod === "GET") {
    try {
      const raw = await store.get(BLOB_KEY);
      const trips = raw ? JSON.parse(raw) : [];
      return { statusCode: 200, headers, body: JSON.stringify(trips) };
    } catch (err) {
      return { statusCode: 200, headers, body: JSON.stringify([]) };
    }
  }

  // ─── POST — salva a lista inteira de viagens ───
  if (event.httpMethod === "POST") {
    try {
      const { trips } = JSON.parse(event.body);

      if (!Array.isArray(trips)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "trips deve ser um array" }),
        };
      }

      await store.set(BLOB_KEY, JSON.stringify(trips));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, total: trips.length }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Erro ao salvar: " + err.message }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Método não permitido" }),
  };
};
