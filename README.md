# GPT DAILY

Here you will find different kinds of apps that its content daily generated, updated with AI. Using **Gemini**(default) or **ChatGPT**.

## Setup

In according to run this app on your local, you need to provide these environment variables:

1. Database: `DATABASE_URL`, `DIRECT_URL`. I've used Supabase - PostgreSQL, Prisma supports other databases but it could require small tweaks on `schema.prisma`.

2. AI Tokens: You can create respective ai token's from their dashboard.

   - OpenAI: `OPENAI_TOKEN` `OPENAI_ORG`(optional), `OPENAI_PROJECT`(optional)
   - Gemini: `GOOGLE_GEMINI_TOKEN`

3. Cron Secret: `CRON_SECRET`. This is required to run cron jobs safely, prevent outside calls to the endpoint. Use random generated string.

### Almost there...

`npm install`

Now after we have a database connected, run these prisma commands in order:

`npm run prisma:gen`

`npm run migrate:deploy`

To add trivia content, while app is running(`npm run dev`), send request to `/api/generate-trivia` route with your `CRON_SECRET` either from Postman or with a curl like this:

```
curl --location 'http://localhost:3000/api/generate-trivia' \
--header 'authorization: Bearer {your_cron_secret_here}'
```

### Hello

App is now running on https://localhost:3000
