import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Resource } from "sst";
import { RealtimeProvider } from "@/lib/realtime-provider";
import type { MqttConfig } from "@warsawjs/core/realtime";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WarsawJS Admin Panel",
  description: "Control panel for WarsawJS live demo presentation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side only: access SST Resources
  const realtimeConfig: MqttConfig = {
    endpoint: Resource.Realtime.endpoint,
    authorizerToken: Resource.RealtimeAuthorizerToken.value,
    authorizerName: Resource.Realtime.authorizer || 'RealtimeAuthorizer',
    appName: Resource.App.name,
    stage: Resource.App.stage,
  };

  console.log('[Layout] Realtime config:', {
    endpoint: realtimeConfig.endpoint,
    authorizerName: realtimeConfig.authorizerName,
    appName: realtimeConfig.appName,
    stage: realtimeConfig.stage,
    hasToken: !!realtimeConfig.authorizerToken
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <RealtimeProvider config={realtimeConfig}>
            {children}
          </RealtimeProvider>
        </Providers>
      </body>
    </html>
  );
}
