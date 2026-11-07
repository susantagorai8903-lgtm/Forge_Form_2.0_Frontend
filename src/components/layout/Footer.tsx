import Link from "next/link";
import { MoveUpRight } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top shell">
        <div className="footer__brand">
          <Link href="/" className="brand brand--footer" aria-label="Forge & Form home">
            <Image className="brand__mark" src="/icon/F&F Neon Fitness Emblem.png" alt="" width={760} height={760} />
            <span className="brand__name">FORGE <i>&</i> FORM</span>
          </Link>
          <p>Personal training for real life. Build strength, find your rhythm, and move forward with a plan made for you.</p>
        </div>
        <div className="footer__column">
          <h2>Explore</h2>
          <Link href="/about">Our approach</Link><Link href="/programs">Programs</Link><Link href="/trainers">Our coaches</Link><Link href="/testimonials">Client stories</Link><Link href="/blog">The journal</Link>
        </div>
        <div className="footer__column">
          <h2>Get in touch</h2>
          <a href="tel:+15035550139">(503) 555-0139</a>
          <a href="mailto:training@forgeandform.com">training@forgeandform.com</a>
          <p>1900 Division Street<br />Portland, OR 97202</p>
          <Link href="/locations">Find the studio <MoveUpRight size={13} /></Link>
        </div>
      </div>
      <div className="footer__bottom shell">
        <span>© {new Date().getFullYear()} Forge & Form Personal Training</span>
        <span>Made for movement in Portland, Oregon</span>
        <div><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div>
    </footer>
  );
}
