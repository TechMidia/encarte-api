require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

let db = null; // Armazena conexão reutilizável

async function conectarMongo() {
  if (db) return db;

 const client = new MongoClient(process.env.MONGODB_URI || process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

  });

  await client.connect();
  db = client.db(process.env.DB_NAME); // Mantém conexão ativa
  return db;
}

app.get('/verificar-assinatura', async (req, res) => {
  const telefone = req.query.telefone;
  if (!telefone) return res.status(400).json({ erro: 'Telefone não informado' });

  try {
    const db = await conectarMongo();
    const col = db.collection(process.env.COLLECTION_NAME);

    const usuario = await col.findOne({ telefone });

    if (!usuario) {
      return res.status(404).json({ assinatura: null, mensagem: 'Usuário não encontrado' });
    }

    return res.json({
      assinatura: usuario.assinatura || null,
      plano: usuario.plano || null
    });

  } catch (err) {
    console.error('Erro ao acessar MongoDB:', err.message);
    return res.status(500).json({ erro: 'Erro no servidor', detalhe: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API rodando na porta ${PORT}`));
