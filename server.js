require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
let db = null;

// Conecta com o MongoDB uma única vez (lazy init)
async function conectarMongo() {
  if (db) return db;

  const client = new MongoClient(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  db = client.db(process.env.DB_NAME || 'railway'); // padrão: railway
  return db;
}

// Endpoint GET para verificar assinatura pelo telefone
app.get('/verificar-assinatura', async (req, res) => {
  const telefone = req.query.telefone;

  if (!telefone) {
    return res.status(400).json({ erro: 'Telefone não informado' });
  }

  try {
    const database = await conectarMongo();
    const col = database.collection(process.env.COLLECTION_NAME || 'usuarios');

    const usuario = await col.findOne({ telefone });

    if (!usuario) {
      return res.status(404).json({
        assinatura: null,
        plano: null,
        mensagem: 'Usuário não encontrado'
      });
    }

    return res.status(200).json({
      assinatura: usuario.assinatura || false,
      plano: usuario.plano || null,
      encartesSemana: usuario.encartesSemana || 0
    });
  } catch (err) {
    console.error('Erro ao consultar assinatura:', err);
    return res.status(500).json({ erro: 'Erro interno', detalhe: err.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API rodando na porta ${PORT}`);
});
