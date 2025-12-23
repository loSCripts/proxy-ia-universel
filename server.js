const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// SÉCURITÉ : Uniquement ton site officiel
app.use(cors({
    origin: 'https://loscripts.github.io'
}));

app.use(express.json());

// Fonction universelle pour parler à n8n
async function callN8n(url, body, res) {
    const secretKey = process.env.PROXY_KEY;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-secret-key': secretKey 
            },
            body: JSON.stringify(body)
        });
        const textData = await response.text();
        try {
            res.json(JSON.parse(textData));
        } catch (e) {
            res.json({ output: textData || "Réponse vide" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erreur de communication avec n8n" });
    }
}

// ROUTE 1 : Pour ton premier assistant (Expert IA)
app.post('/chat', (req, res) => {
    callN8n(process.env.N8N_WEBHOOK_URL, req.body, res);
});

// ROUTE 2 : Pour ton deuxième assistant (IA Système Simple)
app.post('/chat-simple', (req, res) => {
    callN8n(process.env.N8N_WEBHOOK_URL_SIMPLE, req.body, res);
});

app.listen(PORT, () => console.log(`Bouclier multi-tunnels prêt`));
