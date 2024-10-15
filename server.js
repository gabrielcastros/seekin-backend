const express = require('express');
const axios = require('axios');
const { url } = require('inspector');
const app = express();
const port = 3000;
const cors = require('cors');
const { off } = require('process');
const api = axios.create({
    baseURL: 'https://api-v2.soundcloud.com',
})

const clientId = '6ZQ2Vr6GmERVhpEmkZmcNAuDQ3l9qaZe';

app.use(cors());

app.get('/resolveTrack', async (req, res) => {
    const trackUrl = req.query.url

    if (!trackUrl) {
        return res.status(400).send('URL da track é necessária');
    }

    try {
        const response = await api.get(`/resolve`, {
            params: {
                url: trackUrl,
                client_id: clientId
            }
        });

        res.json(response.data)
    } catch (error) {
        console.error('Erro ao retornar ID da track:', error);
        res.status(500).send('Erro ao acessar API do SoundCloud');
    }
});

app.get(`/findPlaylistWithTrack`, async (req, res) => {
    const trackId = req.query.id
    const offset = req.query.offset

    if (!trackId) {
        return res.status(400).send('ID inválido ou vazio');
    }

    try {
        const response = await api.get(`/tracks/${trackId}/playlists_without_albums`, {
            params: {
                representation: 'mini',
                client_id: clientId,
                limit: 10,
                offset: offset,
                linked_partitioning: 1,
                app_version: 1728896408,
                app_locale: 'en',
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Erro ao procurar playlists com a track:', error);
        res.status(500).send('Erro ao acessar API do SoundCloud');
    }
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});