import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_ITEMS = ["About Us", "Services", "People", "Insights", "Careers", "Contact Us"];
const WHATSAPP_NUMBER = "918553332320";
const CONSULTATION_FEE = 2500;

const PRACTICE_AREAS = [
  { id: "civil-litigation", title: "Civil Litigation", short: "Strategic injunctions, recovery and high-value disputes.", detail: "Trial-ready pleadings, aggressive interim strategy and focused courtroom execution.", slug: "corporate-fraud-civil-disputes" },
  { id: "consumer-advocacy", title: "Consumer Advocacy", short: "Action against deceptive marketing and unfair practices.", detail: "Evidence-led complaints and compensation strategy before commissions and courts.", slug: "deceptive-marketing-consumer-disputes" },
  { id: "constitutional-law", title: "Constitutional Law", short: "Writ remedies against arbitrary state action.", detail: "Targeted constitutional relief and urgent rights protection in higher courts.", slug: "writs-rights-policy-challenges" },
  { id: "bail-applications", title: "Bail Applications", short: "Urgent anticipatory and regular bail defence.", detail: "Fast filings, custody-risk mapping and persuasive oral submissions.", slug: "urgent-bail-and-custody-defence" },
];

const TEAM = [
  { name: "Shri Ayodhya Prasad Mishra", role: "Senior Counsel & Founder", email: "founder@apmlegal.in", phone: "+91 85533 32320", vcard: "#" },
  { name: "Rituraj Mishra", role: "Partner — Criminal, Corporate & Emerging Technology Law", email: "rituraj@apmlegal.in", phone: "+91 85533 32320", vcard: "#" },
  { name: "Prerna Mishra", role: "Chief Consulting Officer", email: "prerna@apmlegal.in", phone: "+91 85533 32320", vcard: "#" },
  { name: "Gaurav Pandey", role: "Associate", email: "gaurav@apmlegal.in", phone: "+91 85533 32320", vcard: "#" },
  { name: "Akhil Mishra", role: "Junior Associate", email: "akhil@apmlegal.in", phone: "+91 85533 32320", vcard: "#" },
  { name: "Kushal Mishra", role: "Junior Associate", email: "kushal@apmlegal.in", phone: "+91 85533 32320", vcard: "#" },
];

const initialBooking = {
  name: "", email: "", phone: "", matterType: "", urgency: "", consultationMode: "", opponent: "", issueType: "",
  firNumber: "", policeStation: "", disputeValue: "", challengedAuthority: "", summary: "", docsReady: "", slot: "",
  paymentMethod: "", transactionRef: "",
};

const waLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

