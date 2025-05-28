// routes/usuario.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Cadastro de usuário
router.post('/cadastrar-usuario', async (req, res) => {
  const { telefone, nome_mercado, endereco, instagram, logomarca } = req.body;

  try {
    const client = await pool.connect();
    await client.query(
      'INSERT INTO usuario (telefone, nome_mercado, endereco, instagram, logomarca) VALUES ($1, $2, $3, $4, $5)',
      [telefone, nome_mercado, endereco, instagram, logomarca]
    );
    client.release();
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhe: err.message });
  }
});

module.exports = router;
