import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SERVICES = [
  'Монтаж димоходів',
  'Встановлення камінів',
  'Монтаж бань/лазні',
  'Продаж обладнання',
  'Консультація',
]

/* ─── SVG icons ─── */

function TgIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.83.941z"/>
    </svg>
  )
}

function VbIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.4 0C5.5.2 1.6 3.8.8 9.1c-.4 3-.1 5.8 1.2 8.4.5 1 .8 2 .7 3.1-.1 1-.3 2-.5 3-.2.6 0 1.1.6.9 1.2-.4 2.4-.9 3.5-1.5.8-.4 1.6-.5 2.5-.3 2.1.5 4.2.6 6.3.2 5.1-1 8.6-4.7 8.9-9.9.2-2.9-.5-5.5-2.2-7.8C19.7 2 16.5.3 12.8.1c-.5 0-.9 0-1.4-.1z"/>
    </svg>
  )
}

export default function Contacts() {
  const rootRef = useRef(null)
  const [form,      setForm]      = useState({ name: '', phone: '', service: '', message: '' })
  const [errors,    setErrors]    = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sending,   setSending]   = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-header', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      gsap.fromTo('.contact-left',   { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.2 })
      gsap.fromTo('.contact-right',  { x:  40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.3 })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = "Вкажіть ваше ім'я"
    if (!form.phone.trim()) e.phone = 'Вкажіть номер телефону'
    return e
  }

  const handleSubmit = async ev => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSending(true)
    try {
      await fetch('https://formsubmit.co/ajax/burzhuyka.montazh@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          Імя: form.name,
          Телефон: form.phone,
          Послуга: form.service,
          Повідомлення: form.message,
        }),
      })
      setSubmitted(true)
      setForm({ name: '', phone: '', service: '', message: '' })
    } catch {
      alert('Помилка відправки. Спробуйте ще раз.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div ref={rootRef}>
      <Helmet>
        <title>Контакти — Буржуйка | Київ</title>
        <meta name="description" content="Зв'яжіться з нами для консультації по монтажу та продажу печей і камінів. Київ та область." />
        <meta property="og:title" content="Контакти — Буржуйка" />
        <meta property="og:description" content="Зв'яжіться з нами для консультації по монтажу та продажу печей і камінів. Київ та область." />
        <meta property="og:url" content="https://burzhuyka.com.ua/contacts" />
      </Helmet>

      <Navbar />

      {/* ── Dark page header ── */}
      <section className="bg-forge-black pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/4 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-forge-border" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="contact-header">
            <nav className="flex items-center gap-2 text-forge-muted text-sm mb-6">
              <Link to="/" className="hover:text-brand-primary transition-colors">Головна</Link>
              <span className="text-forge-border">/</span>
              <span className="text-forge-cream">Контакти</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
              <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">
                Зв'яжіться з нами
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase text-forge-cream leading-none">
              Контакти
            </h1>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="bg-gray-50 py-14 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT — dark contact panel */}
            <div className="contact-left bg-forge-black text-forge-cream p-8 sm:p-10 relative overflow-hidden">
              {/* Corner accent */}
              <div className="absolute top-0 left-0 h-0.5 w-24 bg-brand-primary" />
              <div className="absolute top-0 left-0 w-0.5 h-24 bg-brand-primary" />

              <h2 className="font-display text-3xl font-bold uppercase text-forge-cream mb-10">
                Зв'язок з нами
              </h2>

              {/* Phone */}
              <div className="mb-8 space-y-6">
                <div>
                  <p className="text-forge-muted text-xs uppercase tracking-[0.2em] mb-2">Монтаж</p>
                  <a
                    href="tel:+380935428302"
                    className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block leading-none"
                  >
                    +38 093 542 83 02
                  </a>
                </div>
                <div>
                  <p className="text-forge-muted text-xs uppercase tracking-[0.2em] mb-2">Продаж</p>
                  <a
                    href="tel:+380688429412"
                    className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block leading-none mb-2"
                  >
                    +38 068 842 94 12
                  </a>
                  <a
                    href="tel:+380951420814"
                    className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block leading-none"
                  >
                    +38 095 142 08 14
                  </a>
                </div>
              </div>

              <div className="h-px bg-forge-border mb-8" />

              {/* Messengers */}
              <div className="mb-8">
                <p className="text-forge-muted text-xs uppercase tracking-[0.2em] mb-4">Месенджери</p>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://t.me/burzhuyka_montazh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 bg-[#2AABEE] hover:bg-[#1d96d9] text-white font-semibold px-6 py-4 transition-all"
                  >
                    <TgIcon className="w-6 h-6 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-white/70 uppercase tracking-wider mb-0.5">Написати в</div>
                      <div className="font-display text-xl font-bold uppercase tracking-wide">Telegram</div>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xl">→</span>
                  </a>
                  <a
                    href="viber://chat?number=%2B380688429412"
                    className="group flex items-center gap-4 bg-[#7360F2] hover:bg-[#5e4ed4] text-white font-semibold px-6 py-4 transition-all"
                  >
                    <VbIcon className="w-6 h-6 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-white/70 uppercase tracking-wider mb-0.5">Написати в</div>
                      <div className="font-display text-xl font-bold uppercase tracking-wide">Viber</div>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xl">→</span>
                  </a>
                </div>
              </div>

              <div className="h-px bg-forge-border mb-8" />

              {/* Address */}
              <div className="flex items-start gap-2 text-forge-muted text-xs">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>м. Київ, Україна</span>
              </div>
            </div>

            {/* RIGHT — consultation form */}
            <div className="contact-right bg-white p-8 sm:p-10 relative">
              {/* Corner accent */}
              <div className="absolute top-0 right-0 h-0.5 w-24 bg-brand-primary" />
              <div className="absolute top-0 right-0 w-0.5 h-24 bg-brand-primary" />

              <h2 className="font-display text-3xl font-bold uppercase text-gray-900 mb-2">
                Звернутись<br />за консультацією
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                Передзвонимо протягом 30 хвилин у робочий час
              </p>

              {submitted ? (
                <div className="flex flex-col items-center gap-5 py-16 text-center">
                  <div className="w-16 h-16 bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-gray-900">Заявку надіслано!</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Дякуємо! Наш менеджер зв'яжеться з вами найближчим часом.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-brand-primary font-semibold text-sm hover:underline"
                  >
                    Надіслати ще одну заявку
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-[0.12em] mb-2">
                        Ваше ім'я <span className="text-brand-primary">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Іван Іваненко"
                        className={`w-full border-b-2 px-0 py-2.5 text-sm text-gray-900 bg-transparent focus:outline-none transition-colors placeholder:text-gray-300 ${
                          errors.name
                            ? 'border-red-400'
                            : 'border-gray-200 focus:border-brand-primary'
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-[0.12em] mb-2">
                        Телефон <span className="text-brand-primary">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+38 (067) 000-00-00"
                        className={`w-full border-b-2 px-0 py-2.5 text-sm text-gray-900 bg-transparent focus:outline-none transition-colors placeholder:text-gray-300 ${
                          errors.phone
                            ? 'border-red-400'
                            : 'border-gray-200 focus:border-brand-primary'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-[0.12em] mb-2">
                      Послуга
                    </label>
                    <select
                      value={form.service}
                      onChange={e => setForm({ ...form, service: e.target.value })}
                      className="w-full border-b-2 border-gray-200 px-0 py-2.5 text-sm text-gray-900 bg-transparent focus:outline-none focus:border-brand-primary transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">— Оберіть послугу —</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-[0.12em] mb-2">
                      Повідомлення
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Опишіть ваш запит або питання..."
                      className="w-full border-b-2 border-gray-200 px-0 py-2.5 text-sm text-gray-900 bg-transparent focus:outline-none focus:border-brand-primary transition-colors resize-none placeholder:text-gray-300"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-brand-primary hover:bg-brand-dark disabled:opacity-60 text-white font-semibold py-4 uppercase tracking-widest text-sm transition-all hover:orange-glow"
                    >
                      {sending ? 'Надсилаємо...' : 'Надіслати заявку'}
                    </button>
                    <p className="text-gray-400 text-xs text-center mt-3">
                      Натискаючи кнопку, ви погоджуєтесь з обробкою персональних даних
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Bottom messenger CTA strip */}
          {/* <div className="mt-6 bg-forge-black p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-primary/40" />
            <p className="text-forge-muted text-xs uppercase tracking-widest mb-5">Або зв'яжіться через месенджер — відповідаємо цілодобово</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://t.me/salamander_montazh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#2AABEE] hover:bg-[#1d96d9] text-white font-bold px-8 py-4 text-sm uppercase tracking-wider transition-all"
              >
                <TgIcon className="w-5 h-5" />
                Telegram
              </a>
              <a
                href="viber://chat?number=%2B380670000000"
                className="flex items-center gap-3 bg-[#7360F2] hover:bg-[#5e4ed4] text-white font-bold px-8 py-4 text-sm uppercase tracking-wider transition-all"
              >
                <VbIcon className="w-5 h-5" />
                Viber
              </a>
              <a
                href="tel:+380670000000"
                className="flex items-center gap-3 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-bold px-8 py-4 text-sm uppercase tracking-wider transition-all"
              >
                <PhoneIcon className="w-5 h-5" />
                Передзвонити
              </a>
            </div>
          </div> */}
        </div>
      </section>

      <Footer />
    </div>
  )
}
