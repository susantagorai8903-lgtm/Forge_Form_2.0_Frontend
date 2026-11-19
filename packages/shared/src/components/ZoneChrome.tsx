/* eslint-disable @next/next/no-html-link-for-pages -- zone links must trigger a full navigation across deployed apps. */
import type { ReactNode } from "react";

type LinkItem = { href: string; label: string };

export function BrandName({ className }: { className?: string }) {
  return <span className={className}>FORGE <i>&</i> FORM</span>;
}

export function ZoneHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="zone-header">
      <a className="zone-brand" href="/" aria-label="Forge & Form home"><BrandName /></a>
      <nav aria-label="Main navigation">
        <a href="/">Website</a>
        <a href="/programs">Programs</a>
        <a href="/book-consultation">Consultation</a>
        {children}
      </nav>
    </header>
  );
}

export function ZoneFooter({ links = [] }: { links?: LinkItem[] }) {
  return (
    <footer className="zone-footer">
      <a className="zone-brand" href="/"><BrandName /></a>
      <nav aria-label="Footer navigation">
        {links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
      </nav>
      <span>Forge & Form Personal Training</span>
    </footer>
  );
}
