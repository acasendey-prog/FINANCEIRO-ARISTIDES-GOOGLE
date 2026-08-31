import express from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory store for blob data (replaces @netlify/blobs)
const memoryStore = new Map();

const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

function igualSeguro(a, b) {
  try {
    const A = Buffer.from(String(a));
    const B = Buffer.from(String(b));
    if (A.length !== B.length) return false;
    return crypto.timingSafeEqual(A, B);
  } catch {
    return false;
  }
}

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'authorization, content-type');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// /api/dados handler
app.get('/api/dados', (req, res) => {
  const auth = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  const esperado = process.env.AUTH_TOKEN_SHA;

  if (esperado && (!auth || !igualSeguro(sha(auth), esperado))) {
    return res.status(401).json({ erro: 'nao_autorizado' });
  }

  const reg = memoryStore.get('financeiro:base');
  if (!reg) {
    return res.json({ vazio: true, rev: 0 });
  }
  return res.json(reg);
});

app.put('/api/dados', (req, res) => {
  const auth = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  const esperado = process.env.AUTH_TOKEN_SHA;

  if (esperado && (!auth || !igualSeguro(sha(auth), esperado))) {
    return res.status(401).json({ erro: 'nao_autorizado' });
  }

  const corpo = req.body;
  const { pacote, revEsperada, dispositivo } = corpo || {};
  if (!pacote || !pacote.ct) {
    return res.status(400).json({ erro: 'pacote_ausente' });
  }

  const atual = memoryStore.get('financeiro:base');
  const revAtual = atual ? (atual.rev || 0) : 0;

  if (revEsperada !== undefined && revEsperada !== null && revEsperada !== revAtual) {
    return res.status(409).json({
      erro: 'conflito',
      rev: revAtual,
      atualizadoEm: atual?.atualizadoEm,
      servidor: atual
    });
  }

  const novo = {
    rev: revAtual + 1,
    atualizadoEm: new Date().toISOString(),
    dispositivo: String(dispositivo || '').slice(0, 60),
    pacote
  };
  memoryStore.set('financeiro:base', novo);
  return res.json({ ok: true, rev: novo.rev, atualizadoEm: novo.atualizadoEm });
});

// Static assets serving
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.webmanifest')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
}));

// Fallback to index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
