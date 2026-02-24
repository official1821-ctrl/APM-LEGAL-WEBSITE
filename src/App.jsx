import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const PRACTICE_AREAS = [
  {
    id: "civil-litigation",
    title: "Civil Litigation",
    short: "Aggressive courtroom strategy for complex disputes and injunctions.",
    detail:
      "We handle injunctions, recovery suits, property and contract conflicts with fast tactical filings and trial-ready briefs.",
    slug: "corporate-fraud-civil-disputes",
  },
  {
    id: "consumer-advocacy",
    title: "Consumer Advocacy",
    short: "Action against deceptive marketing, unfair trade practices, and service failures.",
    detail:
      "From misleading campaigns to defective services, we build evidence-led complaints and seek compensation before commissions and courts.",
    slug: "deceptive-marketing-consumer-disputes",
  },
  {
    id: "constitutional-law",
    title: "Constitutional Law",
    short: "Writ jurisdiction, rights protection, and policy challenge litigation.",
    detail:
      "We pursue writ remedies, challenge arbitrary state action, and protect civil liberties through focused constitutional strategy.",
    slug: "writs-rights-policy-challenges",
  },
  {
    id: "bail-applications",
    title: "Bail Applications",
    short: "Urgent anticipatory and regular bail representation with jurisdiction-first precision.",
    detail:
      "High-pressure bail and custody matters managed with immediate drafting, risk mapping, and courtroom execution.",
    slug: "urgent-bail-and-custody-defence",
  },
];

const TEAM = [
  {
    name: "A.P. Mishra",
    role: "Senior Advocate",
    email: "apmishra@apmlegal.in",
    phone: "+91 522 400 1101",
    vcard: "#",
  },
  {
    name: "Aaditya Mishra",
    role: "Managing Partner",
    email: "aaditya@apmlegal.in",
    phone: "+91 522 400 1102",
    vcard: "#",
  },
  {
    name: "Rhea Kapoor",
    role: "Associate — Consumer & Commercial",
    email: "rhea.k@apmlegal.in",
    phone: "+91 522 400 1112",
    vcard: "#",
  },
  {
    name: "Vikram S. Rao",
    role: "Associate — Constitutional & Appellate",
    email: "vikram.rao@apmlegal.in",
    phone: "+91 522 400 1119",
    vcard: "#",
  },
];

const initialBooking = {
  name: "",
  email: "",
  phone: "",
  matterType: "",
  opponent: "",
  jurisdiction: "",
  summary: "",
  slot: "",
};

