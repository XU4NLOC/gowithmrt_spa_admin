import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { AuthenticatedLayout } from "@/components/Layouts/AuthenticatedLayout";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | GoWithMRT Back Office",
    default: "GoWithMRT Back Office",
  },
  description: "GoWithMRT Back Office: Admin management platform for analytics, monitoring, and customer management."
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remove browser extension attributes that cause hydration issues
              (function() {
                if (typeof window !== 'undefined') {
                  const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'attributes') {
                        const target = mutation.target;
                        if (target && target.hasAttribute && target.hasAttribute('bis_skin_checked')) {
                          target.removeAttribute('bis_skin_checked');
                        }
                      }
                    });
                  });
                  
                  document.addEventListener('DOMContentLoaded', function() {
                    observer.observe(document.body, {
                      attributes: true,
                      subtree: true,
                      attributeFilter: ['bis_skin_checked']
                    });
                    
                    // Remove any existing bis_skin_checked attributes
                    const elements = document.querySelectorAll('[bis_skin_checked]');
                    elements.forEach(el => el.removeAttribute('bis_skin_checked'));
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </Providers>
      </body>
    </html>
  );
}
