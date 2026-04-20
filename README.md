# The Surprising Keto Journey — Setup Guide
# surprisingketo.com

## STEP 1 — Create a GitHub account
Go to https://github.com and sign up for a free account.

## STEP 2 — Create a new repository
- Click "New repository"
- Name it: surprising-keto
- Set to Public
- Click "Create repository"
- Upload all files from this folder to the repository

## STEP 3 — Connect to Netlify
- Go to https://netlify.com and sign up (free) with your GitHub account
- Click "Add new site" → "Import an existing project"
- Select GitHub → select your surprising-keto repository
- Click "Deploy site"
- Your site will be live at a Netlify URL within 2 minutes

## STEP 4 — Connect your custom domain
- In Netlify: Site settings → Domain management → Add custom domain
- Type: surprisingketo.com
- Follow the DNS instructions (you'll update nameservers at your domain registrar)
- SSL certificate is automatic and free

## STEP 5 — Set up Supabase (database for subscribers and submissions)
- Go to https://supabase.com and sign up (free)
- Create a new project named "surprising-keto"
- Go to SQL Editor and run these commands:

  CREATE TABLE subscribers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name text,
    email text UNIQUE NOT NULL,
    country text,
    state_province text,
    how_found text,
    created_at timestamptz DEFAULT now()
  );

  CREATE TABLE submissions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    submitter_name text,
    submitter_email text,
    title text,
    cuisine text,
    protein text,
    category text,
    net_carbs text,
    serves text,
    time text,
    methods text,
    ingredients text,
    steps text,
    notes text,
    source text,
    status text DEFAULT 'pending',
    created_at timestamptz DEFAULT now()
  );

- Go to Settings → API
- Copy your Project URL and anon/public key
- Open /js/app.js and replace:
    const SUPABASE_URL  = 'YOUR_SUPABASE_URL';
    const SUPABASE_ANON = 'YOUR_SUPABASE_ANON_KEY';
  with your actual values

## STEP 6 — Set up Mailchimp (email notifications)
- Go to https://mailchimp.com and sign up (free to 500 subscribers)
- Create an Audience named "Surprising Keto Subscribers"
- Go to Account → Extras → API Keys → Create a key
- In the admin panel → Send notification, the Mailchimp API integration sends campaigns
- Full Mailchimp API docs: https://mailchimp.com/developer/

## STEP 7 — Apply for Google AdSense
- Publish at least 20-30 recipe pages first
- Go to https://adsense.google.com and apply with surprisingketo.com
- Add your privacy policy link (already at /privacy/)
- Once approved (2-4 weeks), replace the "Advertisement" placeholder divs with your AdSense code

## STEP 8 — Change the admin password
- Open /admin/index.html
- Find: const ADMIN_PASS = 'surprisingketo2026';
- Change to a strong password of your choice
- For better security, set up Netlify Identity (free): https://docs.netlify.com/visitor-access/identity/

## ADDING RECIPES
1. Log in to /admin/
2. Click "Add recipe" in the sidebar
3. Fill in all fields
4. Click "Save recipe" — copy the JSON output
5. Open /js/data.js
6. Add the JSON to the RECIPES array (before the closing bracket)
7. Commit and push to GitHub — Netlify redeploys automatically in ~1 minute

## QUESTIONS
Email: admin@surprisingketo.com
