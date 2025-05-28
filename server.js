const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const uploadToS3 = require('./uploadS3');
const imagemRoute = require('./routes/imagem');
const planoRoute = require('./routes/plano');
const usuarioRoute = require('./routes/usuario');
const pool = require('./db'); // conexão com PostgreSQL

dotenv.config();

const app = express();
});

app.use(cors());
app.use(express.json());

// Rotas externas
app.use('/api', imagemRoute);
app.use('/api', usuarioRoute);
app.use('/plano', planoRoute);

// Rota principal (teste)
app.get('/', (req, res) => {
  res.send('API do Encarte está rodando com sucesso!');
});

// Rota de criação do encarte
app.post('/criar-encarte', async (req, res) => {
  const imagePath = path.join(__dirname, 'encarte.png'); // Imagem temporária!

  try {
    const imageUrl = await uploadToS3(imagePath, `encarte-${Date.now()}.png`);

    const client = await pool.connect();
    await client.query(
      'INSERT INTO encartes (telefone, imagem_url, data_criacao) VALUES ($1, $2, NOW())',
      [req.body.telefone, imageUrl]
    );
    client.release();

    res.json({ mensagem: 'Encarte criado com sucesso', url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar encarte', detalhe: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
