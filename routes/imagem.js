// routes/imagem.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const DEZGO_API_KEY = process.env.DEZGO_API_KEY;

// Endpoint para buscar imagem de produto, remover fundo e retornar em base64
router.get('/imagem-produto', async (req, res) => {
  const { produto } = req.query;

  if (!produto) {
    return res.status(400).json({ error: 'Nome do produto é obrigatório.' });
  }

  try {
    // 1. Buscar imagem no Google Imagens via SerpAPI
    const serpRes = await axios.get('https://serpapi.com/search.json', {
      params: {
        q: produto,
        tbm: 'isch',
        api_key: SERPAPI_KEY,
      },
    });

    const imageUrl = serpRes.data?.images_results?.[0]?.original;
    if (!imageUrl) {
      return res.status(404).json({ error: 'Imagem não encontrada no Google.' });
    }

    // 2. Remover fundo da imagem via Dezgo API
    const dezgoRes = await axios.post(
      'https://api.dezgo.com/remove-background',
      { image_url: imageUrl },
      {
        headers: {
          'X-Api-Key': DEZGO_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    // 3. Retornar imagem em base64
    const buffer = Buffer.from(dezgoRes.data, 'binary');
    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;

    res.json({ produto, imageUrlOriginal: imageUrl, imageBase64: base64Image });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar ou processar imagem.' });
  }
});

module.exports = router;
