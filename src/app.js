import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRoutes from './routes/mainRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', mainRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo profesionalmente en http://localhost:${PORT}`);
});
