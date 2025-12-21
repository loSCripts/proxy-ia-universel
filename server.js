const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    // Le serveur va chercher la clé PROXY_KEY que tu viens de créer dans Vercel
    const secretKey = process.env.PROXY_KEY; 
    
    try {
        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-secret-key': secretKey 
            },
            body: JSON.stringify(req.body)
        });

        const textData = await response.text();
        try {
            res.json(JSON.parse(textData));
        } catch (e) {
            res.json({ output: textData || "Réponse vide" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erreur de communication" });
    }
});

app.listen(PORT, () => console.log(`Serveur sécurisé prêt`));
