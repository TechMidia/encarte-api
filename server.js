require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cron = require('node-cron');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 🔁 CRON: Zera encartes semanais todo domingo à 00:01
cron.schedule('1 0 * * 0', async () => {
  console.log('⏰ Resetando encartes semanais...');
  try {
    const client = await pool.connect();
    await client.query('UPDATE usuario SET encarte_semana = 0');
    client.release();
    console.log('✅ Encartes semanais resetados com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao resetar encartes semanais:', err.message);
  }
});

// 🔎 Rota GET: Verificar assinatura
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
      encarte_semana: usuario.encarte_semana,
      encarte_total: usuario.encarte_total,
      nome_mercado: usuario.nome_mercado,
      endereco: usuario.endereco,
      instagram: usuario.instagram,
      logomarca: usuario.logomarca,
      oferta: usuario.oferta
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor', detalhe: err.message });
  }
});

// 📝 Rota POST: Cadastrar novo usuário
app.post('/usuario', async (req, res) => {
  const { telefone, nome_mercado, endereco, instagram, logomarca, oferta } = req.body;

  if (!telefone) {
    return res.status(400).json({ erro: 'Telefone é obrigatório' });
  }

  try {
    const client = await pool.connect();
    const resultado = await client.query(
      `INSERT INTO usuario (
        telefone, nome_mercado, endereco, instagram, logomarca, oferta,
        assinatura, plano, encarte_semana, encarte_total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [telefone, nome_mercado, endereco, instagram, logomarca, oferta, false, null, 0, 0]
    );
    client.release();

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', usuario: resultado.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhe: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API rodando na porta ${PORT}`));
