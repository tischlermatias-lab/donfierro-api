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

  const {
    nombre,
    empresa,
    email,
    telefono,
    tipoConsulta,
    mensaje,
    referencia,
    linkArchivos,
    files
  } = req.body || {};

  try {
    await resend.emails.send({
      from: 'Don Fierro <cotizaciones@donfierro.com.ar>',
      to: ['matias.tischler@donfierro.com.ar'],
      subject: 'Nueva cotización web',
      html: `
        <h2>Nueva cotización</h2>
        <p><b>Nombre:</b> ${nombre || ''}</p>
        <p><b>Empresa:</b> ${empresa || ''}</p>
        <p><b>Email:</b> ${email || ''}</p>
        <p><b>Teléfono:</b> ${telefono || ''}</p>
        <p><b>Tipo de consulta:</b> ${tipoConsulta || ''}</p>
        <p><b>Mensaje:</b> ${mensaje || ''}</p>
        <p><b>Obra de referencia:</b> ${referencia || ''}</p>
        <p><b>Link de archivos pesados:</b> ${linkArchivos || ''}</p>
      `,
      attachments: Array.isArray(files)
        ? files
            .filter(file => file?.name && file?.content)
            .map(file => ({
              filename: file.name,
              content: file.content
            }))
        : []
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
