export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.email !== "string" || !body.email.includes("@")) {
    return Response.json({ error: "Email inválido" }, { status: 400 });
  }

  if (typeof body.phone !== "string" || !body.phone.trim()) {
    return Response.json({ error: "Teléfono requerido" }, { status: 400 });
  }

  if (typeof body.message !== "string" || !body.message.trim()) {
    return Response.json({ error: "Mensaje requerido" }, { status: 400 });
  }

  // TODO: conectar a un proveedor real (Resend, SMTP, CRM, etc).
  // Por ahora solo logueamos server-side para no perder los envíos.
  console.log("[contact] nuevo lead", {
    email: body.email,
    phone: body.phone ?? null,
    message: body.message ?? null,
  });

  return Response.json({ ok: true });
}
