import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRoutes from './routes/mainRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.resolve(__dirname, '../public');
const indexFile = path.join(publicDir, 'index.html');

app.disable('x-powered-by');
app.set('indexFile', indexFile);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', mainRoutes);
app.use(express.static(publicDir));

app.use((req, res) => {
    res.status(404).send('Pagina no encontrada');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
