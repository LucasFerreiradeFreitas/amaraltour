import { getStore } from "@netlify/blobs";

const BLOB_KEY = "amaraltour-trips";

export const handler = async (event, context) => {
  const headers = { "Content-Type": "application/json" };

  // No formato .mjs, o Blobs consegue ler o contexto automaticamente melhor
  // mas mantemos a passagem explícita por segurança
  let store;
  try {
    store = getStore({ name: "amaraltour", context });
  } catch (err) {
    console.error("Erro config Blobs:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Erro na configuração do Blobs: " + err.message,
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
      console.error("Erro no GET:", err);
      // Se der erro de leitura, retorna array vazio para não quebrar o site
      return { statusCode: 200, headers, body: JSON.stringify([]) };
    }
  }

  // ─── POST — salva a lista inteira ───
  if (event.httpMethod === "POST") {
    try {
      if (!event.body) throw new Error("Corpo da requisição vazio");
      const { trips } = JSON.parse(event.body);

      if (!Array.isArray(trips)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: "O formato precisa ser uma lista (array)",
          }),
        };
      }

      await store.set(BLOB_KEY, JSON.stringify(trips));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, total: trips.length }),
      };
    } catch (err) {
      console.error("Erro no POST:", err);
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
