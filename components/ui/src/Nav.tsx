import "./Nav.css";

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavProps {
  links: NavLink[];
  statusLabel?: string;
  /** Initials shown in the avatar circle on the right. */
  avatarInitials?: string;
  onNavigate?: (href: string) => void;
}

/** Site header — wordmark, primary nav, a live-status chip, and a user avatar. */
export function Nav({ links, statusLabel, avatarInitials, onNavigate }: NavProps) {
  return (
    <nav className="hvg-nav">
      <div className="hvg-nav__left">
        <div className="hvg-nav__brand">
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="17" stroke="var(--hvg-ember)" strokeWidth="2" />
            <circle cx="20" cy="20" r="10" stroke="var(--hvg-text-muted)" strokeWidth="1.4" />
            <circle cx="20" cy="20" r="3" fill="var(--hvg-ember)" />
          </svg>
          <span className="hvg-nav__wordmark">HIVIG</span>
        </div>
        <div className="hvg-nav__links">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={link.active ? "hvg-nav__link hvg-nav__link--active" : "hvg-nav__link"}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(link.href);
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="hvg-nav__right">
        {statusLabel ? (
          <span className="hvg-nav__status">
            <span className="hvg-nav__pulse" />
            {statusLabel}
          </span>
        ) : null}
        {avatarInitials ? <span className="hvg-nav__avatar">{avatarInitials}</span> : null}
      </div>
    </nav>
  );
}
