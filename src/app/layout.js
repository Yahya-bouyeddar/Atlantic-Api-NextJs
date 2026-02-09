import "./globals.css";

export const metadata = {
  title: "ATLANTIC ETUDES - Génération PDF",
  description: "Plateforme de génération de documents professionnels",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
