require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
// Le port est dynamique pour s'adapter à Vercel ou à ton futur VPS
const PORT = process.env.PORT || 3000;

// 1. Sécurité CORS : Autorise uniquement ton site GitHub
const corsOptions = {
    origin: 'https://loscripts.github.io',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// 2. La route "Passerelle" vers n8n
app.post('/chat', async (req, res) => {
    try {
        const n8nUrl = process.env.N8N_WEBHOOK_URL;
        
        if (!n8nUrl) {
            return res.status(500).json({ error: "Configuration manquante sur le serveur." });
        }

        // Transmission de la question à n8n
        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        // Renvoi de la réponse de l'IA à ton site
        res.json(data);

    } catch (error) {
        console.error("Erreur Proxy:", error);
        res.status(500).json({ error: "Erreur de communication avec l'IA." });
    }
});

// 3. Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur prêt sur le port ${PORT}`);
});