import { NextResponse } from "next/server";

export async function GET(request) {
  const url = request.nextUrl || request.url;
  const baseUrl = url ? new URL(url).origin : "";
  const docs = {
    title: "BON DE COULAGE API Documentation",
    version: "2.0.0",
    baseUrl,
    endpoints: [
      { method: "POST", path: "/api/bon/generate", description: "Générer un PDF BON DE COULAGE (single page)" },
      { method: "POST", path: "/api/bon/generate-from-excel", description: "Générer un PDF multi-pages à partir d'un fichier Excel", contentType: "multipart/form-data" },
      { method: "POST", path: "/api/bon/preview-excel", description: "Preview Excel avant PDF", contentType: "multipart/form-data" },
      { method: "POST", path: "/api/bon/preview", description: "Aperçu HTML", body: "Same as /generate" },
      { method: "GET", path: "/api/bon/template", description: "Télécharger le template Excel" },
    ],
    types_etage: ["FONDATIONS", "PL.HT. S/SOL", "SOUPENTE", "PL.HT. R.D.CH", "PL.HT. 1° ETAGE", "PL.HT. 2° ETAGE", "PL.HT. 3° ETAGE"],
  };
  return NextResponse.json(docs);
}
