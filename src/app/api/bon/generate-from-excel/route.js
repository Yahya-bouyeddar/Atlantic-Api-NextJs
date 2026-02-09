import { NextResponse } from "next/server";
const excelService = require("../../../../../lib/excel.service");
const pdfService = require("../../../../../lib/pdf.service");

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier uploadé", message: "Veuillez télécharger un fichier Excel" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const validation = excelService.validateExcelFile(buffer);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: validation.error,
        message: validation.error,
        details: validation.details || validation.error,
      }, { status: 400 });
    }
    const validRows = validation.rows.filter((row) => !row._hasError);
    if (validRows.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Aucune ligne valide pour générer le PDF",
        message: "Toutes les lignes contiennent des erreurs",
      }, { status: 400 });
    }
    const reference_2 = formData.get("reference_2")?.toString() || "";
    const ville = formData.get("ville")?.toString() || "Casa";
    const proprietaire = formData.get("proprietaire")?.toString() || "";
    const projet = formData.get("projet")?.toString() || "";
    const adresse = formData.get("adresse")?.toString() || "";
    const pagesData = validRows.map((row) => ({
      etage: row.etage,
      reference: row.reference,
      reference_2,
      date: row.date,
      ville,
      proprietaire,
      projet,
      adresse,
    }));
    const pdfBuffer = await pdfService.generateMultiPagePDF(pagesData);
    if (!Buffer.isBuffer(pdfBuffer)) {
      throw new Error("Erreur lors de la génération du PDF");
    }
    const filename = `bon_coulage_${Date.now()}.pdf`;
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error("PDF Generation Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
