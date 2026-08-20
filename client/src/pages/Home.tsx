/*
 * Kinetic Street Signal: asymmetric neo-brutalist delivery landing page.
 * Route Lime, Signal Orange, compressed display type, and motion-led layers
 * keep the page fast, legible, and built for scroll capture.
 */
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Box,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  MoveUpRight,
  PackageCheck,
  Phone,
  Route as RouteIcon,
  X,
  Zap,
} from "lucide-react";

const heroAsset = "/manus-storage/viral-delivery-hero_45dd7d38.png";
const routeAsset = "/manus-storage/viral-delivery-route_0fe9e465.png";
const dropAsset = "/manus-storage/viral-delivery-drop_6a4738ad.png";
const markAsset = "/manus-storage/viral-delivery-mark_7b48c497.png";

const services = [
  {
    number: "01",
    title: "Food that lands hot",
    text: "A direct route from your favorite spots to your door, with smart handoffs that protect the moment you ordered for.",
    stat: "30–45 min",
    icon: <Zap size={20} strokeWidth={2.4} />,
  },
  {
    number: "02",
    title: "Shops, gifts, essentials",
    text: "From a last-minute gift to a full bag of essentials, we move the things your day suddenly needs.",
    stat: "Same day",
    icon: <Box size={20} strokeWidth={2.4} />,
  },
  {
    number: "03",
    title: "Business on the move",
    text: "Reliable local dispatch for teams that care about timing, presentation, and the person waiting on the other side.",
    stat: "Live status",
    icon: <RouteIcon size={20} strokeWidth={2.4} />,
  },
];

