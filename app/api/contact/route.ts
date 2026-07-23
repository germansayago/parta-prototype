import { Resend } from "resend";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "Info@parta.com.ar";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "PARTA <onboarding@resend.dev>";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.email !== "string" || !body.email.includes("@")) {
    return Response.json({ error: "Email inválido" }, { status: 400 });
  }

  const { email, phone, message } = body as {
    email: string;
    phone?: string;
    message?: string;
  };

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY no configurada, no se pudo enviar el email");
    return Response.json({ error: "Servicio de email no configurado" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: "Nuevo contacto desde parta.com.ar",
    text: [
      `Email: ${email}`,
      `Teléfono: ${phone || "-"}`,
      "",
      "Mensaje:",
      message || "-",
    ].join("\n"),
  });

  if (error) {
    console.error("[contact] error al enviar email", error);
    return Response.json({ error: "No se pudo enviar el email" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
