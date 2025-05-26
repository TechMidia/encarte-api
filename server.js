require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();

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
const result = await pool.query("SELECT * FROM usuario WHERE telefone = $1", [telefone]);

    if (result.rows.length === 0) {
      return res.status(404).json({ assinatura: null, mensagem: 'Usuário não encontrado' });
    }

    const usuario = result.rows[0];
    return res.json({
  telefone: usuario.telefone,
  assinatura: usuario.assinatura,
  plano: usuario.plano,
  encartes_semana: usuario.encartes_semana
});
    });
  } catch (err) {
    console.error('Erro:', err);
    return res.status(500).json({ erro: 'Erro no servidor', detalhe: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API rodando na porta ${PORT}`));
