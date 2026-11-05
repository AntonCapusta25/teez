# Rijschool TEEZ — React + Supabase Replica

This project is a 1-to-1 modern replica of the **Rijschool TEEZ** website ([rijschoolteez.nl](https://rijschoolteez.nl)), rebuilt in **React (TypeScript) + Vite**, with zero WordPress dependencies, and pre-configured for **Supabase** backend and **Vercel** hosting.

---

## 🚀 Quick Start

### 1. Run Locally
```bash
cd rijschool-teez
npm install
npm run dev
```
Open [http://localhost:5188](http://localhost:5188) in your browser.

---

## 🗄️ Supabase Setup (Database & Forms)

The app works **out-of-the-box in local development mode** (storing submissions in `localStorage` for testing). To connect your real Supabase project:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the SQL script in:
   `supabase/schema.sql`
   This creates:
   - `trial_lessons` (Gratis proefles requests)
   - `registrations` (Aanmeldingsformulier met pakketkeuze)
   - `contact_messages` (Contact formulier & terugbelverzoeken)
3. Copy `.env.example` to `.env` and fill in your keys:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart `npm run dev`. Submissions will now insert directly into Supabase!

---

## 🌐 Deploy to Vercel

### Option A: Using Vercel CLI
```bash
npx vercel
```
Follow the prompts (set Framework Preset to **Vite**). Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Environment Variables in Vercel settings.

### Option B: Git Push to GitHub
1. Push `rijschool-teez` to a GitHub repo.
2. In Vercel, click **Import Project**, select the repository, and deploy.
3. In your Vercel project settings under **Domains**, add `rijschoolteez.nl`.

---

## 📄 Replicated Pages & Content

| Page | URL Hash | Original Source / Notes |
|------|----------|-------------------------|
| **Home** | `/#home` | Hero with Hyundai i30, floating gratis proefles form, 3 USP cards (Vaste instructeur, Flexibele tijden, Termijnbetaling), package highlights |
| **Over TEEZ** | `/#over-teez` | Exact story & photo of instructor with the lesson car, CBR Enschede/Hengelo exam area info |
| **Tarieven** | `/#tarieven` | Pakket T (€1.550), Pakket EE (€2.050), Pakket Z (€2.470), Losse rijles (€55,-) & Opfriscursus (€300,-) |
| **De lesauto** | `/#de-lesauto` | Hyundai i30 (NX-539-F) gallery and specifications |
| **Aanmelden** | `/#aanmelden` | Full 10-field registration form (replicated from WPForm 301) with package selector |
| **FAQ** | `/#faq` | Expandable accordion with the original 6 questions & answers |
| **Contact** | `/#contact` | Company info, CBR registration #2098W1, KvK, BTW, Google Maps embed, and contact form |
| **Terugbellen** | Modal | "Bel mij" header button opens instant callback modal |
| **Footer** | Global | Dation Rijlesplanner and CBR Machtigen badges & links |
