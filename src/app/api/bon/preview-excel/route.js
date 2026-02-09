import { NextResponse } from "next/server";
const excelService = require("../../../../../lib/excel.service");

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier uploadé", message: "Veuillez télécharger un fichier Excel (.xlsx, .xls)" },
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
        error: "Aucune ligne valide",
        message: "Toutes les lignes contiennent des erreurs",
        details: validation.details,
      }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      rowCount: validRows.length,
      rows: validRows,
      message: `${validRows.length} ligne(s) valide(s) trouvée(s)`,
    });
  } catch (err) {
    console.error("Preview error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
