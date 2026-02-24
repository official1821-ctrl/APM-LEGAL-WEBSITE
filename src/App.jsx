import React from "react";

const practiceAreas = [
  {
    id: "civil-litigation",
    title: "Civil Litigation",
    short: "High-stakes civil strategy from injunctions to final arguments.",
    details:
      "We handle complex property, contract, and recovery disputes with precision-first pleadings and aggressive interim relief strategy.",
  },
  {
    id: "consumer-advocacy",
    title: "Consumer Advocacy",
    short: "Targeted action against deceptive marketing and unfair trade practices.",
    details:
      "From e-commerce fraud to service-deficiency claims, we build evidence-backed complaints and compensation frameworks designed for outcomes.",
  },
  {
    id: "constitutional-law",
    title: "Constitutional Law",
    short: "Rights-focused constitutional remedies in writ and appellate forums.",
    details:
      "We pursue writ remedies, policy challenges, and procedural fairness claims with deep constitutional research and court-specific strategy.",
  },
  {
    id: "bail-applications",
    title: "Bail Applications",
    short: "Urgent bail strategy with jurisdiction-aware filings.",
    details:
      "We prepare anticipatory and regular bail matters with evidence sequencing, risk framing, and hearing-day courtroom execution.",
  },
];

const team = [
  { name: "A.P. Mishra", role: "Senior Advocate", email: "apm@apmlegal.in", phone: "+91-522-400-0001" },
  { name: "R. Mishra", role: "Managing Partner", email: "rm@apmlegal.in", phone: "+91-522-400-0002" },
  { name: "A. Singh", role: "Associate", email: "asingh@apmlegal.in", phone: "+91-522-400-0011" },
  { name: "N. Khan", role: "Associate", email: "nkhan@apmlegal.in", phone: "+91-522-400-0012" },
];

const initialForm = {
  name: "",
  email: "",
  serviceType: "",
  company: "",
  jurisdiction: "",
  summary: "",
  slot: "",
};

