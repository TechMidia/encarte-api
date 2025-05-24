require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
let client;

async function conectarMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
  }
  return client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
}

app.get('/verificar-assinatura', async (req, res) => {
  const telefone = req.query.telefone;
  if (!telefone) return res.status(400).json({ erro: 'Telefone não informado' });

  try {
    const col = await conectarMongo();
    const usuario = await col.findOne({ telefone });

    if (!usuario) {
      return res.status(404).json({ assinatura: null, mensagem: 'Usuário não encontrado' });
    }

    return res.json({
      assinatura: usuario.assinatura || null,
      plano: usuario.plano || null
    });

  } catch (err) {
    return res.status(500).json({ erro: 'Erro no servidor', detalhe: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
