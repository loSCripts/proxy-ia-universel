const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    
    try {
        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // --- ON ENVOIE LE MOT DE PASSE ICI ---
                'x-secret-key': '123456' 
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

app.listen(PORT, () => console.log(`Serveur prêt`));
