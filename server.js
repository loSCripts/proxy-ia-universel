const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// --- SÉCURITÉ CORS : Seul ton site peut appeler ce serveur ---
app.use(cors({
    origin: 'https://loscripts.github.io' 
}));

app.use(express.json());

app.post('/chat', async (req, res) => {
    // Récupération sécurisée des infos depuis le coffre-fort Vercel
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    const secretKey = process.env.PROXY_KEY; 
    
    try {
        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // Envoi de la clé pour passer le nœud Switch1 de n8n
                'x-secret-key': secretKey 
            },
            body: JSON.stringify(req.body)
        });

        const textData = await response.text();
        
        try {
            // Tentative de renvoi du JSON propre de n8n
            res.json(JSON.parse(textData));
        } catch (e) {
            // Secours si n8n renvoie du texte brut
            res.json({ output: textData || "Réponse vide de l'IA" });
        }
    } catch (error) {
        console.error("Erreur communication:", error);
        res.status(500).json({ error: "Le bouclier n'a pas pu contacter n8n." });
    }
});

app.listen(PORT, () => console.log(`Serveur prêt et protégé`));
