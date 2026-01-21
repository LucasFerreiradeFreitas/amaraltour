exports.handler = async (event, context) => {
  // Permite apenas POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { password } = JSON.parse(event.body);

    // A senha hash fica nas variáveis de ambiente do Netlify
    const CORRECT_HASH = process.env.ADMIN_PASSWORD_HASH;

    // Função SHA-256
    const crypto = require("crypto");
    const inputHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Verifica se o hash corresponde
    if (inputHash === CORRECT_HASH) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authenticated: true,
          message: "Login successful",
        }),
      };
    } else {
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authenticated: false,
          message: "Invalid password",
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Server error",
        details: error.message,
      }),
    };
  }
};
