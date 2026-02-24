import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const PRACTICE_AREAS = [
  {
    id: "civil-litigation",
    title: "Civil Litigation",
    short: "Decisive courtroom strategy for injunctions, recovery and high-value disputes.",
    detail:
      "From interim relief to trial execution, we structure pleadings and evidence with pressure-tested litigation playbooks.",
    slug: "corporate-fraud-civil-disputes",
  },
  {
    id: "consumer-advocacy",
    title: "Consumer Advocacy",
    short: "Remedies for deceptive marketing, unfair terms, and service negligence.",
    detail:
      "We prosecute non-compliance by large brands through evidence-first complaints, compensation strategy, and hard negotiation.",
    slug: "deceptive-marketing-consumer-disputes",
  },
  {
    id: "constitutional-law",
    title: "Constitutional Law",
    short: "Targeted writ actions to challenge arbitrary state action and rights violations.",
    detail:
      "Our constitutional team builds focused records and sharp pleadings for time-sensitive interventions before higher courts.",
    slug: "writs-rights-policy-challenges",
  },
  {
    id: "bail-applications",
    title: "Bail Applications",
    short: "Urgent bail defence with fast filings and jurisdiction-smart argument design.",
    detail:
      "From anticipatory relief to regular bail, we move quickly with custody-risk analysis and persuasive oral strategy.",
    slug: "urgent-bail-and-custody-defence",
  },
];

const TEAM = [
  { name: "A.P. Mishra", role: "Senior Advocate", email: "apmishra@apmlegal.in", phone: "+91 522 400 1101", vcard: "#" },
  { name: "Aaditya Mishra", role: "Managing Partner", email: "aaditya@apmlegal.in", phone: "+91 522 400 1102", vcard: "#" },
  { name: "Rhea Kapoor", role: "Associate — Consumer & Commercial", email: "rhea.k@apmlegal.in", phone: "+91 522 400 1112", vcard: "#" },
  { name: "Vikram S. Rao", role: "Associate — Constitutional & Appellate", email: "vikram.rao@apmlegal.in", phone: "+91 522 400 1119", vcard: "#" },
];

const CONSULTATION_FEE = 2500;