function App() {
  const bookingRef = React.useRef(null);
  const [heroMouse, setHeroMouse] = React.useState({ x: -999, y: -999 });
  const [activePractice, setActivePractice] = React.useState(practiceAreas[0]);
  const [formData, setFormData] = React.useState(initialForm);
  const [step, setStep] = React.useState(0);

  const heroText = "APM LEGAL SERVICES LLP";

  const questions = [
    {
      key: "name",
      label: "Your full name",
      input: <input value={formData.name} onChange={(e) => update("name", e.target.value)} required />,
      valid: !!formData.name.trim(),
    },
    {
      key: "email",
      label: "Best email for case updates",
      input: <input type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} required />,
      valid: /.+@.+\..+/.test(formData.email),
    },
    {
      key: "serviceType",
      label: "What kind of matter is this?",
      input: (
        <select value={formData.serviceType} onChange={(e) => update("serviceType", e.target.value)} required>
          <option value="">Select a category</option>
          <option value="Consumer Dispute">Consumer Dispute</option>
          <option value="Bail Application">Bail Application</option>
          <option value="Civil Litigation">Civil Litigation</option>
          <option value="Constitutional Remedy">Constitutional Remedy</option>
        </select>
      ),
      valid: !!formData.serviceType,
    },
    ...(formData.serviceType === "Consumer Dispute"
      ? [
          {
            key: "company",
            label: "Which company is the dispute against?",
            input: <input value={formData.company} onChange={(e) => update("company", e.target.value)} required />,
            valid: !!formData.company.trim(),
          },
        ]
      : []),
    ...(formData.serviceType === "Bail Application"
      ? [
          {
            key: "jurisdiction",
            label: "Relevant court or jurisdiction",
            input: (
              <input
                value={formData.jurisdiction}
                onChange={(e) => update("jurisdiction", e.target.value)}
                placeholder="e.g., Sessions Court, Lucknow"
                required
              />
            ),
            valid: !!formData.jurisdiction.trim(),
          },
        ]
      : []),
    {
      key: "summary",
      label: "Briefly describe the issue",
      input: <textarea rows={4} value={formData.summary} onChange={(e) => update("summary", e.target.value)} required />,
      valid: !!formData.summary.trim(),
    },
    {
      key: "slot",
      label: "Pick a preferred consultation slot",
      input: (
        <div className="slots">
          {["Mon 10:00", "Mon 16:30", "Tue 11:30", "Wed 14:00", "Thu 12:30", "Fri 17:00"].map((slot) => (
            <button
              key={slot}
              type="button"
              className={`slot ${formData.slot === slot ? "active" : ""}`}
              onClick={() => update("slot", slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      ),
      valid: !!formData.slot,
    },
  ];

  const current = questions[Math.min(step, questions.length - 1)];

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const match = practiceAreas.find((p) => p.id === hash);
    if (match) setActivePractice(match);
  }, []);

  function update(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function scrollToBooking() {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openPractice(item) {
    setActivePractice(item);
    window.history.replaceState({}, "", `#${item.id}`);
    document.getElementById("practice-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function nextStep() {
    if (current?.valid) setStep((s) => Math.min(s + 1, questions.length - 1));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div>
      <section
        className="hero-main"
        onMouseMove={(e) => setHeroMouse({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setHeroMouse({ x: -999, y: -999 })}
      >
        <div className="noise" />
        <h1 className="hero-title" aria-label={heroText}>
          {heroText.split("").map((ch, idx) => {
            const dx = ((heroMouse.x + idx * 13) % 19) - 9;
            const dy = ((heroMouse.y + idx * 7) % 15) - 7;
            const active = heroMouse.x > 0;
            return (
              <span
                key={`${ch}-${idx}`}
                style={{
                  transform: active ? `translate(${dx * 0.08}px, ${dy * 0.08}px)` : "translate(0,0)",
                  opacity: active ? 0.8 + ((idx % 4) * 0.05) : 1,
                  filter: active && idx % 6 === 0 ? "blur(0.7px)" : "none",
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </h1>
        <p className="hero-tagline">Strategic Advocacy. Relentless Pursuit of Justice.</p>
        <button className="hero-cta" onClick={scrollToBooking}>Consult With Us</button>
      </section>

      <section className="container section" id="practice">
        <h2>Practice Areas</h2>
        <div className="practice-grid">
          {practiceAreas.map((item) => (
            <button
              key={item.id}
              className={`practice-card ${activePractice.id === item.id ? "is-active" : ""}`}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty("--mx", `${x}px`);
                e.currentTarget.style.setProperty("--my", `${y}px`);
              }}
              onClick={() => openPractice(item)}
            >
              <h3>{item.title}</h3>
              <p>{item.short}</p>
            </button>
          ))}
        </div>

        <article id="practice-detail" className="practice-detail">
          <h3>{activePractice.title}</h3>
          <p>{activePractice.details}</p>
        </article>
      </section>

      <section className="container section" id="booking" ref={bookingRef}>
        <h2>Smart Appointment Booking Engine</h2>
        <div className="intake-card">
          <p className="step">Step {step + 1} of {questions.length}</p>
          <label>{current.label}</label>
          <div className="question-wrap" key={current.key}>{current.input}</div>
          <div className="form-actions">
            <button className="ghost" type="button" onClick={prevStep} disabled={step === 0}>Back</button>
            {step < questions.length - 1 ? (
              <button className="cta" type="button" onClick={nextStep}>Next</button>
            ) : (
              <button className="cta" type="button">Request Consultation</button>
            )}
          </div>
        </div>
      </section>

      <section className="container section" id="team">
        <h2>Roster & Location</h2>
        <div className="team-grid">
          {team.map((m, idx) => (
            <article className={`member ${idx === 0 ? "senior" : ""}`} key={m.email}>
              <div className="portrait" />
              <div className="overlay">
                <h3>{m.name}</h3>
                <p>{m.role}</p>
                <small>{m.email}</small>
                <small>{m.phone}</small>
                <button className="ghost">Download V-Card</button>
              </div>
            </article>
          ))}
        </div>

        <div className="location-hub">
          <iframe
            title="Lucknow Office"
            src="https://www.openstreetmap.org/export/embed.html?bbox=80.91%2C26.84%2C80.99%2C26.89&layer=mapnik&marker=26.865%2C80.946"
          />
          <div>
            <h3>Lucknow Office</h3>
            <p>APM Legal Services LLP, Hazratganj, Lucknow, Uttar Pradesh 226001</p>
            <p>Mon - Sat: 9:30 AM to 7:00 PM</p>
            <a className="cta" href="https://maps.google.com/?q=Hazratganj+Lucknow" target="_blank" rel="noreferrer">
              Get Directions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
