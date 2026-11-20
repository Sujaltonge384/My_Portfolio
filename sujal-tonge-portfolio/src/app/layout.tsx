import type { Metadata } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans, Syne } from 'next/font/google';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { CustomCursor } from '@/components/motion/CustomCursor';
import { TerminalPreloader } from '@/components/motion/TerminalPreloader';
import '@/styles/globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Sujal Tonge — Full Stack Software Developer & AI Architect',
  description:
    'Portfolio of Sujal Tonge, Full Stack Software Developer specializing in React.js, Next.js, Node.js, FastAPI, PostgreSQL, pgvector, and OpenCLIP AI systems.',
};

const THEME_INIT_SCRIPT = `
  try {
    var savedTheme = localStorage.getItem('sujal-portfolio-theme');
    if (savedTheme === 'blue-pink' || savedTheme === 'orange') {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'blue-pink');
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'blue-pink');
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="blue-pink"
      suppressHydrationWarning
      className={`${syne.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <SmoothScrollProvider>
          <TerminalPreloader />
          <CustomCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}