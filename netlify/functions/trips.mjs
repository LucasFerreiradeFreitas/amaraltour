import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("amaraltour");
  const blobKey = "amaraltour-trips";
  const headers = {
    "Content-Type": "application/json",
    // Permite que o site acesse a função sem bloqueios
    "Access-Control-Allow-Origin": "*",
  };

  try {
    // ─── GET: Retorna as viagens ───
    if (req.method === "GET") {
      const data = await store.get(blobKey);
      // Se não tiver dados, retorna lista vazia
      const trips = data ? JSON.parse(data) : [];
      return new Response(JSON.stringify(trips), { status: 200, headers });
    }

    // ─── POST: Salva as viagens ───
    if (req.method === "POST") {
      // No formato novo, lemos os dados assim:
      const body = await req.json();

      if (!body.trips || !Array.isArray(body.trips)) {
        return new Response(
          JSON.stringify({ error: "Formato inválido. Esperado { trips: [] }" }),
          { status: 400, headers },
        );
      }

      await store.set(blobKey, JSON.stringify(body.trips));
      return new Response(
        JSON.stringify({ ok: true, total: body.trips.length }),
        { status: 200, headers },
      );
    }

    return new Response("Método não permitido", { status: 405, headers });
  } catch (err) {
    console.error("Erro no Blobs:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno: " + err.message }),
      { status: 500, headers },
    );
  }
};
