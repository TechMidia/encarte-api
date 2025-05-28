// routes/plano.js

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
    // Buscar usuário pelo telefone
    const userResult = await pool.query(
      'SELECT * FROM usuarios WHERE telefone = $1',
      [telefone]
    );

    if (userResult.rows.length === 0) {
      // Usuário não cadastrado ou sem assinatura
      return res.json({ assinatura: false, plano: null, encartesRestantes: 0 });
    }

    // Exemplo: supondo que o campo "plano" está na tabela usuarios
    const user = userResult.rows[0];
    let encartesPorSemana = 0;

    if (user.plano === 'Plano 1') encartesPorSemana = 2;
    else if (user.plano === 'Plano 2') encartesPorSemana = 5;
    else if (user.plano === 'Plano 3') encartesPorSemana = 99; // ilimitado (ajuste para o valor que preferir)

    // Contar quantos encartes o usuário já criou na semana
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0,0,0,0);

    const encartesResult = await pool.query(
      'SELECT COUNT(*) FROM encartes WHERE telefone = $1 AND data_criacao >= $2',
      [telefone, startOfWeek]
    );

    const encartesUsados = parseInt(encartesResult.rows[0].count, 10);
    let encartesRestantes = encartesPorSemana - encartesUsados;
    if (user.plano === 'Plano 3') encartesRestantes = 'ilimitado';

    res.json({
      assinatura: true,
      plano: user.plano,
      encartesRestantes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao verificar plano', detalhe: err.message });
  }
});

module.exports = router;
