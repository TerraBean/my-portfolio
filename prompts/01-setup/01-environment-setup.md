# Environment Setup

## Required Environment Variables

```env
# API Keys
EXA_API_KEY=your_exa_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Feature Flags
NEWS_SCRAPING_ENABLED=true

# Optional: Admin User ID for automated posts
ADMIN_USER_ID=your_admin_user_id
```

## Configuration Steps

1. Create or update `.env.local` with the required variables
2. Obtain API keys:
   - Exa API: Sign up at https://exa.ai
   - Google AI: Get API key from https://makersuite.google.com
3. Set the admin user ID for automated posts
4. Enable the news scraping feature flag

## Validation

Test your configuration by:
1. Verifying API key validity
2. Checking environment variable loading
3. Confirming admin user exists in the database
