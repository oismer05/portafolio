import { owner } from '../../../config/owner.js'
import type { MailMessage } from '../../../services/mail/mailer.js'
import {
  button,
  buttonRow,
  detailsTable,
  emailLayout,
  paragraph,
  pill,
  quoteBlock,
  sectionTitle,
} from '../../../services/mail/templates/layout.js'
import { escapeHtml, escapeMultiline } from '../../../shared/html.js'
import { formatReceivedAt, phoneDigits, type ContactEmailData } from './emailData.js'

/**
 * Correo para MÍ (dueño del portafolio) con toda la información del formulario.
 * "Responder" en el cliente de correo le escribe directamente a quien envió el mensaje (replyTo).
 */
export function buildOwnerNotificationEmail(contact: ContactEmailData): MailMessage {
  const receivedAt = formatReceivedAt(contact.receivedAt)
  const replySubject = `Re: tu proyecto de ${contact.service}`
  const mailtoHref = `mailto:${contact.email}?subject=${encodeURIComponent(replySubject)}`
  const whatsappHref = contact.phone ? `https://wa.me/${phoneDigits(contact.phone)}` : null

  const actions = [button({ href: mailtoHref, label: 'Responder por correo' })]
  if (whatsappHref) actions.push(button({ href: whatsappHref, label: 'Escribir por WhatsApp', variant: 'secondary' }))

  const link = (href: string, label: string) => `<a href="${escapeHtml(href)}" style="color:#5b47b8; text-decoration:none;">${escapeHtml(label)}</a>`

  const body = [
    paragraph(`Tienes una nueva solicitud desde tu portafolio. Respóndele pronto: los primeros minutos marcan la diferencia.`),
    buttonRow(actions),

    sectionTitle('Datos de contacto'),
    detailsTable([
      { label: 'Nombre', value: escapeHtml(contact.fullName) },
      { label: 'Correo', value: link(`mailto:${contact.email}`, contact.email) },
      { label: 'Teléfono', value: contact.phone ? link(`tel:+${phoneDigits(contact.phone)}`, contact.phone) : '—' },
      { label: 'Empresa', value: contact.company ? escapeHtml(contact.company) : '—' },
      { label: 'Servicio', value: pill(contact.service) },
      { label: 'Recibido', value: escapeHtml(receivedAt) },
    ]),

    sectionTitle('Su mensaje'),
    quoteBlock(escapeMultiline(contact.message)),
  ].join('\n')

  const html = emailLayout({
    preheader: `${contact.fullName} quiere hablar sobre ${contact.service}`,
    eyebrow: `Nuevo mensaje · #${contact.id}`,
    title: `${contact.fullName} quiere trabajar contigo`,
    subtitle: `Llegó desde el formulario de tu portafolio · ${receivedAt}`,
    body,
    footer: `Notificación automática de tu portafolio · <a href="${escapeHtml(owner.siteUrl)}" style="color:#625f75;">${escapeHtml(owner.siteUrl.replace(/^https?:\/\//, ''))}</a><br>El mensaje quedó guardado con la referencia #${contact.id}.`,
  })

  const text = [
    `Nuevo mensaje desde tu portafolio (#${contact.id})`,
    '',
    `Nombre:   ${contact.fullName}`,
    `Correo:   ${contact.email}`,
    `Teléfono: ${contact.phone ?? '—'}`,
    `Empresa:  ${contact.company ?? '—'}`,
    `Servicio: ${contact.service}`,
    `Recibido: ${receivedAt}`,
    '',
    'Mensaje:',
    contact.message,
  ].join('\n')

  return {
    to: owner.email,
    replyTo: contact.email,
    subject: `💬 Nuevo contacto: ${contact.fullName} — ${contact.service}`,
    html,
    text,
  }
}
