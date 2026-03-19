import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

gsap.registerPlugin(ScrollTrigger)

/* ─── Hero carousel images ─── */
const HERO_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=720&h=820&fit=crop&q=80', alt: 'Камін в інтер\'єрі' },
  { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=720&h=820&fit=crop&q=80', alt: 'Піч для сауни' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=720&h=820&fit=crop&q=80', alt: 'Опалювальна піч' },
  { src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=720&h=820&fit=crop&q=80', alt: 'Сауна' },
  { src: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=720&h=820&fit=crop&q=80', alt: 'Монтаж димоходу' },
]

function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % HERO_IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative">
      {/* Offset frame */}
      <div className="absolute -top-5 -right-5 w-full h-full border border-brand-primary/25 pointer-events-none z-10" />

      {/* Slides */}
      <div className="relative w-full h-[520px] overflow-hidden">
        {HERO_IMAGES.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        ))}
      </div>

      {/* Corner accents */}
      <div className="absolute bottom-0 left-0 h-1 w-20 bg-brand-primary z-10" />
      <div className="absolute bottom-0 left-0 w-1 h-20 bg-brand-primary z-10" />

      {/* Badge */}
      <div className="absolute top-6 left-6 bg-brand-primary px-4 py-2 z-10">
        <p className="font-display text-white text-xs uppercase tracking-widest">Гарантія</p>
        <p className="font-display text-white font-bold text-xl leading-none">3 роки</p>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-3 rounded-full transition-all duration-300 ${
              i === current ? 'bg-brand-primary w-7' : 'w-3 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Data ─── */
const SERVICES = [
  {
    id: '01',
    title: 'Монтаж димоходів',
    desc: 'Встановлення одно- та двостінних димоходів з нержавіючої сталі, керамічних і цегляних систем.',
    img:  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&h=700&fit=crop&q=80',
    points: ['Сталеві модульні системи', 'Керамічні димоходи', 'Цегляна кладка', 'Гідроізоляція та утеплення', 'Гарантія 5 років'],
  },
  {
    id: '02',
    title: 'Монтаж камінів',
    desc: 'Каміни та вставки провідних євробрендів — Kratki, Schmid, Romotop. Дизайн під ваш інтер\'єр.',
    img:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=700&fit=crop&q=80',
    points: ['Каміні вставки та топки', 'Відкриті та закриті каміни', 'Облицювання каменем і цеглою', 'Прихована проводка', 'Монтаж під ключ'],
  },
  {
    id: '03',
    title: 'Монтаж саун та бань',
    desc: 'Фінська сауна, хамам, рус. лазня. Підбір обладнання Harvia, Helo, Tulikivi.',
    img:  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=700&fit=crop&q=80',
    points: ['Фінська та інфрачервона сауна', 'Хамам і парова лазня', 'Монтаж печей і парогенераторів', 'Вагонка, утеплення, двері', 'Пуско-налагоджувальні роботи'],
  },
]

const SERVICE_LIST = [
  {
    icon: '🔩',
    title: 'Сталеві димоходи',
    desc: 'Модульні системи Schiedel, Permeter, Profi — одно- та двостінні, для будь-якого котла',
  },
  {
    icon: '🧱',
    title: 'Керамічні димоходи',
    desc: 'Системи Ecoosmose, Tona, Jawal — максимальна стійкість до конденсату та кислот',
  },
  {
    icon: '🔥',
    title: 'Каміні вставки',
    desc: 'Kratki, Schmid, Romotop — монтаж у готовий портал або під облицювання під ключ',
  },
  {
    icon: '🪨',
    title: 'Облицювання камінів',
    desc: 'Клінкерна цегла, натуральний камінь, декоративна штукатурка, мармур',
  },
  {
    icon: '💨',
    title: 'Парогенератори',
    desc: 'Встановлення Helo, Tylo, Harvia для хамамів і парових лазень будь-якого об\'єму',
  },
  {
    icon: '🛠️',
    title: 'Техобслуговування',
    desc: 'Чищення, перевірка тяги, ремонт та гідроізоляція димоходів і саун',
  },
]

const CATALOG_CATS = [
  { label: 'Печі для саун',    desc: 'Harvia, Helo, Tulikivi та ін.', icon: '🔥', count: '12 моделей' },
  { label: 'Опалювальні печі', desc: 'Bulerjan, Jøtul, Keddy та ін.',  icon: '🏠', count: '8 моделей'  },
  { label: 'Каміни',           desc: 'Kratki, Schmid, Romotop та ін.', icon: '🪵', count: '10 моделей' },
]

const STATS = [
  { num: '500+',  label: 'Виконаних проектів' },
  { num: '10',    label: 'Років на ринку'      },
  { num: '3',     label: 'Роки гарантії'       },
  { num: '24/7',  label: 'Підтримка клієнтів'  },
]

/* ─── SVG icons ─── */
function PhoneIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  )
}

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

