// TODO: Define route to serve index.html
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

//(req: request, response )
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
//changes / to * line 9
router.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname,'../../../client/dist/index.html'), (err) => {
        if (err) {
        console.error('Error sending index.html:', err);
        res.status(500).send('Error sending the index.html file.');
        }
    })
});

export default router;
