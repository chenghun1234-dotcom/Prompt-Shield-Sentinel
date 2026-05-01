# Prompt-Shield-Sentinel Walkthrough 🛡️

Prompt-Shield-Sentinel is a production-ready, zero-cost security API designed for the "Edge First" era. It solves the enterprise privacy problem without the overhead of AI models.

## 📁 Project Structure

- `src/index.ts`: The core security engine. Contains Shannon Entropy calculations, PII Regex, and masking logic.
- `index.html`: A premium, glassmorphic landing page and interactive demo.
- `style.css`: Modern UI design system with vibrant gradients and blur effects.
- `openapi.yaml`: Standard API documentation for RapidAPI integration.
- `wrangler.jsonc`: Cloudflare Workers configuration.

## 🧠 Core Technologies

### 1. Entropy-Based Secret Detection
Instead of matching known API key patterns (which change frequently), we calculate the **Shannon Entropy** of each token.
```typescript
function calculateEntropy(str: string): number {
  // ... math for H(X) = -sum(p(x) * log2(p(x)))
}
```
Tokens with entropy > 4.5 are flagged as `SECRET` and masked. This catches AWS keys, OpenAI keys, and DB passwords automatically.

### 2. High-Speed PII Masking
We use a suite of optimized Regular Expressions to catch:
- Email addresses
- Phone numbers (Global & KR)
- Credit card numbers
- Korean Resident Registration Numbers (SSN)
- IPv4 and MAC addresses
- Bitcoin addresses

### 3. Prompt Injection Defense
We scan for common injection techniques like "Ignore previous instructions" or system prompt extraction attempts before they reach your LLM.

## 🚀 Deployment Guide

### Cloudflare Workers
1. **Login**: `npx wrangler login`
2. **Deploy**: `npx wrangler deploy`

Once deployed, you will get a `.workers.dev` URL.

### RapidAPI Setup
1. Upload `openapi.yaml` to RapidAPI.
2. Configure pricing tiers (Free: 100/day, Pro: $19/mo, Enterprise: $99/mo).
3. Highlight the **Zero-Log Policy** in the description.

## 🛡️ Zero-Log Policy
The entire architecture is stateless.
- **No Database**: We don't store prompts.
- **No Logs**: We don't log the content of the requests.
- **In-Memory**: Data is processed in the worker's memory and released immediately after the response is sent.
