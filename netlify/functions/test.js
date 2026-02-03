// Coloque em netlify/functions/test.js
// Acesse: https://amaraltour.netlify.app/.netlify/functions/test
// Vai mostrar exatamente o que está disponível no ambiente

exports.handler = async (event, context) => {
  const info = {};

  // 1. Verifica se @netlify/blobs existe
  try {
    const blobs = require("@netlify/blobs");
    info.blobs_module = "disponível";
    info.blobs_exports = Object.keys(blobs);
  } catch (err) {
    info.blobs_module = "NÃO encontrado: " + err.message;
  }

  // 2. Tenta criar o store
  try {
    const { getStore } = require("@netlify/blobs");

    // Tenta com context
    try {
      const store = getStore({ name: "amaraltour", context });
      info.store_com_context = "criado OK";

      // Tenta dar um get
      try {
        const val = await store.get("amaraltour-trips");
        info.get_com_context = val
          ? "retornou dados (" + val.length + " chars)"
          : "retornou null";
      } catch (err) {
        info.get_com_context_erro = err.message;
      }
    } catch (err) {
      info.store_com_context_erro = err.message;
    }

    // Tenta sem context (só nome string)
    try {
      const store2 = getStore("amaraltour");
      info.store_sem_context = "criado OK";

      try {
        const val2 = await store2.get("amaraltour-trips");
        info.get_sem_context = val2
          ? "retornou dados (" + val2.length + " chars)"
          : "retornou null";
      } catch (err) {
        info.get_sem_context_erro = err.message;
      }
    } catch (err) {
      info.store_sem_context_erro = err.message;
    }
  } catch (err) {
    info.blobs_geral_erro = err.message;
  }

  // 3. Env vars disponíveis (sem valores, só nomes)
  info.env_vars = Object.keys(process.env).filter(
    (k) => k.includes("BLOB") || k.includes("NETLIFY") || k.includes("ADMIN"),
  );

  // 4. Node version
  info.node_version = process.version;

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(info, null, 2),
  };
};
