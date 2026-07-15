/* Puente de lectura: evita el bloqueo cross-origin de Drive en el navegador. */
const ALLOWED_FILES = new Set([
  "1NkD6efydhQuRafz4FOp-INaSiCnk3WHo", "11Y7PkWls6-f-RKhUoB61CxhM1vKacKiu", "10a9xOJEYg9zrL2-3RfaYyX400iMSHuMv", "11_SfET4B0UEvN14d5uMdR4ZoZ-BcarLM",
  "1nTKqRpO6B_KSV3z3DvKTSBSDDQitjFvx", "13lHeUIgTeOAKpFSAUKL7vKnUXrwFU4V9", "1v5g_QVggts1iZ2t7OIqAdnuF4KcLbhTi", "1Vbpgcztzp-F-tFeP2h5eS8DqvN9FFh9C",
  "17EL9A-QRg8hPzLEtjWjNStD5tHsHyKoJ", "1fmxLPae-qvLc3so7R4_bnKmQ1JGJ-OWn", "1xZh3tEHVWNnYN7ee5l31tp9We-dR4MNm", "18J9bDqahKwH8kX40WnpvmjdAjz5LWlqP",
  "1FS-mZg4C2HZ_WurikCgIha5HdOkmbWP4", "1KuivUW3P3a7EfwoLaiS5Gg2IACSDN4kU", "10cO999RgA7gYFn5o1BSdR6EHT88GTE-d", "1r4KrmoWOjrUSeGNb4OXaAND-xhL6aKKw",
  "1tLc4D5B1cPPhHgZt35TSIjEvIcNoyDwf", "1UeSHeGGz9fD0lUcoGVjgtUn7Os_9LMpq", "1sFiTTDxuN6FoaC_JSbOSyiuIOL3LCUt9", "1Ur5dl0Ls4H0eNAts8wlqwTBgXfXWl9U0",
  "1aL0tKMkxBXU-VvVpKqAch21xKWoh6ZsT", "16H5BAiTUEYvHHRbJlE8fzn17nf-TshDe", "10ZSCOkJ5VoOTyAQDgiiRUxV7dcMLxYko", "1vzCYosfvg7yPWOoZn3jICIeCKm1lEKmz"
]);

module.exports = async function handler(request, response) {
  const id = String(request.query.id || "");
  const start = Number(request.query.start);
  const end = Number(request.query.end);

  if (!ALLOWED_FILES.has(id) || !Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || end - start >= 4 * 1024 * 1024) {
    return response.status(400).json({ error: "Solicitud no válida" });
  }

  try {
    const driveUrl = "https://drive.usercontent.google.com/download?id=" + encodeURIComponent(id) + "&export=download&confirm=t";
    const driveResponse = await fetch(driveUrl, { headers: { Range: "bytes=" + start + "-" + end } });
    if (driveResponse.status !== 206) return response.status(502).json({ error: "Drive no entregó el bloque solicitado" });

    const bytes = Buffer.from(await driveResponse.arrayBuffer());
    response.setHeader("Content-Type", "application/octet-stream");
    response.setHeader("Content-Length", String(bytes.length));
    response.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800");
    return response.status(206).send(bytes);
  } catch (error) {
    return response.status(502).json({ error: "No se pudo obtener el bloque" });
  }
};
