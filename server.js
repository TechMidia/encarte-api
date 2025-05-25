require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Necessário para produção no Railway
});

app.get('/verificar-assinatura', async (req, res) => {
  const telefone = req.query.telefone;
  if (!telefone) {
    return res.status(400).json({ erro: 'Telefone não informado' });
  }

  try {
    const result = await pool.query(
      'SELECT assinatura, plano, encartes_semana FROM usuarios WHERE telefone = $1',
      [telefone]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ assinatura: null, mensagem: 'Usuário não encontrado' });
    }

    const { assinatura, plano, encartes_semana } = result.rows[0];

    return res.json({ assinatura, plano, encartes_semana });
  } catch (err) {
    console.error('Erro ao consultar assinatura:', err);
    return res.status(500).json({ erro: 'Erro interno', detalhe: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API rodando na porta ${PORT}`));
