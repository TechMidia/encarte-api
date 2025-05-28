// routes/plano.js
const express = require('express');
const router = express.Router();
const { verificarPlano } = require('../controllers/planoController');

// GET /plano/verificar-plano?telefone=71XXXXXXXXX
router.get('/verificar-plano', async (req, res) => {
  const telefone = req.query.telefone;

  if (!telefone || telefone.trim() === '') {
    return res.status(400).json({ erro: 'O telefone é obrigatório.' });
  }

  try {
    const plano = await verificarPlano(telefone.trim());
    if (plano) {
      return res.json({ ativo: true, plano });
    } else {
      return res.json({ ativo: false });
    }
  } catch (error) {
    console.error('Erro ao verificar plano:', error.message);
    return res.status(500).json({ erro: 'Erro interno ao verificar plano.' });
  }
});

module.exports = router;
