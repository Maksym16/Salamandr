import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchProducts } from '../api/products'
import { fetchGallery } from '../api/gallery'
import { fetchHeroCarousel } from '../api/heroCarousel'

gsap.registerPlugin(ScrollTrigger)

/* ─── Hero carousel images ─── */
const HERO_IMAGES = [
  { src: '/home_page_imgs/pexels-artbovich-6301175.jpg', alt: 'Камін в інтер\'єрі' },
  { src: '/home_page_imgs/borsuika.jpg',                 alt: 'Опалювальна піч' },
  { src: '/home_page_imgs/heater.jpg',                   alt: 'Нагрівач' },
  { src: '/home_page_imgs/sauna.jpg',                    alt: 'Сауна' },
  { src: '/home_page_imgs/sauna_shelves.jpg',            alt: 'Полиці сауни' },
]

function HeroCarousel({ images: slides = HERO_IMAGES }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    setCurrent(0)
  }, [slides])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="relative">
      {/* Offset frame */}
      <div className="absolute -top-5 -right-5 w-full h-full border border-brand-primary/25 pointer-events-none z-10" />

      {/* Slides */}
      <div className="relative w-full h-[520px] overflow-hidden">
        {slides.map((img, i) => (
          <img
            key={img.src || img.url}
            src={img.src || img.url}
            alt={img.alt || ''}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        ))}
      </div>

      {/* Corner accents */}
      <div className="absolute bottom-0 left-0 h-1 w-20 bg-brand-primary z-10" />
      <div className="absolute bottom-0 left-0 w-1 h-20 bg-brand-primary z-10" />

      {/* Pagination dots */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        {slides.map((_, i) => (
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
    desc: 'Встановлення одностінних та утеплених (термо) димоходів під ключ.',
    img:  '/home_page_imgs/side_pipe.jpg',
    points: ['Встановлення одностінних та утеплених (термо) димоходів', 'Гільзовка димоходних каналів', 'Монтаж керамічних димоходів'],
  },
  {
    id: '02',
    title: 'Монтаж камінів',
    desc: 'Каміни та вставки провідних євробрендів — Kratki, Schmid, Romotop. Монтаж під ключ.',
    img:  '/home_page_imgs/fireplace.jpg',
    points: ['Монтаж камінних топок', 'Монтаж термоізоляційних коробів', 'Термоізоляція стін в зоні каміна', 'Розвідка теплого повітря від каміна'],
  },
  {
    id: '03',
    title: 'Монтаж саун та бань',
    desc: 'Комплексне облаштування парних — від каркасу та ізоляції до оздоблення і підключення обладнання.',
    img:  '/home_page_imgs/sauna_shelves_lights.jpg',
    points: ['Монтаж каркаса та тепло-пароізоляції', 'Обшивка вагонкою та монтаж полків', 'Встановлення та під\'єднання нагрівального обладнання', 'Монтаж вентиляції, освітлення та декоративних елементів'],
  },
]


const CATALOG_CATS = [
  { label: 'Печі для саун',    categoryId: 'sauna',     icon: '🔥' },
  { label: 'Опалювальні печі', categoryId: 'heating',   icon: '🏠' },
  { label: 'Каміни',           categoryId: 'fireplace', icon: '🪵' },
]

const STATS = [
  { num: '500+',  label: 'Виконаних проектів' },
  { num: '10+',    label: 'Років на ринку'      },
  { num: '1+',     label: 'Роки гарантії на послуги та продукцію'       },
  { num: '24/7',  label: 'Підтримка клієнтів'  },
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

/* ─── Component ─── */
export default function Home() {
  const rootRef = useRef(null)

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const { data: heroImages = [] } = useQuery({
    queryKey: ['hero-carousel'],
    queryFn: fetchHeroCarousel,
  })
  const heroSlides = heroImages.length > 0 ? heroImages : HERO_IMAGES

  const { data: galleryImages = [] } = useQuery({
    queryKey: ['gallery'],
    queryFn: fetchGallery,
  })
  const carouselImages = galleryImages.slice(0, 10)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const carouselMax = Math.max(0, carouselImages.length - 3)
  const prevSlide = () => setCarouselIdx(i => Math.max(0, i - 1))
  const nextSlide = () => setCarouselIdx(i => Math.min(carouselMax, i + 1))

  useEffect(() => {
    if (carouselImages.length <= 3) return
    const t = setInterval(() => setCarouselIdx(i => (i >= carouselMax ? 0 : i + 1)), 3500)
    return () => clearInterval(t)
  }, [carouselImages.length, carouselMax])

  const countByCategory = (id) => allProducts.filter(p => p.category_id === id).length

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /* Set initial states before first paint — prevents flash */
      gsap.set('.hero-line',  { yPercent: 110 })
      gsap.set('.hero-body',  { y: 28, opacity: 0 })
      gsap.set('.hero-stat',  { y: 16, opacity: 0 })
      gsap.set('.hero-img',   { x: 60, opacity: 0 })
      gsap.set('.service-card', { opacity: 0, y: 80, scale: 0.96 })
      gsap.set('.cat-tile',   { y: 44, opacity: 0 })

      /* Hero staggered line reveal */
      gsap.to('.hero-line', { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' })
      gsap.to('.hero-body', { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.4 })
      gsap.to('.hero-stat', { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out', delay: 0.65 })
      gsap.to('.hero-img',  { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.1 })

      /* Services scroll reveal */
      gsap.to('.service-card',
        { y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.services-section', start: 'top 82%', once: true } }
      )

      /* Catalog preview */
      gsap.to('.cat-tile',
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
      <Helmet>
        <title>Буржуйка — Продаж та монтаж печей і камінів | Київ</title>
        <meta name="description" content="Продаж та монтаж печей для сауни, опалювальних печей та камінів. Виробник Новаслав та інші бренди. Установка під ключ — Київ та область." />
        <meta property="og:title" content="Буржуйка — Продаж та монтаж печей і камінів | Київ" />
        <meta property="og:description" content="Продаж та монтаж печей для сауни, опалювальних печей та камінів. Установка під ключ — Київ та область." />
        <meta property="og:url" content="https://burzhuyka.com" />
      </Helmet>

      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image + overlays */}
        <div className="absolute inset-0">
          <img
            src="/fire-flame.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark vignette */}
          <div className="absolute inset-0 bg-forge-black/40" />
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
                  Монтаж та продаж — Буржуйка
                </span>
              </div>

              {/* Display heading — each line wrapped for clip reveal */}
              <h1 className="font-display font-bold uppercase leading-none mb-8 text-5xl sm:text-6xl lg:text-[80px]">
                <div className="clip-reveal overflow-hidden">
                  <span className="hero-line block text-forge-cream">ПРОДАЄМО</span>
                </div>
                <div className="clip-reveal overflow-hidden">
                  <span className="hero-line block text-brand-primary">МОНТУЄМО</span>
                </div>
                <div className="clip-reveal overflow-hidden">
                  <span className="hero-line block text-forge-cream">ГАРАНТУЄМО</span>
                </div>
              </h1>

              {/* Subtitle */}
              <p className="hero-body text-forge-dim text-base sm:text-lg leading-relaxed max-w-md mb-8">
                Монтаж та продаж печей, камінів і обладнання для бань та лазні. Установка під ключ Київ та область.
              </p>

              {/* Stats strip */}
              <div className="flex items-stretch gap-0 border-t border-forge-border pt-8">
                {STATS.slice(0, 3).map((s, i) => (
                  <div
                    key={s.label}
                    className={`hero-stat flex-1 ${i > 0 ? 'border-l border-forge-border pl-6' : ''} ${i < 2 ? 'pr-6' : ''}`}
                  >
                    <div className="font-display text-3xl font-bold text-brand-primary leading-none mb-1">{s.num}</div>
                    <div className="text-forge-cream text-xs leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — hero carousel (desktop only) */}
            <div className="hidden lg:block hero-img">
              <HeroCarousel images={heroSlides} />
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-forge-border" />
      </section>

      {/* ═══════════ SERVICES ═══════════ */}
      <section className="services-section py-24">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
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
          </div>
        </div>
      </section>

      {/* ═══════════ OUR WORK ═══════════ */}
      {carouselImages.length > 0 && (
        <section className="gallery-preview-section py-24 bg-forge-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-10 bg-brand-primary flex-shrink-0" />
                  <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">Портфоліо</span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-forge-cream leading-none">
                  Наші роботи
                </h2>
                <p className="text-forge-muted mt-3 text-sm">Переглянте приклади наших установок</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Arrows */}
                <div className="flex gap-2">
                  <button
                    onClick={prevSlide}
                    disabled={carouselIdx === 0}
                    className="w-10 h-10 border border-forge-border flex items-center justify-center text-forge-dim hover:border-brand-primary hover:text-brand-primary transition-all disabled:opacity-30 disabled:cursor-default"
                    aria-label="Назад"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    disabled={carouselIdx >= carouselMax}
                    className="w-10 h-10 border border-forge-border flex items-center justify-center text-forge-dim hover:border-brand-primary hover:text-brand-primary transition-all disabled:opacity-30 disabled:cursor-default"
                    aria-label="Вперед"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <Link
                  to="/gallery"
                  className="hidden sm:inline-flex items-center gap-2 text-forge-muted hover:text-brand-primary text-sm font-medium uppercase tracking-wide transition-colors"
                >
                  Дивитись усі <span className="text-lg leading-none">→</span>
                </Link>
              </div>
            </div>

            {/* Carousel track */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${carouselIdx * (100 / 3)}%)` }}
              >
                {carouselImages.map((img) => (
                  <div key={img.id} className="w-1/3 flex-shrink-0 px-1.5">
                    <Link to="/gallery" className="group block aspect-square overflow-hidden bg-forge-surface">
                      <img
                        src={img.url}
                        alt={img.title || ''}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            {carouselImages.length > 3 && (
              <div className="flex justify-center gap-1.5 mt-6">
                {Array.from({ length: carouselMax + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIdx(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === carouselIdx ? 'bg-brand-primary w-6' : 'w-3 bg-forge-border hover:bg-forge-dim'
                    }`}
                    aria-label={`Слайд ${i + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="text-center mt-8 sm:hidden">
              <Link
                to="/gallery"
                className="inline-block border border-brand-primary text-brand-primary font-semibold px-8 py-3 text-sm uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
              >
                Дивитись усі роботи
              </Link>
            </div>
          </div>
        </section>
      )}

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
                {/* <p className="text-forge-muted text-sm mb-5 leading-relaxed">{c.desc}</p> */}
                <div className="flex items-center justify-between">
                  <span className="text-brand-primary text-xs font-semibold uppercase tracking-widest">{countByCategory(c.categoryId)} моделей</span>
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
            {/* <a
              href="tel:+380670000000"
              className="flex items-center gap-2.5 bg-brand-primary hover:bg-brand-dark text-white font-semibold px-8 py-4 text-sm uppercase tracking-[0.1em] transition-all hover:orange-glow"
            >
              <PhoneIcon className="w-4 h-4" />
              Передзвонити
            </a> */}
            <a
              href="https://t.me/+380688429412"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 border border-[#2AABEE] text-[#2AABEE] hover:bg-[#2AABEE] hover:text-white font-semibold px-8 py-4 text-sm uppercase tracking-[0.1em] transition-all"
            >
              <TgIcon className="w-4 h-4" />
              Telegram
            </a>
            <a
              href="viber://chat?number=%2B380688429412"
              className="flex items-center gap-2.5 border border-[#7360F2] text-[#7360F2] hover:bg-[#7360F2] hover:text-white font-semibold px-8 py-4 text-sm uppercase tracking-[0.1em] transition-all"
            >
              <VbIcon className="w-4 h-4" />
              Viber
            </a>
          </div>

          {/* Large phone */}
          <div className="border-t border-forge-border pt-12">
            <p className="text-forge-muted text-xs uppercase tracking-widest mb-8">Або дзвоніть напряму</p>
            <div className="flex flex-col sm:flex-row justify-center gap-10 sm:gap-16">
              <div>
                <p className="text-forge-muted text-xs uppercase tracking-[0.2em] mb-2">Монтаж</p>
                <a href="tel:+380935428302" className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block">
                  +38 093 542 83 02
                </a>
              </div>
              <div>
                <p className="text-forge-muted text-xs uppercase tracking-[0.2em] mb-2">Продаж</p>
                <a href="tel:+380688429412" className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block mb-2">
                  +38 068 842 94 12
                </a>
                <a href="tel:+380951420814" className="font-display text-3xl sm:text-4xl font-bold text-forge-cream hover:text-brand-primary transition-colors block">
                  +38 095 142 08 14
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
