import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import { getUserFromSessionToken, SESSION_COOKIE } from "@/lib/session";

export const metadata: Metadata = {
  title: "Scale Army SOP Handbook",
  description: "Internal knowledge base for Scale Army SOPs.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserFromSessionToken(cookies().get(SESSION_COOKIE)?.value);

  return (
    <html lang="en">
      <body>
        {children}
        {/* Chat is site-wide but only rendered for signed-in users; the
            middleware gate already blocks unauthenticated requests from
            reaching any page except /login and /admin, but this avoids
            rendering the widget on those pages themselves too. */}
        {user && <ChatWidget />}
      </body>
    </html>
  );
}
