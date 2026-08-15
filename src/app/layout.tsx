import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Scale Army SOP Handbook",
  description: "Internal knowledge base for Scale Army SOPs.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        {children}
        {/* Chat is site-wide but only rendered for signed-in users; the
            middleware gate already blocks unauthenticated requests from
            reaching any page except /login, but this avoids rendering the
            widget on the login page itself too. */}
        {session && <ChatWidget />}
      </body>
    </html>
  );
}
