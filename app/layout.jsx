import { Inter, Poppins } from 'next/font/google'
import './globals.css'

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

// Metadata configuration
export const metadata = {
  title: {
    default: 'Karan Singh Rathore - Freelance IT Project Developer',
    template: '%s | Karan Singh Rathore',
  },
  description: 'Passionate full-stack developer with expertise in modern web technologies. I create scalable, user-friendly applications that solve real-world problems.',
  keywords: [
    'freelance developer',
    'full-stack developer',
    'web development',
    'React',
    'Next.js',
    'Node.js',
    'JavaScript',
    'TypeScript',
    'portfolio',
    'Karan Singh Rathore',
    'IT projects',
    'web applications'
  ],
  authors: [{ name: 'Karan Singh Rathore' }],
  creator: 'Karan Singh Rathore',
  publisher: 'Karan Singh Rathore',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000', // Replace with your actual domain
    title: 'Karan Singh Rathore - Freelance IT Project Developer',
    description: 'Passionate full-stack developer with expertise in modern web technologies. I create scalable, user-friendly applications that solve real-world problems.',
    siteName: 'Karan Singh Rathore Portfolio',
    images: [
      {
        url: '/og-image.jpg', // Add your Open Graph image
        width: 1200,
        height: 630,
        alt: 'Karan Singh Rathore - Freelance IT Project Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karan Singh Rathore - Freelance IT Project Developer',
    description: 'Passionate full-stack developer with expertise in modern web technologies. I create scalable, user-friendly applications that solve real-world problems.',
    creator: '@karansinghrathore', // Replace with your actual Twitter handle
    images: ['/og-image.jpg'], // Add your Twitter card image
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

// Viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f172a' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} scroll-smooth`}>
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Additional meta tags for better SEO */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Karan Singh Rathore",
              "jobTitle": "Freelance IT Project Developer",
              "description": "Passionate full-stack developer with expertise in modern web technologies. I create scalable, user-friendly applications that solve real-world problems.",
              "url": "https://karansinghrathore.com", // Replace with your actual domain
              "sameAs": [
                "https://github.com/karansinghrathore", // Replace with your actual GitHub
                "https://linkedin.com/in/karansinghrathore", // Add your LinkedIn if available
                // Add other social profiles
              ],
              "knowsAbout": [
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Python",
                "Web Development",
                "Full Stack Development",
                "Database Design",
                "API Development"
              ],
              "workLocation": {
                "@type": "Place",
                "name": "Remote"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-slate-900 text-slate-300`}>
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        
        >
          Skip to main content
        </a>
        
        {/* Main content wrapper */}
        <div className="min-h-screen flex flex-col">
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </div>
        
        {/* Remove the Supabase CDN script - we'll use the npm package instead */}
      </body>
    </html>
  )
}