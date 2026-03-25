const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, email, telefono, localidad, puesto, mensaje, file } = req.body || {};

  try {
    await resend.emails.send({
      from: 'Don Fierro <onboarding@resend.dev>',
      to: ['tischlermatias@gmail.com'],
      subject: 'Nuevo CV recibido',
      html: `
        <h2>Nuevo candidato</h2>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Teléfono:</b> ${telefono}</p>
        <p><b>Localidad:</b> ${localidad}</p>
        <p><b>Puesto:</b> ${puesto}</p>
        <p><b>Mensaje:</b> ${mensaje}</p>
      `,
      attachments: file
        ? [
            {
              filename: file.name,
              content: file.content
            }
          ]
        : []
    });

    return res.status(200).json({ ok: true });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
