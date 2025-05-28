// controllers/usuarioController.js

const pool = require('../db');

async function cadastrarUsuario({ telefone, nome_mercado, endereco, instagram, logomarca }) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO usuario (telefone, nome_mercado, endereco, instagram, logomarca, assinatura, plano, encarte_semana, encarte_total)
      VALUES ($1, $2, $3, $4, $5, false, '', 0, 0)
      ON CONFLICT (telefone) DO NOTHING`,
      [telefone, nome_mercado, endereco, instagram, logomarca]
    );
    return { mensagem: 'Usuário cadastrado com sucesso' };
  } finally {
    client.release();
  }
}

module.exports = {
  cadastrarUsuario,
};
