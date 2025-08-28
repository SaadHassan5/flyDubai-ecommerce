# Environment Setup

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` with your values:**
   ```bash
   API_URL=https://your-api-domain.com
   API_KEY=your_actual_api_key
   ```

3. **Restart your dev server:**
   ```bash
   npm start
   ```

## Usage in Code

```typescript
import { ENV } from '@/config/env';

// Use your environment variables
const apiUrl = ENV.API_URL;
const apiKey = ENV.API_KEY;

// Storage keys
const favoritesKey = ENV.STORAGE_FAVORITES;
const cartKey = ENV.STORAGE_CART_ITEMS;
```

That's it! Simple and clean. 🎯
