import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Головна' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/contacts', label: 'Контакти' },
];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid
          ? 'bg-forge-black/95 backdrop-blur-md border-b border-forge-border shadow-[0_4px_32px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <img
              src="/logo/burzuika_logo_64.png"
              alt="Буржуйка"
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
            <span className="font-display text-xl font-bold tracking-[0.12em] text-forge-cream uppercase leading-none">
              Буржуйка
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `font-sans font-medium text-sm uppercase tracking-[0.1em] transition-colors duration-200 ${
                    isActive
                      ? 'text-brand-primary'
                      : 'text-forge-dim hover:text-forge-cream'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <a
              href="tel:+380935428302"
              className="flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white font-semibold text-sm px-5 py-2.5 uppercase tracking-[0.08em] transition-all hover:orange-glow"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              Передзвонити
            </a>
          </nav>

          {/* ── Hamburger ── */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label="Меню"
          >
            <span
              className={`block w-6 h-[2px] bg-forge-cream transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`}
            />
            <span
              className={`block w-6 h-[2px] bg-forge-cream transition-all duration-300 ${open ? 'opacity-0' : ''}`}
            />
            <span
              className={`block w-6 h-[2px] bg-forge-cream transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`}
            />
          </button>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-80 pb-6' : 'max-h-0'}`}
        >
          <div className="border-t border-forge-border pt-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-3 font-medium text-sm uppercase tracking-widest transition-colors ${
                    isActive
                      ? 'text-brand-primary'
                      : 'text-forge-dim hover:text-forge-cream'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <a
              href="tel:+380935428302"
              onClick={() => setOpen(false)}
              className="mt-2 text-center bg-brand-primary hover:bg-brand-dark text-white font-semibold text-sm px-5 py-3 uppercase tracking-widest transition-colors"
            >
              Передзвонити
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
