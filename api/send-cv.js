export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nombre, email, telefono, mensaje } = req.body;

  console.log("Nuevo candidato:", {
    nombre,
    email,
    telefono,
    mensaje,
  });

  return res.status(200).json({ ok: true });
}
