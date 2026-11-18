// Vercel serverless function. Configure AI_API_URL, AI_API_KEY and AI_MODEL in Vercel.
// AI_API_URL must point to an OpenAI-compatible Chat Completions endpoint.
const MAX_BODY = 32_000;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 8_000;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { AI_API_URL, AI_API_KEY, AI_MODEL } = process.env;
  if (!AI_API_URL || !AI_API_KEY || !AI_MODEL) {
    return res.status(503).json({ error: 'AI Tutor belum dikonfigurasi. Atur AI_API_URL, AI_API_KEY, dan AI_MODEL di Environment Variables Vercel.' });
  }

  let raw;
  try {
    raw = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Format permintaan tidak valid.' });
  }
  const messages = raw && Array.isArray(raw.messages) ? raw.messages : [];
  if (!messages.length || messages.length > MAX_MESSAGES) {
    return res.status(400).json({ error: `Kirim 1 sampai ${MAX_MESSAGES} pesan.` });
  }
  const safeMessages = [];
  for (const item of messages) {
    if (!item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string' || !item.content.trim() || item.content.length > MAX_MESSAGE_CHARS) {
      return res.status(400).json({ error: 'Ada pesan dengan format atau panjang yang tidak valid.' });
    }
    safeMessages.push({ role: item.role, content: item.content.trim() });
  }

  const system = `Kamu adalah AI Learning Tutor di My Academic Space. Ajarkan dengan sabar, terstruktur, dan sesuai tingkat pemula bila tingkat pengguna belum diketahui. Jawab dalam bahasa Indonesia kecuali pengguna meminta bahasa lain. Saat menjelaskan: (1) jelaskan konsep, (2) beri contoh praktis, (3) berikan satu latihan, (4) tunggu jawaban pengguna sebelum menilai. Jangan mengaku telah membaca buku atau file yang tidak diberikan dalam konteks percakapan. Jika pertanyaan membutuhkan isi buku yang belum disediakan, minta pengguna mengutip atau mengunggah bagian relevan. Jangan mengklaim menyimpan progress atau mengakses database.`;

  try {
    const upstream = await fetch(AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AI_API_KEY}` },
      body: JSON.stringify({ model: AI_MODEL, messages: [{ role: 'system', content: system }, ...safeMessages], temperature: 0.4 })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error('AI provider error:', upstream.status, data && data.error ? data.error : 'No error detail');
      return res.status(502).json({ error: 'Penyedia AI menolak permintaan. Periksa URL, model, API key, dan kuota provider.' });
    }
    const answer = data?.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) {
      return res.status(502).json({ error: 'Respons AI tidak sesuai format Chat Completions.' });
    }
    return res.status(200).json({ answer: answer.trim() });
  } catch (error) {
    console.error('AI request failed:', error && error.message);
    return res.status(502).json({ error: 'Tidak dapat menghubungi penyedia AI saat ini.' });
  }
};