/* ─── Component ─── */
export default function Home() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero staggered line reveal */
      gsap.fromTo('.hero-line',
        { yPercent: 110 },
        { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out', delay: 0.15 }
      )
      gsap.fromTo('.hero-body',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.55 }
      )
      gsap.fromTo('.hero-btn',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.75 }
      )
      gsap.fromTo('.hero-stat',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out', delay: 0.95 }
      )
      gsap.fromTo('.hero-img',
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      )

      /* Services scroll reveal */
      gsap.fromTo('.service-card',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: '.services-section', start: 'top 78%', once: true } }
      )

      /* Catalog preview */
      gsap.fromTo('.cat-tile',
        { y: 44, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: '.catalog-preview', start: 'top 80%', once: true } }
      )

      /* Stats */
      gsap.fromTo('.stat-block',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: '.stats-section', start: 'top 82%', once: true } }
      )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="bg-forge-black text-forge-cream">
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image + overlays */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&h=1080&fit=crop&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark vignette */}
          <div className="absolute inset-0 bg-forge-black/80" />
          {/* Directional fade — left side more visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-forge-black via-forge-black/60 to-forge-black/20" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forge-black to-transparent" />
        </div>

        {/* Orange ambient glow */}
        <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-brand-primary/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT — content */}
            <div>
              {/* Label line */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
                <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">
                  Монтаж та продаж — Саламандр
                </span>
              </div>

              {/* Display heading — each line wrapped for clip reveal */}
              <h1 className="font-display font-bold uppercase leading-none mb-8 text-5xl sm:text-6xl lg:text-[80px]">
                <div className="clip-reveal">
                  <span className="hero-line block text-forge-cream">Тепло</span>
                </div>
                <div className="clip-reveal">
                  <span className="hero-line block text-brand-primary">у вашому</span>
                </div>
                <div className="clip-reveal">
                  <span className="hero-line block text-forge-cream">домі</span>
                </div>
              </h1>

              {/* Subtitle */}
              <p className="hero-body text-forge-dim text-base sm:text-lg leading-relaxed max-w-md mb-8">
                Монтаж та продаж печей, камінів і обладнання для саун. Установка під ключ по всій Україні від сертифікованих майстрів.
              </p>

              {/* Stats strip */}
              <div className="flex items-stretch gap-0 border-t border-forge-border pt-8">
                {STATS.slice(0, 3).map((s, i) => (
                  <div
                    key={s.label}
                    className={`hero-stat flex-1 ${i > 0 ? 'border-l border-forge-border pl-6' : ''} ${i < 2 ? 'pr-6' : ''}`}
                  >
                    <div className="font-display text-3xl font-bold text-brand-primary leading-none mb-1">{s.num}</div>
                    <div className="text-forge-muted text-xs leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — hero carousel (desktop only) */}
            <div className="hidden lg:block hero-img">
              <HeroCarousel />
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-forge-border" />
      </section>

      {/* ═══════════ SERVICES ═══════════ */}
      <section className="services-section py-24 bg-forge-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
                <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Наші послуги</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none">
                Що ми монтуємо
              </h2>
            </div>
            <Link
              to="/contacts"
              className="hidden sm:inline-flex items-center gap-2 text-forge-muted hover:text-brand-primary text-sm font-medium uppercase tracking-wide transition-colors"
            >
              Замовити послугу <span className="text-lg leading-none">→</span>
            </Link>
          </div>

          {/* Single unified grid: photo cards row + service list rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-forge-border">
            {/* Photo cards */}
            {SERVICES.map(s => (
              <div
                key={s.id}
                className="service-card group relative bg-forge-card hover:border-brand-primary/50 overflow-hidden transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forge-card via-forge-card/40 to-transparent" />
                  <span className="absolute top-4 right-5 font-display text-6xl font-bold text-white/8 leading-none select-none">
                    {s.id}
                  </span>
                </div>
                <div className="h-0.5 bg-brand-primary w-0 group-hover:w-full transition-all duration-500 ease-out" />
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold uppercase text-forge-cream mb-2 group-hover:text-brand-primary transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="text-forge-muted text-sm leading-relaxed mb-4">{s.desc}</p>
                  <ul className="space-y-1.5 mb-5">
                    {s.points.map(p => (
                      <li key={p} className="flex items-center gap-2 text-forge-dim text-sm">
                        <span className="w-1 h-1 rounded-full bg-brand-primary flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contacts"
                    className="inline-flex items-center gap-2 text-brand-primary font-sans font-semibold text-sm uppercase tracking-wide hover:gap-3 transition-all"
                  >
                    Замовити <span>→</span>
                  </Link>
                </div>
              </div>
            ))}

            {/* Service list items — continue in same grid */}
            {SERVICE_LIST.map(s => (
              <div
                key={s.title}
                className="service-card bg-forge-card hover:bg-forge-surface p-6 flex items-start gap-4 group transition-colors duration-300"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{s.icon}</span>
                <div>
                  <h4 className="font-display text-lg font-bold uppercase text-forge-cream mb-1 group-hover:text-brand-primary transition-colors">
                    {s.title}
                  </h4>
                  <p className="text-forge-muted text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CATALOG PREVIEW ═══════════ */}
      <section className="catalog-preview py-24 bg-forge-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Асортимент</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none">
              Каталог товарів
            </h2>
            <Link
              to="/catalog"
              className="hidden sm:inline-flex items-center gap-2 text-forge-muted hover:text-brand-primary text-sm font-medium uppercase tracking-wide transition-colors"
            >
              Переглянути всі <span className="text-lg leading-none">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATALOG_CATS.map((c, i) => (
              <Link
                to="/catalog"
                key={c.label}
                className="cat-tile group bg-forge-card border border-forge-border hover:border-brand-primary/60 p-8 transition-all duration-300 relative overflow-hidden"
              >
                {/* Background number */}
                <span className="absolute -right-2 -bottom-4 font-display text-[90px] font-bold text-white/5 leading-none select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="text-4xl mb-6">{c.icon}</div>
                <h3 className="font-display text-2xl font-bold uppercase text-forge-cream mb-2 group-hover:text-brand-primary transition-colors">
                  {c.label}
                </h3>
                <p className="text-forge-muted text-sm mb-5 leading-relaxed">{c.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-brand-primary text-xs font-semibold uppercase tracking-widest">{c.count}</span>
                  <span className="text-forge-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all inline-block">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/catalog"
              className="inline-block border border-brand-primary text-brand-primary font-semibold px-8 py-3 text-sm uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
            >
              Весь каталог
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTACT STRIP ═══════════ */}
      <section className="py-24 bg-forge-black relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-primary/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-brand-primary" />
            <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Контакти</span>
            <div className="h-px w-10 bg-brand-primary" />
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase text-forge-cream mb-4 text-balance">
            Потрібна консультація?
          </h2>
          <p className="text-forge-muted text-lg mb-10">
            Зв'яжіться зручним способом — відповімо швидко
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-14">
            <a
              href="tel:+380670000000"
              className="flex items-center gap-2.5 bg-brand-primary hover:bg-brand-dark text-white font-semibold px-8 py-4 text-sm uppercase tracking-[0.1em] transition-all hover:orange-glow"
            >
              <PhoneIcon className="w-4 h-4" />
              Передзвонити
            </a>
            <a
              href="https://t.me/salamander_montazh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 border border-[#2AABEE] text-[#2AABEE] hover:bg-[#2AABEE] hover:text-white font-semibold px-8 py-4 text-sm uppercase tracking-[0.1em] transition-all"
            >
              <TgIcon className="w-4 h-4" />
              Telegram
            </a>
            <a
              href="viber://chat?number=%2B380670000000"
              className="flex items-center gap-2.5 border border-[#7360F2] text-[#7360F2] hover:bg-[#7360F2] hover:text-white font-semibold px-8 py-4 text-sm uppercase tracking-[0.1em] transition-all"
            >
              <VbIcon className="w-4 h-4" />
              Viber
            </a>
          </div>

          {/* Large phone */}
          <div className="border-t border-forge-border pt-12">
            <p className="text-forge-muted text-xs uppercase tracking-widest mb-3">Або дзвоніть напряму</p>
            <a
              href="tel:+380670000000"
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-forge-cream hover:text-brand-primary transition-colors"
            >
              +38 (067) 000-00-00
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
