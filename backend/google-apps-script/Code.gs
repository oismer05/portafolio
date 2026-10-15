/**
 * ─────────────────────────────────────────────────────────────
 * Puente de correo del portafolio (Google Apps Script)
 * ─────────────────────────────────────────────────────────────
 * La API (en Railway) no puede usar SMTP, así que envía los correos por HTTPS
 * a este script, que los manda con tu propio Gmail (MailApp).
 *
 * Instalación (ver README, sección "Correos del formulario"):
 *   1. Pega este código en https://script.google.com (proyecto nuevo).
 *   2. Configuración del proyecto → Propiedades del script → agrega
 *      RELAY_SECRET = la misma clave que pondrás en GOOGLE_SCRIPT_SECRET (Railway).
 *   3. Implementar → Nueva implementación → Aplicación web
 *      · Ejecutar como: Yo   · Quién tiene acceso: Cualquier usuario
 *   4. Copia la URL que termina en /exec → GOOGLE_SCRIPT_URL (Railway).
 *
 * Límite gratuito de Google: ~100 destinatarios por día (cuenta Gmail personal).
 */

/** Recibe la petición de la API y envía el correo */
function doPost(e) {
  // Máximo de caracteres aceptados por campo (protege contra abusos)
  var LIMITS = { subject: 250, html: 200000, text: 50000, name: 100 }

  try {
    var payload = JSON.parse(e.postData.contents)

    // 1. Solo la API, que conoce la clave secreta, puede usar este puente
    var expectedSecret = PropertiesService.getScriptProperties().getProperty('RELAY_SECRET')
    if (!expectedSecret || payload.secret !== expectedSecret) {
      return respond({ ok: false, error: 'No autorizado' })
    }

    // 2. Validaciones básicas: un solo destinatario y tamaños razonables
    if (!isValidEmail(payload.to)) return respond({ ok: false, error: 'Destinatario inválido' })
    if (payload.replyTo && !isValidEmail(payload.replyTo)) return respond({ ok: false, error: 'replyTo inválido' })
    if (!payload.subject || !payload.html) return respond({ ok: false, error: 'Faltan el asunto o el contenido' })

    // 3. ¿Queda cupo diario en Gmail?
    if (MailApp.getRemainingDailyQuota() < 1) {
      return respond({ ok: false, error: 'Se agotó el cupo diario de correos de Google' })
    }

    MailApp.sendEmail({
      to: payload.to,
      subject: String(payload.subject).slice(0, LIMITS.subject),
      htmlBody: String(payload.html).slice(0, LIMITS.html),
      body: String(payload.text || '').slice(0, LIMITS.text),
      name: String(payload.fromName || 'Portafolio').slice(0, LIMITS.name),
      replyTo: payload.replyTo || undefined,
    })

    return respond({ ok: true, remainingQuota: MailApp.getRemainingDailyQuota() })
  } catch (error) {
    return respond({ ok: false, error: String(error) })
  }
}

/** Respuesta JSON para la API */
function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)
}

/** Un único correo con formato válido (sin comas ni listas de destinatarios) */
function isValidEmail(value) {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(value)
}
