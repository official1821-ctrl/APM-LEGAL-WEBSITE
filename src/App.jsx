import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ENGAGEMENTS, HERO_IMAGES } from './data';

/**
 * Lightweight "glass" premium theme + animations.
 * Uses localStorage key 'apm_disclaimer_accepted' for gate.
 */

/* Palette & fonts */
const palette = {
  black: '#0A0A0B',
  gold: '#C8A04D',
  deepRed: '#7A0A0A',
  offWhite: '#EFEAE2',
  gray: '#A8A297',
};

const GATE_KEY = 'apm_disclaimer_accepted';

/* Helpers */
function fmtTime(d) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(d) + ' IST';
}
function fmtDate(d) {
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(d);
}
function formatSlot(d) {
  return `${fmtDate(d)} · ${fmtTime(d)}`;
}
function generateSlots(days = 7, start = 10, end = 18) {
  const out = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const day = new Date(now);
    day.setDate(now.getDate() + i);
    day.setHours(0,0,0,0);
    if (day.getDay() === 0) continue; // closed Sunday
    for (let h = start; h < end; h++) {
      const s = new Date(day);
      s.setHours(h,0,0,0);
      if (s <= now) continue;
      out.push(s);
    }
  }
  return out;
}
function makeICS({ start, end, name, email, phone, category, notes }) {
  function iso(d){ return d.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'; }
  const SUMMARY = `Consultation: ${name || 'Client'} — ${category || ''}`;
  const DESCRIPTION = `Email: ${email || ''}\\nPhone: ${phone || ''}\\nNotes: ${notes || ''}`;
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//APM Legal//EN\nBEGIN:VEVENT\nUID:${Date.now()}@apmlegal\nDTSTAMP:${iso(new Date())}\nDTSTART:${iso(start)}\nDTEND:${iso(end)}\nSUMMARY:${SUMMARY}\nDESCRIPTION:${DESCRIPTION}\nLOCATION:APM Legal (Online)\nEND:VEVENT\nEND:VCALENDAR`;
  return 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics);
}

/* Tiny image fallback component */
function Img({ src, alt, className='' }){
  return <img src={src} alt={alt} className={className} onError={(e)=>{ e.currentTarget.src = '/assets/fallback.jpg'; }} />;
}

/* CTA */
function CTA({ children, onClick, className='' }){
  return (
    <button onClick={onClick} className={`cta ${className}`}>
      {children}
      <span className="cta-arrow">→</span>
    </button>
  );
}

/* Hero */
function Hero({ onBook }){
  const [idx, setIdx] = useState(0);
  useEffect(()=> {
    const t = setInterval(()=> setIdx(i => (i+1) % HERO_IMAGES.length), 6500);
    return ()=> clearInterval(t);
  },[]);
  return (
    <header className="hero">
      <motion.div className="hero-bg" key={HERO_IMAGES[idx]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8 }}>
        <Img src={HERO_IMAGES[idx]} alt="Hero" className="hero-img" />
        <div className="hero-vignette" />
      </motion.div>
      <div className="hero-content">
        <div className="glass-card">
          <h1 className="display">Boutique Criminal Defence & Corporate Litigation</h1>
          <p className="lede">Uncompromising strategy for NDPS, white-collar, PMLA, and complex commercial disputes.</p>
          <div className="hero-actions">
            <CTA onClick={onBook}>Book a Confidential Consultation</CTA>
            <button className="ghost" onClick={()=> window.scrollTo({ top: 700, behavior:'smooth' })}>Practice Areas</button>
          </div>
          <div className="chips">
            <span className="chip">NDPS & PMLA</span>
            <span className="chip">White-Collar</span>
            <span className="chip">High Court</span>
          </div>
        </div>
      </div>
    </header>
  );
}

