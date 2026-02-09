import { NextResponse } from "next/server";
import { validateBonRequest } from "../../../../../lib/validation";
import { errorResponse } from "../../../../../lib/errorHandler";
const pdfService = require("../../../../../lib/pdf.service");

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = validateBonRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation échouée", details: validation.errors },
        { status: 400 }
      );
    }
    const options = body;
    const pdfBuffer = await pdfService.generatePDF(options);
    const filename = body.documentType === "ATT"
      ? `attestation_${Date.now()}.pdf`
      : `bon_coulage_${(options.etage || "").replace(/\s+/g, "_")}_${Date.now()}.pdf`;
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error(err);
    const { statusCode, body } = errorResponse(err);
    return NextResponse.json(body, { status: statusCode });
  }
}