function useMousePosition() {
  const [point, setPoint] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    const move = (e) => setPoint({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return point;
}

function App() {
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

  const openPractice = (practice) => {
    window.location.hash = `practice/${practice.slug}`;
  };

  const closePractice = () => {
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
    setActivePractice(null);
  };

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app-shell">
      <CustomCursor />
      <Hero onConsultClick={scrollToBooking} />

      <section className="section section-practice" id="practice-areas">
        <div className="container">
          <h2>Dynamic Practice Areas</h2>
          <p className="subtle-copy">Hover to illuminate and click to open a focused expertise page.</p>
          <div className="practice-grid">
            {PRACTICE_AREAS.map((area) => (
              <PracticeCard key={area.id} area={area} onOpen={openPractice} />
            ))}
          </div>
        </div>
      </section>

      <section ref={bookingRef} className="section section-booking" id="booking-engine">
        <div className="container narrow">
          <h2>Smart Appointment Booking Engine</h2>
          <BookingEngine />
        </div>
      </section>

      <section className="section section-roster" id="roster-location">
        <div className="container">
          <h2>Roster & Location</h2>
          <div className="roster-grid">
            {TEAM.map((member, index) => (
              <TeamCard key={member.email} member={member} spotlight={index === 0} />
            ))}
          </div>

          <div className="location-hub">
            <iframe
              title="APM Legal Services LLP Lucknow"
              src="https://maps.google.com/maps?q=Lucknow%20High%20Court&t=&z=13&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="location-copy">
              <h3>Lucknow Office</h3>
              <p>APM Legal Services LLP, Near High Court, Qaiserbagh, Lucknow, Uttar Pradesh 226001</p>
              <p>Mon–Sat · 9:30 AM – 8:00 PM</p>
              <a className="ghost-btn" href="https://maps.google.com/?q=Lucknow%20High%20Court" target="_blank" rel="noreferrer">
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activePractice && (
          <motion.div className="practice-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article
              className="practice-modal"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
            >
              <p className="modal-kicker">Dedicated Expertise Page</p>
              <h3>{activePractice.title}</h3>
              <p>{activePractice.detail}</p>
              <div className="hero-actions">
                <button className="cta-btn" onClick={closePractice}>Close</button>
                <button className="ghost-btn" onClick={scrollToBooking}>Book consultation</button>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Hero({ onConsultClick }) {
  const [hovering, setHovering] = React.useState(false);
  const mouse = useMousePosition();

  return (
    <header className="hero">
      <div className="hero-noise" />
      <motion.h1
        className="hero-title"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={
          hovering
            ? {
                backgroundImage: `radial-gradient(circle at ${mouse.x}px ${mouse.y}px, rgba(255,255,255,0.9), rgba(200,160,77,0.95) 20%, rgba(238,238,238,0.15) 40%, rgba(255,255,255,0.05) 75%)`,
              }
            : undefined
        }
      >
        APM LEGAL SERVICES LLP
      </motion.h1>
      <p className="hero-tagline">Strategic Advocacy. Relentless Pursuit of Justice.</p>
      <button className="cta-btn glowing" onClick={onConsultClick}>
        Consult With Us
      </button>
    </header>
  );
}

function PracticeCard({ area, onOpen }) {
  const cardRef = React.useRef(null);

  const onMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) / 18;
    const y = (e.clientY - rect.top - rect.height / 2) / 18;
    cardRef.current.style.transform = `rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`;
  };

  const reset = () => {
    if (cardRef.current) cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  return (
    <article
      className="practice-card"
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={() => onOpen(area)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(area)}
    >
      <h3>{area.title}</h3>
      <p>{area.short}</p>
      <span>Open expertise page →</span>
    </article>
  );
}

function BookingEngine() {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState(initialBooking);

  const steps = React.useMemo(() => {
    const queue = [
      { key: "name", label: "What is your full name?", type: "text" },
      { key: "email", label: "Your best email address?", type: "email" },
      { key: "phone", label: "Phone number for urgent coordination?", type: "tel" },
      {
        key: "matterType",
        label: "What kind of legal matter is this?",
        type: "select",
        options: ["Civil Litigation", "Consumer Dispute", "Constitutional", "Bail Application"],
      },
    ];

    if (form.matterType === "Consumer Dispute") {
      queue.push({ key: "opponent", label: "Which company is the dispute against?", type: "text" });
    }

    if (form.matterType === "Bail Application") {
      queue.push({ key: "jurisdiction", label: "Relevant court or jurisdiction?", type: "text" });
    }

    queue.push({ key: "summary", label: "Briefly describe your matter.", type: "textarea" });
    queue.push({ key: "slot", label: "Pick a preferred consultation slot.", type: "slot" });

    return queue;
  }, [form.matterType]);

  React.useEffect(() => {
    if (step >= steps.length) setStep(steps.length - 1);
  }, [step, steps.length]);

  const current = steps[step];
  const canContinue = form[current.key]?.trim?.() || form[current.key];

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="booking-shell">
      <div className="progress-rail">
        <span style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
          transition={{ duration: 0.3 }}
          className="question-card"
        >
          <p className="step-count">Question {step + 1} of {steps.length}</p>
          <h3>{current.label}</h3>
          <FieldRenderer step={current} value={form[current.key]} onChange={(v) => setValue(current.key, v)} />

          <div className="hero-actions">
            <button className="ghost-btn" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
              Back
            </button>
            {step < steps.length - 1 ? (
              <button className="cta-btn" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
                Next
              </button>
            ) : (
              <button className="cta-btn" disabled={!canContinue}>Request Consultation</button>
            )}
          </div>
          <p className="subtle-copy small">Final step aligns with calendar availability for preliminary consultation scheduling.</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FieldRenderer({ step, value, onChange }) {
  if (step.type === "textarea") return <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} />;
  if (step.type === "select") {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select one</option>
        {step.options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    );
  }
  if (step.type === "slot") {
    const slots = ["Mon · 10:00 AM", "Tue · 1:30 PM", "Wed · 5:00 PM", "Fri · 11:15 AM"];
    return (
      <div className="slot-grid">
        {slots.map((slot) => (
          <button key={slot} className={`slot-btn ${value === slot ? "active" : ""}`} onClick={() => onChange(slot)}>
            {slot}
          </button>
        ))}
      </div>
    );
  }

  return <input type={step.type} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function TeamCard({ member, spotlight }) {
  return (
    <article className={`team-card ${spotlight ? "spotlight" : ""}`}>
      <div className="portrait" aria-hidden="true">
        {member.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </div>
      <div className="team-meta">
        <h3>{member.name}</h3>
        <p>{member.role}</p>
      </div>
      <div className="team-reveal">
        <a href={`mailto:${member.email}`}>{member.email}</a>
        <a href={`tel:${member.phone.replace(/\s/g, "")}`}>{member.phone}</a>
        <a href={member.vcard}>Download V-Card</a>
      </div>
    </article>
  );
}

function CustomCursor() {
  const point = useMousePosition();
  return <div className="custom-cursor" style={{ transform: `translate(${point.x - 12}px, ${point.y - 12}px)` }} />;
}

export default App;
