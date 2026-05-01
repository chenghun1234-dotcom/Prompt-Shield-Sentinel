/**
 * Prompt-Shield-Sentinel 🛡️
 * Zero-Cost, Edge-Native Prompt Security API
 */

export interface Env {}

// --- SECURITY MODULES ---
const PII_PATTERNS = {
  SSN_KR: /\b(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01]))-[1-4][0-9]{6}\b/g,
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  PHONE_KR: /\b01[016789][-.]?\d{3,4}[-.]?\d{4}\b/g,
  PHONE_GENERIC: /\b(?:\+?\d{1,3}[-. ]?)?\(?\d{2,4}\)?[-. ]?\d{3,4}[-. ]?\d{4}\b/g,
  SECRET_HINT: /(sk-[a-zA-Z0-9]{20,})/g,
};

function calculateEntropy(str: string): number {
  if (!str) return 0;
  const len = str.length;
  const freq: Record<string, number> = {};
  for (const c of str) freq[c] = (freq[c] || 0) + 1;
  let res = 0;
  for (const c in freq) {
    const p = freq[c] / len;
    res -= p * Math.log2(p);
  }
  return res;
}

function maskText(text: string) {
  let maskedText = text;
  const detections: string[] = [];
  for (const [key, pattern] of Object.entries(PII_PATTERNS)) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(m => {
        if (!detections.includes(key)) detections.push(key);
        maskedText = maskedText.replaceAll(m, `[MASKED_${key}]`);
      });
    }
  }
  const tokens = text.split(/\s+/);
  for (const t of tokens) {
    if (t.length > 16 && calculateEntropy(t) > 4.5) {
      if (!detections.includes('SECRET')) detections.push('SECRET');
      maskedText = maskedText.replaceAll(t, `[MASKED_SECRET]`);
    }
  }
  return { maskedText, detections };
}

// --- HTML UI ---
const UI = `<!DOCTYPE html>
<html>
<head>
    <title>Prompt-Shield-Sentinel</title>
    <style>
        body { background: #0f172a; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding: 50px; }
        .card { background: rgba(30,41,59,0.8); padding: 30px; border-radius: 20px; border: 1px solid #334155; width: 100%; max-width: 600px; }
        textarea { width: 100%; height: 150px; background: #1e293b; border: 1px solid #475569; color: white; padding: 15px; border-radius: 10px; margin: 20px 0; }
        button { width: 100%; padding: 15px; background: #6366f1; border: none; color: white; font-weight: bold; border-radius: 10px; cursor: pointer; }
        #res { margin-top: 20px; padding: 15px; background: #000; border-radius: 10px; min-height: 50px; white-space: pre-wrap; font-family: monospace; }
    </style>
</head>
<body>
    <h1>🛡️ Prompt-Shield-Sentinel</h1>
    <div class="card">
        <textarea id="inp" placeholder="테스트할 텍스트를 입력하세요..."></textarea>
        <button onclick="scan()">Scan & Mask</button>
        <div id="res">결과가 여기에 표시됩니다.</div>
    </div>
    <script>
        async function scan() {
            const btn = document.querySelector('button');
            const res = document.getElementById('res');
            btn.innerText = 'Processing...';
            try {
                const r = await fetch('/v1/scan', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({prompt: document.getElementById('inp').value})
                });
                const d = await r.json();
                res.innerText = JSON.stringify(d, null, 2);
            } catch(e) {
                res.innerText = 'Error: ' + e.message;
            } finally {
                btn.innerText = 'Scan & Mask';
            }
        }
    </script>
</body>
</html>`;

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/") return new Response(UI, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    if (url.pathname === "/v1/scan" && request.method === "POST") {
      const { prompt } = await request.json() as any;
      const start = Date.now();
      const { maskedText, detections } = maskText(prompt);
      return new Response(JSON.stringify({
        masked_prompt: maskedText,
        detections,
        latency_ms: Date.now() - start
      }), { headers: { "Content-Type": "application/json; charset=utf-8" } });
    }
    return new Response("Not Found", { status: 404 });
  }
};
