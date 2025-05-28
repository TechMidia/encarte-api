// controllers/planoController.js

const pool = require('../db');

async function verificarPlano(telefone) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      'SELECT plano, assinatura, encarte_semana FROM usuario WHERE telefone = $1',
      [telefone]
    );
    if (res.rows.length > 0 && res.rows[0].assinatura === true) {
      return {
        plano: res.rows[0].plano,
        encarte_semana: res.rows[0].encarte_semana,
      };
    }
    return null;
  } finally {
    client.release();
  }
}

module.exports = {
  verificarPlano,
};
