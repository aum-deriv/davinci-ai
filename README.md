# Langflow UI

## Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Update the `.env` file with your credentials:
```env
VITE_ASTRA_DB_TOKEN=your_astra_db_token_here
VITE_FLOW_ID=your_flow_id_here
VITE_LANGFLOW_ID=your_langflow_id_here
```

3. Make sure `.env` is in your `.gitignore` to prevent committing sensitive data.

## Security Best Practices

1. Never commit `.env` files containing real credentials
2. Use `.env.example` as a template with placeholder values
3. Keep your tokens secure and rotate them regularly
4. Use environment-specific files (.env.development, .env.production) as needed

## Development

```bash
npm install
npm run dev