function useParallax() {
  const [point, setPoint] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      setPoint({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return point;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const offerRef = useRef<HTMLDivElement>(null);
  const point = useParallax();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToOffer = () => offerRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="site-shell">
      <div className="top-strip"><span>LOCAL. FAST. VISIBLE.</span><span>DELIVERY REIMAGINED <ArrowUpRight size={14} /></span></div>
      <header className={`site-nav ${scrollY > 24 ? "site-nav--scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="Viral Delivery home">
          <img src={markAsset} alt="" className="brand-mark" />
          <span>VIRAL<br /><em>DELIVERY</em></span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#how">How it moves</a>
          <a href="#services">Services</a>
          <a href="#offer">Get moving</a>
        </nav>
        <button className="nav-cta" onClick={goToOffer}>Order delivery <ArrowUpRight size={16} /></button>
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && <nav className="mobile-menu"><a href="#how" onClick={() => setMenuOpen(false)}>How it moves</a><a href="#services" onClick={() => setMenuOpen(false)}>Services</a><a href="#offer" onClick={() => setMenuOpen(false)}>Get moving</a></nav>}
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-gridline" />
          <div className="hero-copy"><div className="dispatch-ticket"><img src={markAsset} alt="" /><span>VD / DISPATCH 001</span><b>ATHENS · LIVE</b></div>
            <div className="eyebrow"><span className="live-dot" /> LIVE IN YOUR CITY <span className="eyebrow-line" /></div>
            <h1>MOVE<br /><span>THE</span> MOMENT.</h1>
            <p className="hero-lede">Food, essentials, gifts and everything in between — delivered with a little more speed, clarity and attitude.</p><div className="hero-promise"><span><Clock3 size={15} /> 30–45 MIN ETA</span><span><MapPin size={15} /> ATHENS / LOCAL ZONES</span></div>
            <div className="hero-actions"><button className="button button--lime" onClick={goToOffer}>Start a delivery <ArrowUpRight size={17} /></button><a className="text-link" href="#how">See how it moves <ArrowDownRight size={17} /></a></div>
            <div className="hero-footnote"><span>01 / 04</span><span>SCROLL TO DISCOVER</span><ArrowDownRight size={17} /></div>
          </div>
          <div className="hero-art" aria-hidden="true" style={{ transform: `translate3d(${point.x * 9}px, ${point.y * 9 - scrollY * 0.08}px, 0)` }}>
            <div className="hero-art-glow" />
            <div className="hero-art-tag tag-one">FAST HANDOFF <ArrowUpRight size={13} /></div>
            <div className="hero-art-tag tag-two">ROUTE / 24–7</div>
            <img src={heroAsset} alt="" className="hero-image" />
            <div className="hero-coordinate">37° 58′ 41″ N<br />23° 43′ 36″ E</div>
          </div>
          <div className="hero-side-label">VIRAL DELIVERY <span>↗</span></div>
        </section>

        <section className="ticker" aria-label="Delivery promise"><div className="ticker-track"><span>YOUR CITY, MOVING</span><i>✳</i><span>NO STATIC MOMENTS</span><i>✳</i><span>DELIVERY WITH SIGNAL</span><i>✳</i><span>YOUR CITY, MOVING</span><i>✳</i></div></section>

        <section className="manifesto-section route-stop" id="how"><div className="route-spine route-spine--light"><span>02</span><i></i><span>→</span></div>
          <div className="section-index"><span>02</span><span className="vertical-line" /><span>THE METHOD</span></div>
          <div className="manifesto-content"><p className="kicker">NOT JUST A DROP-OFF</p><h2>Delivery should feel<br /><span>like a green light.</span></h2><p className="body-copy">We connect the city’s best places and people with a delivery flow that is easy to start, simple to follow and impossible to miss.</p><div className="manifesto-note"><MapPin size={18} /><span>Built for Athens. Ready for wherever you are next.</span></div></div>
          <div className="route-visual" style={{ transform: `translate3d(${point.x * -8}px, ${point.y * -6}px, 0) rotate(${point.x * 2}deg)` }}><img src={routeAsset} alt="" /><div className="route-pin pin-a">A</div><div className="route-pin pin-b">B</div><svg viewBox="0 0 300 220" className="route-path" aria-hidden="true"><path d="M22 181 C74 118 83 193 134 126 S214 101 272 38" /></svg></div>
        </section>

        <section className="services-section route-stop" id="services"><div className="route-spine"><span>03</span><i></i><span>→</span></div>
          <div className="section-heading"><div><p className="kicker">WHAT WE MOVE</p><h2>Made for<br /><span>the now.</span></h2></div><p className="heading-aside">Three ways to keep the day in motion. One clear promise: it gets there.</p></div>
          <div className="service-list">{services.map((service) => <article className="service-card" key={service.number}><div className="service-number">{service.number}</div><div className="service-icon">{service.icon}</div><div className="service-main"><h3>{service.title}</h3><p>{service.text}</p></div><div className="service-stat"><span>{service.stat}</span><ArrowUpRight size={17} /></div></article>)}</div>
        </section>

        <section className="offer-section route-stop" id="offer" ref={offerRef}><div className="route-spine route-spine--lime"><span>04</span><i></i><span>→</span></div>
          <div className="offer-art" style={{ transform: `translate3d(${point.x * 6}px, ${point.y * 4}px, 0) rotate(${point.x * 1.3}deg)` }}><img src={dropAsset} alt="" /><div className="offer-sticker">NEW<br />DROP<br /><span>↗</span></div></div>
          <div className="offer-copy"><p className="kicker">YOUR NEXT MOVE</p><h2>Make it<br /><em>viral.</em></h2><p className="body-copy">Get your first delivery on us when you order through the new Viral route.</p><div className="offer-code"><span>USE CODE</span><strong>MOVEFAST</strong><button onClick={() => navigator.clipboard?.writeText("MOVEFAST")} aria-label="Copy offer code">COPY</button></div><button className="button button--black" onClick={() => window.open("tel:+302100000000", "_self")}>Call to order <Phone size={16} /></button></div>
          <div className="offer-corner">OFFER / 001</div>
        </section>

        <section className="proof-section route-stop"><div className="route-spine route-spine--orange"><span>05</span><i></i><span>→</span></div><div className="proof-label"><PackageCheck size={18} /> THE DELIVERY STANDARD</div><div className="proof-grid"><div><strong>01</strong><span>Clear ETA</span></div><div><strong>02</strong><span>Human handoff</span></div><div><strong>03</strong><span>Zero guesswork</span></div><div><strong>04</strong><span>Always moving</span></div></div></section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><div className="footer-ticket">FINAL HANDOFF / 06</div><img src={markAsset} alt="" className="brand-mark" /><span>VIRAL<br /><em>DELIVERY</em></span></div><p>Delivery pou fainetai<br />prin ftasei.</p><div className="footer-links"><a href="mailto:hello@viral.delivery">hello@viral.delivery <MoveUpRight size={15} /></a><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram <Instagram size={15} /></a></div><div className="footer-bottom"><span>© 2026 VIRAL DELIVERY</span><span>ATHENS / EVERYWHERE</span><a href="#top">BACK TO TOP ↑</a></div></footer>
    </div>
  );
}
