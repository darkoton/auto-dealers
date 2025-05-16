import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/api/vinimg', async (req, res) => {
  const vin = req.query.vin;
  const url = `https://auto-dealers-script.com/test7485/vinimg.php?vin=${encodeURIComponent(vin)}`;

  try {
    const response = await fetch(url);
    const result = await response.json()

    res.json(result);
  } catch (err) {
    res.status(500).send('Ошибка запроса к vinimg.php');
  }
});

app.get('/api/table', async (req, res) => {
  const vin = req.query.vin;
  const url = `https://auto-dealers-script.com/test7485/index.php?vin=${encodeURIComponent(vin)}`;

  try {
    const response = await fetch(url);
    const result = await response.json()

    res.json(result);
  } catch (err) {
    res.status(500).send('Ошибка запроса к index.php');
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
