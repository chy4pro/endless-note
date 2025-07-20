const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const NOTES_DIR = path.join(__dirname, 'notes');

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '..')));

const ensureDir = async () => {
    try { await fs.access(NOTES_DIR); } 
    catch { await fs.mkdir(NOTES_DIR); }
};

app.get('/api/notes', async (req, res) => {
    try {
        await ensureDir();
        const files = await fs.readdir(NOTES_DIR);
        const notes = await Promise.all(
            files.filter(f => f.endsWith('.json'))
                 .map(async f => JSON.parse(await fs.readFile(path.join(NOTES_DIR, f), 'utf8')))
        );
        res.json(notes.sort((a, b) => a.date.localeCompare(b.date)));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read notes' });
    }
});

app.post('/api/notes/:date', async (req, res) => {
    try {
        await ensureDir();
        const { date } = req.params;
        const { content } = req.body;
        const noteFile = path.join(NOTES_DIR, `${date}.json`);
        
        if (!content.trim()) {
            try { await fs.unlink(noteFile); } catch {}
            return res.json({ success: true, deleted: true });
        }
        
        await fs.writeFile(noteFile, JSON.stringify({
            date,
            content,
            lastModified: new Date().toISOString()
        }, null, 2));
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save note' });
    }
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));