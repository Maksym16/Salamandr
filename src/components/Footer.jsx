import { Link } from 'react-router-dom';


export default function Footer() {
  return (
    <footer className="bg-forge-dark border-t border-forge-border text-forge-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <img
                src="/logo/logo3.png"
                alt="Буржуйка"
                className="h-8 w-auto object-contain"
              />
              <span className="font-display text-lg font-bold tracking-[0.12em] text-forge-cream uppercase">
                Буржуйка
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-forge-muted">
              Професійний монтаж та продаж печей, камінів і обладнання для бань
              та лазні
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://t.me/burzhuyka_montazh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-forge-card border border-forge-border flex items-center justify-center hover:border-[#2AABEE] hover:text-[#2AABEE] text-forge-muted transition-all"
                aria-label="Telegram"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.83.941z" />
                </svg>
              </a>
              <a
                href="viber://chat?number=%2B380688429412"
                className="w-9 h-9 bg-forge-card border border-forge-border flex items-center justify-center hover:border-[#7360F2] hover:text-[#7360F2] text-forge-muted transition-all"
                aria-label="Viber"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.4 0C5.5.2 1.6 3.8.8 9.1c-.4 3-.1 5.8 1.2 8.4.5 1 .8 2 .7 3.1-.1 1-.3 2-.5 3-.2.6 0 1.1.6.9 1.2-.4 2.4-.9 3.5-1.5.8-.4 1.6-.5 2.5-.3 2.1.5 4.2.6 6.3.2 5.1-1 8.6-4.7 8.9-9.9.2-2.9-.5-5.5-2.2-7.8C19.7 2 16.5.3 12.8.1c-.5 0-.9 0-1.4-.1z" />
                </svg>
              </a>
              <a
                href="tel:+380935428302"
                className="w-9 h-9 bg-forge-card border border-forge-border flex items-center justify-center hover:border-brand-primary hover:text-brand-primary text-forge-muted transition-all"
                aria-label="Телефон"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="md:col-span-1" />

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-forge-cream text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              Навігація
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                ['/', 'Головна'],
                ['/catalog', 'Каталог товарів'],
                ['/contacts', 'Контакти'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="hover:text-brand-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div className="md:col-span-3">
            <h4 className="text-forge-cream text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              Контакти
            </h4>
            <ul className="space-y-3 text-sm">
              <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">
                Монтаж
              </span>
              <li>
                <a
                  href="tel:+380935428302"
                  className="hover:text-brand-primary transition-colors"
                >
                  +38 (093) 542-83-02
                </a>
              </li>
              <span className="text-brand-primary font-sans font-medium text-xs uppercase tracking-[0.22em]">
                Продаж
              </span>
              <li>
                <a
                  href="tel:+380688429412"
                  className="hover:text-brand-primary transition-colors"
                >
                  +38 (068) 842-94-12
                </a>
              </li>
              <li>
                <a
                  href="tel:+380951420814"
                  className="hover:text-brand-primary transition-colors"
                >
                  +38 (095) 142-08-14
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/burzhuyka_montazh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary transition-colors"
                >
                  Telegram: @burzhuyka_montazh
                </a>
              </li>
              <li>
                <a
                  href="mailto:burzhuyka_montazh@gmail.com"
                  className="hover:text-brand-primary transition-colors"
                >
                  burzhuyka_montazh@gmail.com
                </a>
              </li>
              <li className="text-forge-muted">м.Київ, Україна</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forge-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-forge-muted/60">
          <p>
            © 2026 Буржуйка. Усі права захищені.{' '}
            <Link to="/admin/login" className="text-forge-muted/40 hover:text-brand-primary transition-colors ml-1" aria-label="Адміністрування" title="Адмін">
              <svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3 -mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3zm0 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
              </svg>
            </Link>
          </p>
          <p>
            Професійний монтаж та продаж печей, камінів і обладнання для бань та
            лазні
          </p>
        </div>
      </div>
    </footer>
  );
}
