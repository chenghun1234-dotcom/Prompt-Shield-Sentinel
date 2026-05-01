# 🛡️ Prompt-Shield-Sentinel

**The Zero-Cost, Edge-Native AI Security Layer.**

Prompt-Shield-Sentinel is a rule-based security engine designed to protect corporate data from leaking into LLMs. It operates entirely at the edge (Cloudflare Workers), ensuring sub-10ms latency with **Zero Operating Costs** and a **Zero-Log Policy**.

## 🚀 Key Features

- **PII Masking**: Automatically detects and masks emails, phone numbers, SSNs, credit cards, and more.
- **Secret Scanning**: Uses Shannon Entropy analysis to detect API keys, passwords, and database connection strings without needing an AI model.
- **Injection Defense**: Blocks common prompt injection patterns and system prompt leakage attempts.
- **Edge-Native**: Runs on Cloudflare Workers Free Tier (100k free requests/day).
- **Rule-Based (AI-Free)**: No expensive model calls. 100% deterministic and ultra-fast.
- **Privacy-First**: No data is logged. All processing happens in-memory and is discarded immediately.

## 🛠️ Technical Stack

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Security Engine**: Shannon Entropy Algorithm + Optimized Regex
- **Documentation**: OpenAPI 3.0 / RapidAPI ready

## 📈 Monetization Strategy (RapidAPI)

| Tier | Price | Requests | Features |
|------|-------|----------|----------|
| **Free** | $0 | 100/day | Basic PII & Secret scanning |
| **Pro** | $19/mo | Unlimited | Advanced Patterns, Higher Priority |
| **Enterprise**| $99/mo | Custom | Dedicated Support, Custom Whitelists |

## 📦 Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run locally with Wrangler:
   ```bash
   npx wrangler dev
   ```

### Deployment

Deploy to Cloudflare:
```bash
npx wrangler deploy
```

## 📄 License

MIT