function useMousePosition() {
  const [point, setPoint] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    const move = (e) => setPoint({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return point;
}

export default function App() {
  const bookingRef = React.useRef(null);
  const [activePractice, setActivePractice] = React.useState(null);

  React.useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.replace("#practice/", "");
      setActivePractice(PRACTICE_AREAS.find((item) => item.slug === id) || null);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const closePractice = React.useCallback(() => {
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
    setActivePractice(null);
  }, []);

  React.useEffect(() => {
    if (!activePractice) return;
    const onEsc = (event) => {
      if (event.key === "Escape") closePractice();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [activePractice, closePractice]);

  return (
    <div className="app-shell">
      <CursorAura />
      <CustomCursor />
      <TopNav />
      <Hero onConsultClick={() => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} />

      <section className="section">
        <div className="container">
          <h2>Criminal Litigation</h2>
          <p className="subtle-copy">Specialist criminal litigation strategy for bail, trial defence, and rights protection.</p>
          <div className="practice-grid">{PRACTICE_AREAS.map((area) => <PracticeCard key={area.id} area={area} onOpen={() => (window.location.hash = `practice/${area.slug}`)} />)}</div>
        </div>
      </section>

      <section ref={bookingRef} className="section">
        <div className="container narrow">
          <h2>Consutation booking</h2>
          <p className="subtle-copy">Responsive intake, payment confirmation, and instant WhatsApp escalation.</p>
          <BookingEngine />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Roster & Leadership</h2>
          <div className="roster-grid">{TEAM.map((member, index) => <TeamCard key={member.name} member={member} spotlight={index === 0} />)}</div>
        </div>
      </section>

      <AnimatePresence>
        {activePractice && (
          <motion.div
            className="practice-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePractice}
          >
            <motion.article
              className="practice-modal"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <p className="modal-kicker">Dedicated Expertise Page</p>
              <h3>{activePractice.title}</h3>
              <p>{activePractice.detail}</p>
              <button className="ghost-btn modal-close" onClick={closePractice}>Close</button>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TopNav() {
  return <nav className="top-nav"><div className="container nav-inner"><span className="brand">APM LEGAL</span><div className="nav-links">{NAV_ITEMS.map((i) => <a key={i} href="#">{i}</a>)}</div></div></nav>;
}

function Hero({ onConsultClick }) {
  const [hovering, setHovering] = React.useState(false);
  const mouse = useMousePosition();
  return (
    <header className="hero">
      <div className="hero-backglow" style={{ transform: `translate(${(mouse.x - window.innerWidth / 2) * 0.016}px, ${(mouse.y - window.innerHeight / 2) * 0.016}px)` }} />
      <p className="hero-kicker">Luxury Legal Advisory • Litigation Excellence</p>
      <motion.h1 className="hero-title" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} style={hovering ? { backgroundImage: `radial-gradient(circle at ${mouse.x}px ${mouse.y}px,#fff 0%,#f2d7a2 30%,rgba(255,255,255,.2) 58%,rgba(255,255,255,.05) 82%)` } : undefined}>
        <span>APM LEGAL</span>
        <span>SERVICES LLP</span>
      </motion.h1>
      <p className="hero-tagline">Strategic Advocacy. Relentless Pursuit of Justice.</p>
      <div className="hero-actions"><button className="cta-btn glowing" onClick={onConsultClick}>Consult With Us</button><span className="status-pill">Criminal • Corporate • Constitutional</span></div>
    </header>
  );
}

function PracticeCard({ area, onOpen }) {
  const cardRef = React.useRef(null);
  const onMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) / 16;
    const y = (e.clientY - rect.top - rect.height / 2) / 16;
    cardRef.current.style.transform = `rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
  };
  return <article className="practice-card" ref={cardRef} onMouseMove={onMove} onMouseLeave={() => cardRef.current && (cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)")} onClick={onOpen}><h3>{area.title}</h3><p>{area.short}</p><span>Open expertise page →</span></article>;
}

function BookingEngine() {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState(initialBooking);

  const steps = React.useMemo(() => {
    const q = [
      { key: "name", label: "Full name", helper: "As per official record.", type: "text" },
      { key: "email", label: "Primary email", helper: "For all communication and receipt.", type: "email" },
      { key: "phone", label: "Phone number", helper: "For urgent legal coordination.", type: "tel" },
      { key: "matterType", label: "Legal matter type", helper: "Select core matter to route specialist counsel.", type: "select", options: ["Civil Litigation", "Consumer Dispute", "Constitutional", "Bail Application"] },
      { key: "urgency", label: "Urgency", helper: "Used for consultation priority.", type: "select", options: ["Immediate (within 24 hours)", "High (2-3 days)", "Standard (within a week)"] },
      { key: "consultationMode", label: "Consultation mode", helper: "In-office, video, or phone.", type: "select", options: ["In-office (Lucknow)", "Video consultation", "Phone consultation"] },
    ];
    if (form.matterType === "Consumer Dispute") q.push({ key: "opponent", label: "Company/business involved", helper: "Mention legal entity if known.", type: "text" }, { key: "issueType", label: "Primary consumer grievance", helper: "Choose issue category.", type: "select", options: ["Defective product", "Deficiency of service", "Unfair trade practice", "Refund/compensation refusal"] });
    if (form.matterType === "Bail Application") q.push({ key: "firNumber", label: "FIR/case number", helper: "If available.", type: "text" }, { key: "policeStation", label: "Police station/jurisdiction", helper: "City and station preferred.", type: "text" });
    if (form.matterType === "Civil Litigation") q.push({ key: "disputeValue", label: "Approx. dispute value", helper: "Example: ₹10 lakh.", type: "text" });
    if (form.matterType === "Constitutional") q.push({ key: "challengedAuthority", label: "Authority/order challenged", helper: "Department or authority.", type: "text" });
    q.push({ key: "summary", label: "Brief case summary", helper: "2-5 lines for first review.", type: "textarea" }, { key: "docsReady", label: "Documents ready?", helper: "FIR, notice, agreements, orders, etc.", type: "select", options: ["Yes", "Partially", "No"] }, { key: "slot", label: "Preferred consultation slot", helper: "Select available slot.", type: "slot" }, { key: "paymentMethod", label: `Consultation fee payment (₹${CONSULTATION_FEE.toLocaleString("en-IN")})`, helper: "Required to confirm booking.", type: "payment" });
    return q;
  }, [form.matterType]);

  const current = steps[Math.min(step, steps.length - 1)];
  const canContinue = current.type === "payment" ? Boolean(form.paymentMethod && form.transactionRef.trim()) : current.type === "slot" ? Boolean(form.slot) : Boolean(form[current.key]?.trim?.() || form[current.key]);

  const leadMsg = `Consultation request:%0AName: ${form.name || "-"}%0APhone: ${form.phone || "-"}%0AMatter: ${form.matterType || "-"}%0AUrgency: ${form.urgency || "-"}%0ASummary: ${form.summary || "-"}`;

  return (
    <div className="booking-shell">
      <div className="progress-rail"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
      <AnimatePresence mode="wait">
        <motion.div key={current.key} className="question-card special" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <p className="step-count">Question {step + 1} of {steps.length}</p>
          <h3>{current.label}</h3>
          <p className="question-helper">{current.helper}</p>
          <FieldRenderer step={current} form={form} setForm={setForm} />
          <div className="form-nav-row">
            <button className="ghost-btn" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</button>
            {step < steps.length - 1 ? <button className="cta-btn" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>Next</button> : <button className="cta-btn glowing" disabled={!canContinue}>Confirm & Pay ₹{CONSULTATION_FEE.toLocaleString("en-IN")}</button>}
          </div>
          <a className="whatsapp-btn" href={waLink(leadMsg)} target="_blank" rel="noreferrer">Continue on WhatsApp (+91-8553332320)</a>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FieldRenderer({ step, form, setForm }) {
  const value = form[step.key];
  const onChange = (next) => setForm((prev) => ({ ...prev, [step.key]: next }));
  if (step.type === "textarea") return <textarea rows={5} value={value} onChange={(e) => onChange(e.target.value)} />;
  if (step.type === "select") return <select value={value} onChange={(e) => onChange(e.target.value)}><option value="">Select one</option>{step.options.map((opt) => <option key={opt}>{opt}</option>)}</select>;
  if (step.type === "slot") {
    const slots = ["Mon · 10:00 AM", "Tue · 1:30 PM", "Wed · 5:00 PM", "Fri · 11:15 AM", "Sat · 12:30 PM"];
    return <div className="slot-grid">{slots.map((slot) => <button key={slot} className={`slot-btn ${value === slot ? "active" : ""}`} onClick={() => onChange(slot)}>{slot}</button>)}</div>;
  }
  if (step.type === "payment") {
    return <div className="payment-block"><div className="payment-method-grid">{["UPI", "Card", "Net Banking"].map((method) => <button key={method} className={`payment-method ${form.paymentMethod === method ? "active" : ""}`} onClick={() => setForm((prev) => ({ ...prev, paymentMethod: method }))}>{method}</button>)}</div><label className="input-label">Transaction reference / UTR number<input type="text" placeholder="Enter payment reference" value={form.transactionRef} onChange={(e) => setForm((prev) => ({ ...prev, transactionRef: e.target.value }))} /></label></div>;
  }
  return <input type={step.type} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function TeamCard({ member, spotlight }) {
  return <article className={`team-card ${spotlight ? "spotlight" : ""}`}><div className="portrait" aria-hidden="true">{member.name.split(" ").map((n) => n[0]).join("")}</div><div className="team-meta"><h3>{member.name}</h3><p>{member.role}</p></div><div className="team-reveal"><a href={`mailto:${member.email}`}>{member.email}</a><a href={`tel:${member.phone.replace(/\s/g, "")}`}>{member.phone}</a><a href={member.vcard}>Download V-Card</a></div></article>;
}

function CursorAura() {
  const point = useMousePosition();
  return <div className="cursor-aura" style={{ transform: `translate(${point.x - 280}px, ${point.y - 280}px)` }} />;
}

function CustomCursor() {
  const point = useMousePosition();
  const [trail, setTrail] = React.useState(Array.from({ length: 10 }, () => ({ x: 0, y: 0 })));
  React.useEffect(() => {
    let frame = 0;
    const animate = () => {
      setTrail((prev) => {
        const next = [...prev];
        next[0] = { x: point.x, y: point.y };
        for (let i = 1; i < next.length; i += 1) next[i] = { x: next[i].x + (next[i - 1].x - next[i].x) * 0.34, y: next[i].y + (next[i - 1].y - next[i].y) * 0.34 };
        return next;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [point]);

  return <>{trail.map((dot, idx) => <span key={`trail-${idx}`} className="cursor-trail" style={{ transform: `translate(${dot.x - 4}px, ${dot.y - 4}px) scale(${1 - idx * 0.08})`, opacity: 1 - idx * 0.09 }} />)}<span className="custom-cursor" style={{ transform: `translate(${point.x - 14}px, ${point.y - 14}px)` }} /></>;
}
