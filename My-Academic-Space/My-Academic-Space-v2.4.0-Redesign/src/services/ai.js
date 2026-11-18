// Frontend adapter: never place provider API keys in this file.
export async function askTutor(messages) {
  const response = await fetch('/api/tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `AI Tutor gagal (${response.status}).`);
  if (typeof data.answer !== 'string') throw new Error('Respons AI tidak dikenali.');
  return data.answer;
}
