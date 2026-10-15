import { owner } from '../../../config/owner.js'
import type { MailMessage } from '../../../services/mail/mailer.js'
import {
  button,
  buttonRow,
  detailsTable,
  divider,
  emailLayout,
  paragraph,
  pill,
  sectionTitle,
  signature,
  steps,
} from '../../../services/mail/templates/layout.js'
import { escapeHtml } from '../../../shared/html.js'
import { formatReceivedAt, safeFirstName, type ContactEmailData } from './emailData.js'

/**
 * Correo de confirmación para la PERSONA que llenó el formulario.
 *
 * Seguridad: este correo va a una dirección que escribió un desconocido, así que
 * NO repite su mensaje ni su nombre completo. Solo usa el primer nombre (letras)
 * y el servicio (que el backend valida contra una lista cerrada). Así nadie puede
 * usar el formulario para enviar spam a terceros "a nombre" del portafolio.
 */
export function buildClientConfirmationEmail(contact: ContactEmailData): MailMessage {
  const firstName = safeFirstName(contact.fullName)
  const greeting = firstName ? `¡Gracias por escribirme, ${firstName}!` : '¡Gracias por escribirme!'
  const whatsappHref = `https://wa.me/${owner.whatsappNumber}?text=${encodeURIComponent(
    `Hola Oismer, te escribí desde tu portafolio (referencia #${contact.id}).`,
  )}`

  const body = [
    paragraph(`Hola${firstName ? ` <strong>${escapeHtml(firstName)}</strong>` : ''}, soy ${escapeHtml(owner.firstName)}.`),
    paragraph(
      `Recibí tu solicitud sobre ${pill(contact.service)} y ya la estoy revisando. ` +
        `<strong>Me pondré en contacto contigo muy pronto</strong>, normalmente en menos de 24 horas hábiles, ` +
        `para conversar sobre lo que necesitas.`,
    ),

    sectionTitle('Resumen de tu solicitud'),
    detailsTable([
      { label: 'Servicio', value: escapeHtml(contact.service) },
      { label: 'Enviado', value: escapeHtml(formatReceivedAt(contact.receivedAt)) },
      { label: 'Referencia', value: `#${contact.id}` },
    ]),

    sectionTitle('¿Qué sigue?'),
    steps([
      { title: 'Reviso tu solicitud', text: 'Analizo lo que me contaste para llegar preparado a nuestra conversación.' },
      { title: 'Te contacto', text: 'Agendamos una charla breve para entender tu proceso y tus objetivos.' },
      { title: 'Recibes una propuesta', text: 'Alcance y tiempos claros, sin letra pequeña.' },
    ]),

    paragraph('Si es algo urgente, puedes escribirme directamente por WhatsApp:'),
    buttonRow([
      button({ href: whatsappHref, label: 'Escribir por WhatsApp' }),
      button({ href: `${owner.siteUrl}/#proyectos`, label: 'Ver mis proyectos', variant: 'secondary' }),
    ]),

    divider(),
    signature(),
  ].join('\n')

  const siteHost = owner.siteUrl.replace(/^https?:\/\//, '')
  const html = emailLayout({
    preheader: `Recibí tu mensaje${firstName ? `, ${firstName}` : ''}. Te escribiré muy pronto.`,
    eyebrow: 'Mensaje recibido ✓',
    title: greeting,
    subtitle: 'Tu mensaje llegó correctamente y ya está en mis manos.',
    body,
    footer: `Recibiste este correo porque enviaste el formulario de contacto en <a href="${escapeHtml(owner.siteUrl)}" style="color:#625f75;">${escapeHtml(siteHost)}</a>.<br>Si no fuiste tú, puedes ignorarlo con tranquilidad.`,
  })

  const text = [
    greeting,
    '',
    `Hola${firstName ? ` ${firstName}` : ''}, soy ${owner.firstName}.`,
    `Recibí tu solicitud sobre "${contact.service}" y ya la estoy revisando.`,
    'Me pondré en contacto contigo muy pronto, normalmente en menos de 24 horas hábiles.',
    '',
    `Referencia: #${contact.id}`,
    '',
    `¿Urgente? Escríbeme por WhatsApp: ${owner.phoneDisplay}`,
    '',
    `${owner.fullName}`,
    `${owner.role} · ${owner.location}`,
    owner.siteUrl,
  ].join('\n')

  return {
    to: contact.email,
    replyTo: owner.email,
    subject: `Recibí tu mensaje${firstName ? `, ${firstName}` : ''} — te contactaré muy pronto`,
    html,
    text,
  }
}
