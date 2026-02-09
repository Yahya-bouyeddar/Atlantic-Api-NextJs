import { NextResponse } from "next/server";
const templateService = require("../../../../../lib/template.service");

export async function POST(request) {
  try {
    const options = await request.json();
    const html = templateService.generateHTMLBCLG(options);
    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