const initialBooking = {
  name: "",
  email: "",
  phone: "",
  matterType: "",
  urgency: "",
  consultationMode: "",
  opponent: "",
  issueType: "",
  firNumber: "",
  policeStation: "",
  disputeValue: "",
  challengedAuthority: "",
  summary: "",
  docsReady: "",
  slot: "",
  paymentMethod: "",
  transactionRef: "",
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

  const closePractice = () => {
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
    setActivePractice(null);
  };

  return (
    <div className="app-shell">
      <CursorAura />
      <CustomCursor />
      <Hero onConsultClick={() => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} />

      <section className="section">
        <div className="container">
          <h2>Practice Areas</h2>
          <p className="subtle-copy">Glass panels respond to your pointer and open dedicated expertise views.</p>
          <div className="practice-grid">
            {PRACTICE_AREAS.map((area) => (
              <PracticeCard key={area.id} area={area} onOpen={() => (window.location.hash = `practice/${area.slug}`)} />
            ))}
          </div>
        </div>
      </section>

      <section ref={bookingRef} className="section">
        <div className="container narrow">
          <h2>Smart Appointment Booking Engine</h2>
          <p className="subtle-copy">Precision intake with conditional legal questions and final consultation fee payment.</p>
          <BookingEngine />
        </div>
      </section>

      <section className="section">
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
              <a className="ghost-btn" href="https://maps.google.com/?q=Lucknow%20High%20Court" target="_blank" rel="noreferrer">Get Directions</a>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activePractice && (
          <motion.div className="practice-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article className="practice-modal" initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 28, opacity: 0 }}>
              <p className="modal-kicker">Dedicated Expertise Page</p>
              <h3>{activePractice.title}</h3>
              <p>{activePractice.detail}</p>
              <div className="hero-actions">
                <button className="cta-btn" onClick={closePractice}>Close</button>
                <button className="ghost-btn" onClick={() => bookingRef.current?.scrollIntoView({ behavior: "smooth" })}>Book consultation</button>
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
      <div className="hero-backglow" style={{ transform: `translate(${(mouse.x - window.innerWidth / 2) * 0.015}px, ${(mouse.y - window.innerHeight / 2) * 0.015}px)` }} />
      <motion.h1
        className="hero-title"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={
          hovering
            ? { backgroundImage: `radial-gradient(circle at ${mouse.x}px ${mouse.y}px, #fff 0%, #e6cf9d 28%, rgba(255,255,255,.2) 52%, rgba(255,255,255,.05) 80%)` }
            : undefined
        }
      >
        APM LEGAL SERVICES LLP
      </motion.h1>
      <p className="hero-tagline">Strategic Advocacy. Relentless Pursuit of Justice.</p>
      <div className="hero-actions">
        <button className="cta-btn glowing" onClick={onConsultClick}>Consult With Us</button>
        <span className="status-pill">Counseling • Litigation • Defence</span>
      </div>
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

  return (
    <article
      className="practice-card"
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={() => cardRef.current && (cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)")}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
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
      { key: "name", label: "What is your full name?", helper: "As per official ID for appointment records.", type: "text" },
      { key: "email", label: "Your primary email address", helper: "All notices and payment receipt are shared here.", type: "email" },
      { key: "phone", label: "Preferred phone number", helper: "For urgent legal coordination and case updates.", type: "tel" },
      {
        key: "matterType",
        label: "Which legal matter best describes your case?",
        helper: "Choose the closest area to route the right legal team.",
        type: "select",
        options: ["Civil Litigation", "Consumer Dispute", "Constitutional", "Bail Application"],
      },
      {
        key: "urgency",
        label: "How urgent is this matter?",
        helper: "Helps us prioritize consultation slots.",
        type: "select",
        options: ["Immediate (within 24 hours)", "High (2-3 days)", "Standard (within a week)"],
      },
      {
        key: "consultationMode",
        label: "Consultation preference",
        helper: "Select the mode most convenient for you.",
        type: "select",
        options: ["In-office (Lucknow)", "Video consultation", "Phone consultation"],
      },
    ];

    if (form.matterType === "Consumer Dispute") {
      queue.push({ key: "opponent", label: "Which company/business is involved?", helper: "Mention legal entity if known.", type: "text" });
      queue.push({
        key: "issueType",
        label: "Primary consumer grievance",
        helper: "Select the issue category.",
        type: "select",
        options: ["Defective product", "Deficiency of service", "Unfair trade practice", "Refund/compensation refusal"],
      });
    }

    if (form.matterType === "Bail Application") {
      queue.push({ key: "firNumber", label: "FIR number / case number", helper: "If available.", type: "text" });
      queue.push({ key: "policeStation", label: "Police station / jurisdiction", helper: "City and station name preferred.", type: "text" });
    }

    if (form.matterType === "Civil Litigation") {
      queue.push({
        key: "disputeValue",
        label: "Approximate claim/dispute value",
        helper: "Example: ₹10 lakh, ₹50 lakh, etc.",
        type: "text",
      });
    }

    if (form.matterType === "Constitutional") {
      queue.push({
        key: "challengedAuthority",
        label: "Authority/order being challenged",
        helper: "Department, tribunal, or authority name.",
        type: "text",
      });
    }

    queue.push({ key: "summary", label: "Briefly summarize the case facts", helper: "2–5 lines are enough for first review.", type: "textarea" });
    queue.push({ key: "docsReady", label: "Do you have key documents ready?", helper: "FIR, notices, agreements, emails, orders, etc.", type: "select", options: ["Yes", "Partially", "No"] });
    queue.push({ key: "slot", label: "Select your preferred consultation slot", helper: "These are currently available windows.", type: "slot" });
    queue.push({ key: "paymentMethod", label: `Consultation fee payment (₹${CONSULTATION_FEE.toLocaleString("en-IN")})`, helper: "Pay now to confirm your booking request.", type: "payment" });

    return queue;
  }, [form.matterType]);

  const current = steps[Math.min(step, steps.length - 1)];
  const canContinue = canProceed(current, form);

  return (
    <div className="booking-shell">
      <div className="progress-rail"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
      <AnimatePresence mode="wait">
        <motion.div key={current.key} className="question-card" initial={{ opacity: 0, y: 16, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}>
          <p className="step-count">Question {step + 1} of {steps.length}</p>
          <h3>{current.label}</h3>
          <p className="question-helper">{current.helper}</p>
          <FieldRenderer step={current} form={form} setForm={setForm} />

          <div className="form-nav-row">
            <button className="ghost-btn" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</button>
            {step < steps.length - 1 ? (
              <button className="cta-btn" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>Next</button>
            ) : (
              <button className="cta-btn glowing" disabled={!canContinue}>Confirm & Pay ₹{CONSULTATION_FEE.toLocaleString("en-IN")}</button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function canProceed(step, form) {
  if (step.type === "payment") return Boolean(form.paymentMethod && form.transactionRef.trim());
  if (step.type === "slot") return Boolean(form.slot);
  return Boolean(form[step.key]?.trim?.() || form[step.key]);
}

function FieldRenderer({ step, form, setForm }) {
  const value = form[step.key];
  const onChange = (next) => setForm((prev) => ({ ...prev, [step.key]: next }));

  if (step.type === "textarea") return <textarea rows={5} value={value} onChange={(e) => onChange(e.target.value)} />;

  if (step.type === "select") {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select one</option>
        {step.options.map((opt) => <option key={opt}>{opt}</option>)}
      </select>
    );
  }

  if (step.type === "slot") {
    const slots = ["Mon · 10:00 AM", "Tue · 1:30 PM", "Wed · 5:00 PM", "Fri · 11:15 AM", "Sat · 12:30 PM"];
    return <div className="slot-grid">{slots.map((slot) => <button key={slot} className={`slot-btn ${value === slot ? "active" : ""}`} onClick={() => onChange(slot)}>{slot}</button>)}</div>;
  }

  if (step.type === "payment") {
    return (
      <div className="payment-block">
        <div className="payment-method-grid">
          {["UPI", "Card", "Net Banking"].map((method) => (
            <button
              key={method}
              className={`payment-method ${form.paymentMethod === method ? "active" : ""}`}
              onClick={() => setForm((prev) => ({ ...prev, paymentMethod: method }))}
            >
              {method}
            </button>
          ))}
        </div>
        <label className="input-label">
          Transaction reference / UTR number
          <input
            type="text"
            placeholder="Enter payment reference"
            value={form.transactionRef}
            onChange={(e) => setForm((prev) => ({ ...prev, transactionRef: e.target.value }))}
          />
        </label>
        <p className="question-helper">Booking is confirmed after fee verification by our intake desk.</p>
      </div>
    );
  }

  return <input type={step.type} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function TeamCard({ member, spotlight }) {
  return (
    <article className={`team-card ${spotlight ? "spotlight" : ""}`}>
      <div className="portrait" aria-hidden="true">{member.name.split(" ").map((n) => n[0]).join("")}</div>
      <div className="team-meta"><h3>{member.name}</h3><p>{member.role}</p></div>
      <div className="team-reveal">
        <a href={`mailto:${member.email}`}>{member.email}</a>
        <a href={`tel:${member.phone.replace(/\s/g, "")}`}>{member.phone}</a>
        <a href={member.vcard}>Download V-Card</a>
      </div>
    </article>
  );
}

function CursorAura() {
  const point = useMousePosition();
  return <div className="cursor-aura" style={{ transform: `translate(${point.x - 260}px, ${point.y - 260}px)` }} />;
}

function CustomCursor() {
  const point = useMousePosition();
  const [trail, setTrail] = React.useState(Array.from({ length: 9 }, () => ({ x: 0, y: 0 })));

  React.useEffect(() => {
    let frame = 0;
    const animate = () => {
      setTrail((prev) => {
        const next = [...prev];
        next[0] = { x: point.x, y: point.y };
        for (let i = 1; i < next.length; i += 1) {
          next[i] = {
            x: next[i].x + (next[i - 1].x - next[i].x) * 0.34,
            y: next[i].y + (next[i - 1].y - next[i].y) * 0.34,
          };
        }
        return next;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [point]);

  return (
    <>
      {trail.map((dot, idx) => (
        <span
          key={`trail-${idx}`}
          className="cursor-trail"
          style={{ transform: `translate(${dot.x - 4}px, ${dot.y - 4}px) scale(${1 - idx * 0.085})`, opacity: 1 - idx * 0.1 }}
        />
      ))}
      <span className="custom-cursor" style={{ transform: `translate(${point.x - 14}px, ${point.y - 14}px)` }} />
    </>
  );
}

export default App;
