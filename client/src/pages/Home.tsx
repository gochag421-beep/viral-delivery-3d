/**
 * FASTMOVMENT: a kinetic marketplace connecting people who need deliveries
 * with independent local drivers who can make them happen.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import LanguageMenu from "@/components/LanguageMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Box,
  Clock3,
  MapPin,
  Menu,
  MoveUpRight,
  PackageCheck,
  Phone,
  Route as RouteIcon,
  Users,
  X,
  Zap,
} from "lucide-react";

const heroAsset = "https://viraldel3d-p4acy5hk.manus.space/manus-storage/viral-delivery-hero_45dd7d38.png";
const routeAsset = "https://viraldel3d-p4acy5hk.manus.space/manus-storage/fastmovment-route-sketch_44de6d16.png";
const dropAsset = "https://viraldel3d-p4acy5hk.manus.space/manus-storage/fastmovment-offer-sketch_85eba96e.png";
const markAsset = "https://viraldel3d-p4acy5hk.manus.space/manus-storage/viral-delivery-mark_7b48c497.png";

const greekServices = [
  { title: "Για όσους χρειάζονται οδηγό", text: "Δημοσίευσε μια παράδοση, δες διαθέσιμους τοπικούς οδηγούς και διάλεξε τη διαδρομή που ταιριάζει στον χρόνο και το budget σου.", stat: "Βρες ταίρι" },
  { title: "Για οδηγούς έτοιμους για κίνηση", text: "Κάνε τη διαδρομή σου ευκαιρία. Διάλεξε κοντινά αιτήματα, δήλωσε διαθεσιμότητα και κράτα τον έλεγχο της ημέρας σου.", stat: "Οδήγησε με τους όρους σου" },
  { title: "Για καταστήματα και ομάδες", text: "Δώσε στους πελάτες αξιόπιστη επιλογή παράδοσης χωρίς να φτιάξεις δικό σου στόλο. Συνδέσου με τοπική δυναμικότητα όταν τη χρειάζεσαι.", stat: "Μεγάλωσε τοπικά" },
];

const services = [
  {
    number: "01",
    title: "For people who need a driver",
    text: "Post a delivery, see available local drivers, and choose the route that fits your timing and budget.",
    stat: "Find a match",
    icon: <Zap size={20} strokeWidth={2.4} />,
  },
  {
    number: "02",
    title: "For drivers ready to move",
    text: "Turn your route into an opportunity. Pick up nearby requests, set your availability, and keep control of your day.",
    stat: "Drive on your terms",
    icon: <RouteIcon size={20} strokeWidth={2.4} />,
  },
  {
    number: "03",
    title: "For shops and teams",
    text: "Give customers a reliable delivery option without building your own fleet. Connect to local capacity when you need it.",
    stat: "Scale locally",
    icon: <Box size={20} strokeWidth={2.4} />,
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
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const { language } = useLanguage();
  const isGreek = language === "el";

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
      <div className="top-strip"><span>{isGreek ? "ΜΙΑ ΠΟΛΗ. ΔΥΟ ΠΛΕΥΡΕΣ. ΠΑΝΤΑ ΣΕ ΚΙΝΗΣΗ." : "ONE CITY. TWO SIDES. ALWAYS MOVING."}</span><span>{isGreek ? "ΤΟ ΔΙΚΤΥΟ ΟΔΗΓΩΝ" : "THE DRIVER NETWORK"} <ArrowUpRight size={14} /></span></div>
      <header className={`site-nav ${scrollY > 24 ? "site-nav--scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label={isGreek ? "Αρχική FASTMOVMENT" : "FASTMOVMENT home"}>
          <img src={markAsset} alt="" className="brand-mark" />
          <span>FAST<br /><em>MOVMENT</em></span>
        </a>
        <nav className="nav-links" aria-label={isGreek ? "Κύρια πλοήγηση" : "Main navigation"}>
          <a href="#how">{isGreek ? "Πώς λειτουργεί" : "How it works"}</a>
          <a href="#services">{isGreek ? "Για επιχειρήσεις" : "For businesses"}</a>
          <a href="#offer">{isGreek ? "Μπες στο δίκτυο" : "Join the network"}</a>
        </nav>
        <button className="nav-cta" onClick={goToOffer}>{isGreek ? "Βρες τη θέση σου" : "Find your side"} <ArrowUpRight size={16} /></button><LanguageMenu />
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={isGreek ? "Εναλλαγή πλοήγησης" : "Toggle navigation"}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && <nav className="mobile-menu"><a href="#how" onClick={() => setMenuOpen(false)}>{isGreek ? "Πώς λειτουργεί" : "How it works"}</a><a href="#services" onClick={() => setMenuOpen(false)}>{isGreek ? "Για επιχειρήσεις" : "For businesses"}</a><a href="#offer" onClick={() => setMenuOpen(false)}>{isGreek ? "Μπες στο δίκτυο" : "Join the network"}</a><LanguageMenu /></nav>}
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-gridline" />
          <div className="hero-copy"><div className="dispatch-ticket"><img src={markAsset} alt="" /><span>FM / NETWORK 001</span><b>ATHENS · OPEN</b></div>
            <div className="eyebrow"><span className="live-dot" /> {isGreek ? "Η ΠΟΛΗ, ΣΥΝΔΕΔΕΜΕΝΗ" : "THE CITY, CONNECTED"} <span className="eyebrow-line" /></div>
            <h1>FASTMOVMENT</h1>
            <p className="hero-lede">{isGreek ? "Το τοπικό δίκτυο που συνδέει κάθε αίτημα παράδοσης με διαθέσιμο οδηγό — γρήγορα, καθαρά και με τους δικούς σου όρους." : "The local network that connects every delivery request with an available driver — faster, clearer, and on your terms."}</p><div className="hero-promise"><span><Users size={15} /> {isGreek ? "ΠΕΛΑΤΕΣ + ΟΔΗΓΟΙ" : "CUSTOMERS + DRIVERS"}</span><span><MapPin size={15} /> {isGreek ? "ΑΘΗΝΑ / ΤΟΠΙΚΕΣ ΖΩΝΕΣ" : "ATHENS / LOCAL ZONES"}</span></div>
            <div className="hero-actions"><a className="button button--lime" href="/order">{isGreek ? "Βρες οδηγό" : "Find a driver"} <ArrowUpRight size={17} /></a><a className="text-link" href="#how">{isGreek ? "Δες πώς λειτουργεί" : "See how it works"} <ArrowDownRight size={17} /></a></div>
            <div className="hero-footnote"><span>01 / 04</span><span>{isGreek ? "ΚΙΝΗΣΟΥ ΜΕ ΤΟΝ ΤΡΟΠΟ ΣΟΥ" : "MOVE YOUR WAY"}</span><ArrowDownRight size={17} /></div>
          </div>
          <div className="hero-art" aria-hidden="true" style={{ transform: `translate3d(${point.x * 9}px, ${point.y * 9 - scrollY * 0.08}px, 0)` }}>
            <div className="hero-art-glow" />
            <div className="hero-art-tag tag-one">{isGreek ? "ΤΑΙΡΙΑΣΜΑ ΣΕ ΚΙΝΗΣΗ" : "MATCH IN MOTION"} <ArrowUpRight size={13} /></div><div className="hero-art-tag tag-two">{isGreek ? "ΟΔΗΓΟΙ / 24–7" : "DRIVERS / 24–7"}</div>
            <img src={heroAsset} alt="" className="hero-image" />
            <div className="hero-coordinate">37° 58′ 41″ N<br />23° 43′ 36″ E</div>
          </div>
          <div className="hero-side-label">FASTMOVMENT <span>↗</span></div>
        </section>

        <section className="ticker" aria-label={isGreek ? "Υπόσχεση marketplace" : "Marketplace promise"}><div className="ticker-track"><span>{isGreek ? "ΖΗΤΑ ΟΔΗΓΟ" : "REQUEST A DRIVER"}</span><i>✳</i><span>{isGreek ? "ΟΔΗΓΗΣΕ ΤΗ ΔΙΑΔΡΟΜΗ ΣΟΥ" : "DRIVE YOUR ROUTE"}</span><i>✳</i><span>{isGreek ? "ΕΝΑ ΔΙΚΤΥΟ, ΠΕΡΙΣΣΟΤΕΡΕΣ ΕΠΙΛΟΓΕΣ" : "ONE NETWORK, MORE OPTIONS"}</span><i>✳</i><span>{isGreek ? "ΖΗΤΑ ΟΔΗΓΟ" : "REQUEST A DRIVER"}</span><i>✳</i></div></section>

        <section className="manifesto-section route-stop" id="how"><div className="route-spine route-spine--light"><span>02</span><i></i><span>→</span></div>
          <div className="section-index"><span>02</span><span className="vertical-line" /><span>{isGreek ? "Η ΣΥΝΔΕΣΗ" : "THE CONNECTION"}</span></div>
          <div className="manifesto-content"><p className="kicker">{isGreek ? "ΟΧΙ ΕΤΑΙΡΕΙΑ ΠΑΡΑΔΟΣΕΩΝ" : "NOT A DELIVERY COMPANY"}</p><h2>{isGreek ? "Ένα αίτημα." : "One request."}<br /><span>{isGreek ? "Ένας πραγματικός οδηγός." : "One real driver."}</span></h2><p className="body-copy">{isGreek ? "Το FASTMOVMENT είναι ο σύνδεσμος ανάμεσα σε εκείνον που χρειάζεται να μετακινηθεί κάτι και στον τοπικό οδηγό που είναι έτοιμος να το αναλάβει. Διάλεξε πλευρά, βάλε τις λεπτομέρειες και κράτα την πόλη σε κίνηση." : "FASTMOVMENT is the layer between the person who needs something moved and the local driver ready to make it happen. Choose a side, set the details, and keep the city moving together."}</p><div className="manifesto-note"><MapPin size={18} /><span>{isGreek ? "Φτιαγμένο για την Αθήνα. Ανοιχτό σε κάθε χρήσιμη διαδρομή." : "Built for Athens. Open to every useful route."}</span></div></div>
          <div className="route-visual" style={{ transform: `translate3d(${point.x * -8}px, ${point.y * -6}px, 0) rotate(${point.x * 2}deg)` }}><img src={routeAsset} alt="" /><div className="route-pin pin-a">A</div><div className="route-pin pin-b">B</div><svg viewBox="0 0 300 220" className="route-path" aria-hidden="true"><path d="M22 181 C74 118 83 193 134 126 S214 101 272 38" /></svg></div>
        </section>

        <section className="services-section route-stop" id="services"><div className="route-spine"><span>03</span><i></i><span>→</span></div>
          <div className="section-heading"><div><p className="kicker">{isGreek ? "ΓΙΑ ΠΟΙΟΥΣ ΕΙΝΑΙ" : "WHO IT IS FOR"}</p><h2>{isGreek ? "Διάλεξε τη" : "Pick your"}<br /><span>{isGreek ? "θέση σου." : "side."}</span></h2></div><p className="heading-aside">{isGreek ? "Ένα κοινό δίκτυο για όσους στέλνουν, τους οδηγούς που κινούνται και τις επιχειρήσεις που μεγαλώνουν." : "A shared network for the people sending, the drivers moving, and the businesses growing."}</p></div>
          <div className="service-list">{services.map((service) => <article className="service-card" key={service.number}><div className="service-number">{service.number}</div><div className="service-icon">{service.icon}</div><div className="service-main"><h3>{isGreek ? greekServices[Number(service.number) - 1]?.title : service.title}</h3><p>{isGreek ? greekServices[Number(service.number) - 1]?.text : service.text}</p></div><div className="service-stat"><span>{isGreek ? greekServices[Number(service.number) - 1]?.stat : service.stat}</span><ArrowUpRight size={17} /></div></article>)}</div>
        </section>

        <section className="offer-section route-stop" id="offer" ref={offerRef}><div className="route-spine route-spine--lime"><span>04</span><i></i><span>→</span></div>
          <div className="offer-art" style={{ transform: `translate3d(${point.x * 6}px, ${point.y * 4}px, 0) rotate(${point.x * 1.3}deg)` }}><img src={dropAsset} alt="" /><div className="offer-sticker">{isGreek ? "Η ΔΙΚΗ ΣΟΥ" : "YOUR"}<br />{isGreek ? "ΚΙΝΗΣΗ" : "MOVE"}<br /><span>↗</span></div></div>
          <div className="offer-copy"><p className="kicker">{isGreek ? "ΔΙΑΛΕΞΕ ΤΗΝ ΠΛΕΥΡΑ ΣΟΥ" : "CHOOSE YOUR SIDE"}</p><h2>{isGreek ? "Μπες σε" : "Get in"}<br /><em>{isGreek ? "κίνηση." : "motion."}</em></h2><p className="body-copy">{isGreek ? "Χρειάζεσαι να μετακινηθεί κάτι; Βρες έναν τοπικό οδηγό. Έχεις όχημα και χρόνο; Κάνε τη διαδρομή σου την επόμενη ευκαιρία σου." : "Need something moved? Find a local driver. Have a vehicle and time? Turn your route into your next opportunity."}</p><div className="offer-code"><span>{isGreek ? "ΓΙΑ ΟΔΗΓΟΥΣ" : "FOR DRIVERS"}</span><strong>JOIN FM</strong><button onClick={() => navigator.clipboard?.writeText("JOIN FM")} aria-label={isGreek ? "Αντιγραφή κωδικού εγγραφής οδηγού" : "Copy driver signup code"}>{isGreek ? "ΑΝΤΙΓΡΑΦΗ" : "COPY"}</button></div><a className="button button--black" href="/order">{isGreek ? "Ξεκίνα με το FASTMOVMENT" : "Start with FASTMOVMENT"} <ArrowUpRight size={16} /></a></div>
          <div className="offer-corner">NETWORK / 001</div>
        </section>

        <section className="proof-section route-stop"><div className="route-spine route-spine--orange"><span>05</span><i></i><span>→</span></div><div className="proof-label"><PackageCheck size={18} /> {isGreek ? "ΤΟ STANDARD ΤΟΥ ΔΙΚΤΥΟΥ" : "THE NETWORK STANDARD"}</div><div className="proof-grid"><div><strong>01</strong><span>{isGreek ? "Καθαρά αιτήματα" : "Clear requests"}</span></div><div><strong>02</strong><span>{isGreek ? "Τοπικοί οδηγοί" : "Local drivers"}</span></div><div><strong>03</strong><span>{isGreek ? "Ευέλικτες διαδρομές" : "Flexible routes"}</span></div><div><strong>04</strong><span>{isGreek ? "Περισσότερος έλεγχος" : "More control"}</span></div></div></section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><div className="footer-ticket">NETWORK / 06</div><img src={markAsset} alt="" className="brand-mark" /><span>FAST<br /><em>MOVMENT</em></span></div><p>FASTMOVEMENT<br />ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε.</p><div className="footer-links"><a href="mailto:companygroup@gmail.com">companygroup@gmail.com <MoveUpRight size={15} /></a><a href="tel:+306982274382">698 227 4382 <Phone size={15} /></a><a href="https://maps.google.com/?q=Kassianis+15+Ano+Liosia+13341" target="_blank" rel="noreferrer">Κασσιανής 15, Άνω Λιόσια<br />ΤΚ 13341 <MapPin size={15} /></a></div><div className="footer-bottom"><span>© 2026 FASTMOVEMENT ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε.</span><span>ΑΝΩ ΛΙΟΣΙΑ / ΑΘΗΝΑ</span><a href="#top">{isGreek ? "ΠΙΣΩ ΣΤΗΝ ΚΟΡΥΦΗ ↑" : "BACK TO TOP ↑"}</a></div></footer>
    </div>
  );
}
