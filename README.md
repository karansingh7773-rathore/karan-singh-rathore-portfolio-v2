This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Project Structure: Karan Singh Rathore Portfolio

```
my-portfolio-v2/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js         # API route for AI assistant (OpenRouter integration)
│   ├── components/
│   │   └── chatbot.jsx          # Floating AI assistant chat UI
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.jsx         # Dynamic project detail page (fetches from Supabase)
│   ├── styles/
│   │   └── animations.css       # Custom CSS animations for UI
│   ├── globals.css              # Global Tailwind CSS styles
│   ├── layout.js                # Root layout, imports global styles and sets up fonts/metadata
│   ├── page.jsx                 # Main portfolio homepage (lists projects, bio, etc.)
├── components/
│   └── chatbot.jsx              # (duplicate for legacy, main one is in app/components)
├── lib/
│   └── supabase.js              # Supabase client configuration
├── public/
│   ├── favicon.ico              # Favicon
│   ├── favicon.svg              # SVG Favicon
│   ├── apple-touch-icon.png     # Apple touch icon
│   ├── manifest.json            # PWA manifest
│   └── og-image.jpg             # Open Graph image for SEO/social sharing
├── .env.local                   # Environment variables (Supabase keys, OpenRouter API key)
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project structure and file roles (this file)
```

## Folder & File Roles

- **app/**: Main Next.js app directory (App Router). Contains all pages, layouts, styles, and API routes.
  - **api/chat/route.js**: Handles backend AI chat requests using OpenRouter API.
  - **components/chatbot.jsx**: Floating chat assistant UI, interacts with `/api/chat`.
  - **projects/[slug]/page.jsx**: Dynamic project detail page, fetches project data from Supabase using the slug.
  - **styles/animations.css**: Custom CSS for UI animations.
  - **globals.css**: Global Tailwind CSS styles for the app.
  - **layout.js**: Root layout, sets up fonts, metadata, and imports global styles.
  - **page.jsx**: Main homepage, lists portfolio projects and bio.

- **components/**: (Legacy/extra) May contain shared React components.

- **lib/supabase.js**: Supabase client setup for database access.

- **public/**: Static assets (icons, manifest, images).

- **.env.local**: Stores environment variables (Supabase keys, OpenRouter API key).

- **tailwind.config.js**: Tailwind CSS configuration for scanning files and extending theme.

- **tsconfig.json**: TypeScript configuration for the project.

- **README.md**: This file. Explains the project structure and the role of each file/folder.

---

**Note:**  
- All AI assistant logic is handled in `app/api/chat/route.js` (backend) and `app/components/chatbot.jsx` (frontend).
- Project data is fetched from Supabase and displayed in dynamic routes under `app/projects/[slug]/page.jsx`.
- Styling is managed via Tailwind CSS and custom CSS in `app/styles/animations.css`.
