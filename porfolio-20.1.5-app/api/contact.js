import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // 1. Configurar CORS (Seguridad)
  // Reemplaza 'tu-usuario.github.io' por tu URL real de GitHub Pages
  res.setHeader("Access-Control-Allow-Origin", "https://JorgePR91.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejar la petición de pre-vuelo de los navegadores
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Mètode no permés" });
  }

  try {
    const { nom, correu, text, telefon } = req.body;

    if (!nom || !correu || !text) {
      return res.status(400).json({ error: "Camps requerits buits" });
    }

    // 2. Enviar el correo usando Resend
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>", // Deja esto así si no tienes dominio propio
      to: "jorgeperiguell@gmail.com",
      subject: `Sol·licitud de contacte via Porfoli`,
      html: `<p><strong>Nom:</strong> ${nom}</p>
           <p><strong>Correu:</strong> ${correu}</p>
           <p><strong>Telèfon:</strong> ${telefon}</p>
           <p><strong>Missatge:</strong> ${text}</p>`,
    });

    return res.status(200).json({ success: "Missatge enviat correctament" });
  } catch (error) {
    return res.status(500).json({ error: "Error al enviar l'email" });
  }
}
