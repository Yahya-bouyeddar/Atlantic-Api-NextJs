import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET() {
  try {
    const filename = "bon_template.xlsx";
    const filePath = path.join(process.cwd(), "public", filename);
    const buffer = await fs.readFile(filePath);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Length": String(buffer.length),
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      return NextResponse.json({ message: "Template Excel introuvable" }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
