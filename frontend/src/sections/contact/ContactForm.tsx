import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { TurnstileWidget } from '@/components/ui/TurnstileWidget'
import { siteConfig } from '@/config/site'
import { contactSchema, FIELD_MAX_LENGTH, serviceOptions, type ContactFormValues } from '@/schemas/contactSchema'
import { ApiError, sendContactMessage, type ContactPayload } from '@/services/contactService'
import { FormField } from './FormField'
import { inputClasses } from './inputStyles'
import { SubmitFeedback, type SubmitStatus } from './SubmitFeedback'

const defaultValues: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: serviceOptions[0],
  message: '',
  website: '',
}

/** Arma lo que se envía al backend: campos del formulario + señales anti-bots */
function buildPayload(values: ContactFormValues, formShownAt: number, turnstileToken: string | null): ContactPayload {
  return {
    ...values,
    elapsedMs: Date.now() - formShownAt,
    turnstileToken: turnstileToken ?? undefined,
  }
}

export function ContactForm() {
  // Resultado del último envío: decide si se muestra el aviso de éxito o de error
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  // Mensaje de error devuelto por el servidor (o de conexión)
  const [serverError, setServerError] = useState('')
  // Token de Turnstile vigente (null = verificación pendiente o expirada)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  // Cambiarla vuelve a montar el widget: cada token de Turnstile sirve una sola vez
  const [turnstileKey, setTurnstileKey] = useState(0)
  // Momento en que el formulario apareció en pantalla (trampa de tiempo anti-bots).
  // El inicializador perezoso se ejecuta una sola vez, al montar el componente en el navegador
  const [formShownAt] = useState(() => Date.now())

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
    mode: 'onTouched', // valida al salir de cada campo, no mientras se escribe
  })

  /** Propiedades comunes de cada control: registro, accesibilidad, estilos y longitud máxima */
  const fieldProps = (name: keyof typeof FIELD_MAX_LENGTH) => ({
    ...register(name),
    id: name,
    maxLength: FIELD_MAX_LENGTH[name],
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': `${name}-error`,
    className: inputClasses(Boolean(errors[name])),
  })

  const isTurnstileRequired = siteConfig.turnstileSiteKey !== null

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitStatus('idle')

    if (isTurnstileRequired && !turnstileToken) {
      setServerError('Espera un momento a que termine la verificación anti-bots e inténtalo de nuevo.')
      setSubmitStatus('error')
      return
    }

    try {
      await sendContactMessage(buildPayload(values, formShownAt, turnstileToken))
      setSubmitStatus('success')
      reset(defaultValues)
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : 'Ocurrió un error inesperado.')
      setSubmitStatus('error')
    } finally {
      // El token ya se usó: se pide uno nuevo para el siguiente envío
      if (isTurnstileRequired) {
        setTurnstileToken(null)
        setTurnstileKey((key) => key + 1)
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative rounded-3xl border border-line bg-surface p-6 shadow-2xl shadow-lavender-500/10 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="name" label="Nombre" error={errors.name?.message}>
          <input {...fieldProps('name')} autoComplete="name" placeholder="¿Cómo te llamas?" />
        </FormField>

        <FormField id="email" label="Correo electrónico" error={errors.email?.message}>
          <input {...fieldProps('email')} type="email" autoComplete="email" placeholder="tu@correo.com" />
        </FormField>

        <FormField id="phone" label="Teléfono / WhatsApp" optional error={errors.phone?.message}>
          <input {...fieldProps('phone')} type="tel" autoComplete="tel" placeholder="+57 300 000 0000" />
        </FormField>

        <FormField id="company" label="Empresa" optional error={errors.company?.message}>
          <input {...fieldProps('company')} autoComplete="organization" placeholder="Nombre de tu empresa" />
        </FormField>

        <FormField id="service" label="¿Qué necesitas?" error={errors.service?.message} className="sm:col-span-2">
          <select
            {...register('service')}
            id="service"
            aria-invalid={Boolean(errors.service)}
            aria-describedby="service-error"
            className={inputClasses(Boolean(errors.service))}
          >
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="message" label="Cuéntame sobre tu proyecto" error={errors.message?.message} className="sm:col-span-2">
          <textarea
            {...fieldProps('message')}
            rows={5}
            placeholder="¿Qué quieres construir? ¿Para cuándo lo necesitas?"
            className={`${inputClasses(Boolean(errors.message))} resize-none`}
          />
        </FormField>

        {/* Honeypot: oculto para personas y lectores de pantalla */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">No llenar este campo</label>
          <input {...register('website')} id="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {siteConfig.turnstileSiteKey && (
        <div className="mt-6">
          <TurnstileWidget key={turnstileKey} siteKey={siteConfig.turnstileSiteKey} onTokenChange={setTurnstileToken} />
        </div>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-7 w-full">
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            Enviar mensaje <Send className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </>
        )}
      </Button>

      <SubmitFeedback status={submitStatus} errorMessage={serverError} />
    </form>
  )
}
