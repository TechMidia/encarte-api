const express = require('express');
const router = express.Router();
const pool = require('../db');

// Rota: GET /plano/verificar-plano?telefone=...
router.get('/verificar-plano', async (req, res) => {
  const { telefone } = req.query;

  if (!telefone) {
    return res.status(400).json({ erro: 'Telefone não informado' });
  }

  try {
    // Exemplo de busca (ajuste para sua lógica real de planos)
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE telefone = $1',
      [telefone]
    );

    if (result.rows.length === 0) {
      return res.json({ assinatura: false, plano: null });
    }

    // Supondo que plano e limites fiquem em outra tabela, ajuste aqui:
    // Exemplo de resposta simulada
    res.json({
      assinatura: true,
      plano: "Plano 2", // ajuste conforme seu banco
      encartesRestantes: 3 // ajuste conforme a lógica de uso semanal
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao verificar plano', detalhe: err.message });
  }
});

module.exports = router;
