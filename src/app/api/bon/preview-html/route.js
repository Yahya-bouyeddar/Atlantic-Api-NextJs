import { NextResponse } from "next/server";
const templateService = require("../../../../../lib/template.service");

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl || new URL(request.url);
    const type = searchParams.get("type") || "BCLG";
    const defaultOptions = {
      date: new Date().toLocaleDateString("fr-FR"),
      ville: "Casa",
      reference: "MM/BC/1107/24",
      reference_2: "BA 318/24",
      proprietaire: "SOCIETE ARIF LOGEMENT S.A.R.L. AU.",
      projet: "CONSTRUCTION D'UN IMMEUBLE EN S/SOL + R.D.CH. + SOUPENTE + 3 ETAGES.",
      adresse: "LOTISSEMENT AL MAMOUNIA LOT N° 3 SIDI HAJJAJ OUED HASSAR. T.F. N° 12231/85.",
    };
    let html;
    if (type === "ATT") {
      html = templateService.generateHTMLATT({ ...defaultOptions, title: "ATTESTATION DE CONFORMITE" });
    } else {
      html = templateService.generateHTMLBCLG({
        ...defaultOptions,
        title: "BON DE COULAGE",
        etage: "1° ETAGE",
        notes: ["Augmenter le nombre d'étai.", "Bien caler les fonds de poutres", "Mettre les calles sur les poutres."],
      });
    }
    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Preview error:", err);
    return new NextResponse(
      `<html><body><h1>Erreur</h1><pre>${err.message}</pre></body></html>`,
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}
