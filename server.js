require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Note : Node 18+ a fetch intégré, donc plus besoin de node-fetch
// mais on garde une structure ultra-compatible VPS.

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const n8nUrl = process.env.N8N_WEBHOOK_URL;
        if (!n8nUrl) return res.status(500).json({ error: "Config manquante" });

        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        // --- LA RÉPARATION EST ICI ---
        const textData = await response.text(); // On lit d'abord en texte (ne plante jamais)
        
        try {
            const jsonData = JSON.parse(textData); // On essaie de transformer en JSON
            res.json(jsonData);
        } catch (e) {
            // Si n8n a envoyé du texte brut ou du vide
            res.json({ output: textData || "L'IA n'a rien renvoyé (réponse vide)." });
        }

    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ error: "Problème de communication avec n8n" });
    }
});

app.listen(PORT, () => console.log(`Serveur prêt sur port ${PORT}`));
