const pool = require('../db');

const limitePorPlano = {
  'plano 1': 2,
  'plano 2': 5,
  'plano 3': Infinity
};

async function podeCriarEncarte(telefone) {
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM usuario WHERE telefone = $1', [telefone]);
  client.release();

  const usuario = result.rows[0];
  if (!usuario) return { ok: false, motivo: "usuario_nao_encontrado" };

  if (usuario.assinatura === true || usuario.assinatura === 'true') {
    const limite = limitePorPlano[(usuario.plano || '').toLowerCase()] || 0;
    if (limite === Infinity) return { ok: true };
    if (usuario.encarte_semana < limite) return { ok: true };
    return { ok: false, motivo: "limite_plano" };
  } else {
    // Sem assinatura ativa
    if (usuario.encarte_total < 3) return { ok: true, restantes: 3 - usuario.encarte_total };
    return { ok: false, motivo: "fim_gratis" };
  }
}

module.exports = { podeCriarEncarte };
