require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/verificar-assinatura', async (req, res) => {
  const telefone = req.query.telefone?.trim();
  if (!telefone) {
    return res.status(400).json({ erro: 'Telefone não informado' });
  }

  try {
    const client = await pool.connect();
    const resultado = await client.query('SELECT * FROM usuario WHERE telefone = $1', [telefone]);

    client.release();

    if (resultado.rows.length === 0) {
      return res.status(404).json({ assinatura: null, mensagem: 'Usuário não encontrado' });
    }

    const usuario = resultado.rows[0];
    return res.json({
      telefone: usuario.telefone,
      assinatura: usuario.assinatura,
      plano: usuario.plano,
      encarte_semana: usuario.encarte_semana
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor', detalhe: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API rodando na porta ${PORT}`));