/* Disclaimer Gate */
function DisclaimerGate({ onClose }){
  const boxRef = useRef(null);
  const [checked, setChecked] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(()=> {
    const el = boxRef.current;
    if(!el) return;
    const fn = ()=> {
      const p = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    el.addEventListener('scroll', fn, { passive: true });
    fn();
    return ()=> el.removeEventListener('scroll', fn);
  },[]);
  return (
    <div className="gate-backdrop">
      <div className="gate-card" role="dialog" aria-modal>
        <div className="gate-progress" style={{ width: `${progress*100}%`, background: palette.gold }} />
        <h2>Mandatory Disclosure — Bar Council (short)</h2>
        <div ref={boxRef} className="gate-body">
          <p>This site is for information only and is not legal advice. Accessing the site does not create an advocate-client relationship.</p>
          <p>By accepting you confirm you have read the disclosure and consent to limited processing for scheduling/conflict checks.</p>
          <p>Past outcomes do not guarantee similar results. For tailored advice, contact us directly.</p>
          <div style={{ height: 40 }} />
        </div>
        <label className="gate-accept">
          <input type="checkbox" checked={checked} onChange={(e)=>setChecked(e.target.checked)} /> I have read and accept
        </label>
        <div className="gate-actions">
          <button className="ghost" onClick={()=> window.location.href='about:blank'}>Decline</button>
          <CTA onClick={()=> { localStorage.setItem(GATE_KEY, 'yes'); onClose && onClose(); }} className="" disabled={!checked || progress < 0.98}>Accept & Enter</CTA>
        </div>
        <div className="tip">Tip: scroll to the bottom then tick the box to enable accept.</div>
      </div>
    </div>
  );
}

/* Engagements list */
function Engagements({ onQuick }) {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const tags = useMemo(()=> Array.from(new Set(ENGAGEMENTS.flatMap(e => e.tags))).sort(), []);
  const filtered = ENGAGEMENTS.filter(e => {
    if(tag && !e.tags.includes(tag)) return false;
    if(!q) return true;
    return (e.title + ' ' + e.summary + ' ' + e.tags.join(' ')).toLowerCase().includes(q.toLowerCase());
  });
  return (
    <section className="section">
      <div className="container">
        <h2>Practice Areas & Toolkits</h2>
        <div className="filters">
          <input placeholder="Search kits or tags" value={q} onChange={(e)=>setQ(e.target.value)} />
          <select value={tag} onChange={(e)=>setTag(e.target.value)}>
            <option value="">All tags</option>
            {tags.map(t=> <option key={t} value={t}>{t}</option>)}
          </select>
          <button className="ghost" onClick={()=>{ setQ(''); setTag(''); }}>Reset</button>
        </div>
        <div className="grid">
          {filtered.map(it => (
            <div key={it.id} className="card">
              <div className="card-media"><Img src={it.image} alt={it.title} /></div>
              <div className="card-body">
                <h3>{it.title}</h3>
                <div className="meta">{it.category} • {it.tier}</div>
                <p className="summary">{it.summary}</p>
                <div className="tags">{it.tags.map(t=> <span className="tag" key={t}>{t}</span>)}</div>
                <div className="card-actions">
                  <button className="ghost" onClick={()=> onQuick && onQuick(it)}>Quick View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Contact (booking) */
function Contact(){
  const slots = useMemo(()=> generateSlots(14,10,18), []);
  const [form, setForm] = useState({ name:'', email:'', phone:'', category: 'Criminal Defence / NDPS', notes:'', slot: null });
  const [step, setStep] = useState(1);
  function update(k,v){ setForm(prev => ({...prev, [k]: v})); }
  function submit(){
    // basic validation
    if(!form.name || !form.email || !form.phone){ setStep(1); alert('Please fill required fields'); return; }
    // produce ICS if slot chosen
    if(form.slot){
      const url = makeICS({ start: form.slot, end: new Date(form.slot.getTime()+3600000), ...form });
      const a = document.createElement('a');
      a.href = url;
      a.download = `APM-Consult-${(form.slot||new Date()).toISOString()}.ics`;
      document.body.appendChild(a); a.click(); a.remove();
    }
    alert('Request submitted — we will contact you. (This demo does not send data.)');
    setForm({ name:'', email:'', phone:'', category:'Criminal Defence / NDPS', notes:'', slot:null });
    setStep(1);
  }
  return (
    <section className="section">
      <div className="container small">
        <h2>Book a Confidential Consultation</h2>
        {step === 1 && (
          <div className="form-grid">
            <label>Name <input value={form.name} onChange={(e)=>update('name', e.target.value)} /></label>
            <label>Email <input value={form.email} onChange={(e)=>update('email', e.target.value)} /></label>
            <label>Phone <input value={form.phone} onChange={(e)=>update('phone', e.target.value)} /></label>
            <div className="form-actions">
              <button className="ghost" onClick={()=>setStep(2)}>Next: Matter</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <label>Category
              <select value={form.category} onChange={(e)=>update('category', e.target.value)}>
                <option>Criminal Defence / NDPS</option>
                <option>White-Collar / PMLA</option>
                <option>Commercial & Arbitration</option>
              </select>
            </label>
            <label>Notes <textarea value={form.notes} onChange={(e)=>update('notes', e.target.value)} /></label>
            <div className="form-actions">
              <button className="ghost" onClick={()=>setStep(1)}>Back</button>
              <button className="ghost" onClick={()=>setStep(3)}>Next: Slots</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="slots">
              {slots.slice(0, 24).map(s => (
                <button key={s.toISOString()} className={`slot ${form.slot && form.slot.getTime()===s.getTime() ? 'active' : ''}`} onClick={()=>update('slot', s)}>
                  {formatSlot(s)}
                </button>
              ))}
            </div>
            <div className="form-actions">
              <button className="ghost" onClick={()=>setStep(2)}>Back</button>
              <button className="cta" onClick={submit}>Submit Request</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* App */
export default function App(){
  const [showGate, setShowGate] = useState(false);
  const [quick, setQuick] = useState(null);
  useEffect(()=> {
    try {
      setShowGate(localStorage.getItem(GATE_KEY) !== 'yes');
    } catch(e) { setShowGate(true); }
  },[]);
  return (
    <div style={{ background: palette.black, color: palette.offWhite, minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, Inter, system-ui, sans-serif' }}>
      <Hero onBook={()=> document.querySelector('#contact')?.scrollIntoView({ behavior:'smooth' })} />
      <main>
        <Engagements onQuick={it => { setQuick(it); window.scrollTo({ top: 700, behavior:'smooth' }); }} />
        <div id="contact"><Contact /></div>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="brand">APM LEGAL</div>
              <div className="muted">Criminal Defence • Corporate Litigation</div>
            </div>
            <div>
              <div className="muted">Contact</div>
              <div>contact@example.com</div>
              <div>+91 00000 00000</div>
            </div>
            <div>
              <div className="muted">Policy</div>
              <button className="ghost" onClick={()=>{ localStorage.removeItem(GATE_KEY); location.reload(); }}>Reset Disclaimer</button>
            </div>
          </div>
        </div>
      </footer>

      { showGate && <DisclaimerGate onClose={()=> setShowGate(false)} /> }

      { quick && (
        <div className="quick-modal" onClick={() => setQuick(null)}>
          <motion.div className="quick-card" initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }}>
            <div className="quick-media"><Img src={quick.image} alt={quick.title} /></div>
            <div className="quick-body">
              <h3>{quick.title}</h3>
              <p className="muted">{quick.category} · {quick.tier}</p>
              <p>{quick.summary}</p>
              <div className="tags">{quick.tags.map(t=> <span className="tag" key={t}>{t}</span>)}</div>
              <div className="quick-actions">
                <button className="cta" onClick={()=>{ setQuick(null); document.querySelector('#contact input')?.focus(); }}>Request Engagement</button>
                <button className="ghost" onClick={() => setQuick(null)}>Close</button>
              </div>
            </div>
          </motion.div>
        </div>
      ) }
    </div>
  );
}
