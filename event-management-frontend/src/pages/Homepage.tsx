import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ── Types ──────────────────────────────────────────────────────────────────
interface HomeStats {
  totalEvents: number;
  totalStudents: number;
  totalCategories: number;
  totalAnnouncements: number;
}

interface FeaturedEvent {
  eventId: number;
  eventTitle: string;
  eventDate: string;
  location: string;
  status: string;
  category?: { categoryName: string };
}

// ── Particle Canvas ────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number; opacity: number;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const frame     = useRef<number>(0);
  const mouse     = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const n = Math.floor((canvas.width * canvas.height) / 8500);
      particles.current = Array.from({ length: n }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.8,
        opacity: Math.random() * 0.45 + 0.15,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ps = particles.current;
      const m  = mouse.current;

      for (const p of ps) {
        const dx = p.x - m.x, dy = p.y - m.y;
        const d  = Math.hypot(dx, dy);
        if (d < 110) { p.vx += (dx / d) * 0.25; p.vy += (dy / d) * 0.25; }
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 1.4) { p.vx = (p.vx / sp) * 1.4; p.vy = (p.vy / sp) * 1.4; }
        p.x = (p.x + p.vx + canvas.width)  % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165,180,252,${p.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const d = Math.hypot(ps[i].x - ps[j].x, ps[i].y - ps[j].y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(165,180,252,${0.12 * (1 - d / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      frame.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}

// ── Animated counter ───────────────────────────────────────────────────────
function AnimCount({ target }: { target: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 45));
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setN(cur);
      if (cur >= target) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [target]);
  return <>{n.toLocaleString()}</>;
}

// ── Status pill ────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  UPCOMING:  { bg: "#eff6ff", color: "#1d4ed8" },
  ONGOING:   { bg: "#f0fdf4", color: "#15803d" },
  COMPLETED: { bg: "#f8fafc", color: "#64748b" },
  CANCELLED: { bg: "#fff1f2", color: "#be123c" },
};
function StatusPill({ status }: { status: string }) {
  const s     = (status || "UPCOMING").toUpperCase();
  const style = STATUS_STYLES[s] ?? STATUS_STYLES.UPCOMING;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
      padding: "3px 10px", borderRadius: 999,
      background: style.bg, color: style.color,
    }}>{s}</span>
  );
}

// ── Role-aware dashboard path ──────────────────────────────────────────────
function dashboardPath(role: string | null): string {
  if (role === "ADMIN")    return "/admin";
  if (role === "FACULTY")  return "/faculty";
  if (role === "STUDENT")  return "/student";
  return "/login";
}

// ── Public Navbar ──────────────────────────────────────────────────────────
function PublicNavbar({ role }: { role: string | null }) {
  const navigate = useNavigate();

  const handleDashboard = () => navigate(dashboardPath(role));
  const handleLogout    = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <nav style={{
      position: "relative", zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 48px",
      background: "rgba(15,23,42,0.7)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: "#fff", fontWeight: 800,
        }}>✦</div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>
          EventHub
        </span>
      </Link>

      {/* Centre links — always public */}
      <div style={{ display: "flex", gap: 4 }}>
        {[
          { label: "Home",   to: "/" },
          { label: "Events", to: "/browse-events" },
        ].map(l => (
          <Link key={l.to} to={l.to} style={{
            color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 500,
            padding: "6px 14px", borderRadius: 8, textDecoration: "none",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >{l.label}</Link>
        ))}
      </div>

      {/* Right side — changes based on auth */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {role ? (
          <>
            {/* Logged in: show dashboard + logout */}
            <button onClick={handleDashboard} style={{
              background: "rgba(99,102,241,0.25)", border: "1px solid rgba(99,102,241,0.4)",
              color: "#c7d2fe", padding: "8px 18px", borderRadius: 999,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              My Dashboard
            </button>
            <button onClick={handleLogout} style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)", padding: "8px 18px", borderRadius: 999,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              Log out
            </button>
          </>
        ) : (
          <>
            {/* Guest: show sign in + sign up */}
            <Link to="/login" style={{
              color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600,
              padding: "8px 18px", borderRadius: 999, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
            }}>Sign In</Link>
            <Link to="/login" style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "#fff", fontSize: 13, fontWeight: 700,
              padding: "8px 18px", borderRadius: 999, textDecoration: "none",
            }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────
export default function HomePage() {
  const [stats,   setStats]   = useState<HomeStats>({ totalEvents: 0, totalStudents: 0, totalCategories: 0, totalAnnouncements: 0 });
  const [events,  setEvents]  = useState<FeaturedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [show,    setShow]    = useState(false);

  // Read role from localStorage (set during login)
  const role = localStorage.getItem("role"); // "ADMIN" | "FACULTY" | "STUDENT" | null

  useEffect(() => {
    setTimeout(() => setShow(true), 80);
    const base = "http://localhost:8080";
    Promise.all([
      fetch(`${base}/home/stats`).then(r => r.json()),
      fetch(`${base}/home/featured-events`).then(r => r.json()),
    ]).then(([s, e]) => { setStats(s); setEvents(e); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Events",        value: stats.totalEvents,        icon: "📅", accent: "#6366f1" },
    { label: "Students",      value: stats.totalStudents,      icon: "🎓", accent: "#8b5cf6" },
    { label: "Categories",    value: stats.totalCategories,    icon: "🏷️", accent: "#0ea5e9" },
    { label: "Announcements", value: stats.totalAnnouncements, icon: "📢", accent: "#f59e0b" },
  ];

  return (
    <div style={{ fontFamily: "'Sora','Segoe UI',sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');

        @keyframes slideUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
        @keyframes bobble  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }

        .a1{animation:slideUp .65s cubic-bezier(.22,1,.36,1) .05s both}
        .a2{animation:slideUp .65s cubic-bezier(.22,1,.36,1) .18s both}
        .a3{animation:slideUp .65s cubic-bezier(.22,1,.36,1) .30s both}
        .a4{animation:slideUp .65s cubic-bezier(.22,1,.36,1) .42s both}

        .stat-card{
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.13);
          border-radius:18px; padding:26px 22px;
          display:flex; align-items:center; gap:16px;
          backdrop-filter:blur(12px);
          transition:background .2s,transform .2s;
        }
        .stat-card:hover{background:rgba(255,255,255,0.13);transform:translateY(-4px)}

        .ev-card{
          background:#fff; border:1px solid #e2e8f0;
          border-radius:16px; padding:22px 24px;
          display:flex; flex-direction:column; gap:12px;
          transition:box-shadow .2s,transform .2s;
        }
        .ev-card:hover{box-shadow:0 10px 40px rgba(0,0,0,.1);transform:translateY(-3px)}

        .pill{
          display:inline-flex; align-items:center; gap:8px;
          padding:13px 30px; border-radius:999px;
          font-family:'Sora',sans-serif; font-size:14px; font-weight:700;
          text-decoration:none; border:none; cursor:pointer;
          transition:transform .15s,box-shadow .15s;
        }
        .pill:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.22)}
        .pill:active{transform:scale(.97)}

        .bobble{animation:bobble 2s ease-in-out infinite}
      `}</style>

      {/* ── Hero section (navbar lives inside here so it sits over the dark bg) */}
      <section style={{
        position: "relative",
        background: "linear-gradient(140deg,#0f172a 0%,#1e1b4b 45%,#0f172a 100%)",
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        <ParticleCanvas />

        {/* Glow blobs */}
        <div style={{ position:"absolute", top:-120, right:-120, width:520, height:520, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,.22) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-80, left:-80, width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.18) 0%,transparent 70%)", pointerEvents:"none" }} />

        {/* Navbar */}
        <PublicNavbar role={role} />

        {/* Hero body */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"60px 24px 40px", position:"relative", zIndex:10 }}>
          {show && (<>
            {/* Badge */}
            <div className="a1" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(99,102,241,.18)", border:"1px solid rgba(99,102,241,.35)", borderRadius:999, padding:"6px 18px", marginBottom:32 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:"#818cf8", display:"inline-block" }} />
              <span style={{ color:"#c7d2fe", fontSize:12, fontWeight:600, letterSpacing:"0.06em" }}>UNIVERSITY EVENT MANAGEMENT</span>
            </div>

            {/* Headline */}
            <h1 className="a2" style={{ fontSize:"clamp(2.6rem,6vw,5rem)", fontWeight:800, color:"#fff", lineHeight:1.06, letterSpacing:"-0.03em", marginBottom:24, maxWidth:820 }}>
              Your campus,{" "}
              <span style={{ background:"linear-gradient(90deg,#818cf8,#a78bfa,#38bdf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                fully alive
              </span>
            </h1>

            {/* Sub */}
            <p className="a3" style={{ color:"rgba(255,255,255,.55)", fontSize:18, maxWidth:520, lineHeight:1.75, marginBottom:44 }}>
              Discover workshops, sports days, seminars, and socials.
              Open to everyone — students, faculty, and visitors alike.
            </p>

            {/* CTAs — guest-safe, no admin links */}
            <div className="a4" style={{ display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center" }}>
              <Link to="/browse-events" className="pill" style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff" }}>
                Browse Events →
              </Link>
              {!role && (
                <Link to="/login" className="pill" style={{ background:"rgba(255,255,255,.09)", color:"#e2e8f0", border:"1px solid rgba(255,255,255,.15)" }}>
                  Sign In to Register
                </Link>
              )}
              {role && (
                <Link to={dashboardPath(role)} className="pill" style={{ background:"rgba(255,255,255,.09)", color:"#e2e8f0", border:"1px solid rgba(255,255,255,.15)" }}>
                  Go to My Dashboard
                </Link>
              )}
            </div>
          </>)}
        </div>

        {/* Stats strip */}
        {show && (
          <div style={{ position:"relative", zIndex:10, padding:"0 40px 60px", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, maxWidth:1100, margin:"0 auto", width:"100%" }}>
            {statCards.map((c, i) => (
              <div key={i} className="stat-card" style={{ animation:`slideUp .65s cubic-bezier(.22,1,.36,1) ${0.5 + i * 0.1}s both` }}>
                <div style={{ width:48, height:48, borderRadius:14, flexShrink:0, background:`${c.accent}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,.45)", letterSpacing:"0.07em", marginBottom:4 }}>{c.label.toUpperCase()}</div>
                  <div style={{ fontSize:30, fontWeight:800, color:"#fff", lineHeight:1, letterSpacing:"-0.02em" }}>
                    {loading ? "—" : <AnimCount target={c.value} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scroll cue */}
        <div className="bobble" style={{ position:"relative", zIndex:10, display:"flex", justifyContent:"center", paddingBottom:28 }}>
          <div style={{ width:22, height:38, border:"1.5px solid rgba(255,255,255,.2)", borderRadius:999, display:"flex", justifyContent:"center", paddingTop:6 }}>
            <div style={{ width:3, height:7, background:"rgba(255,255,255,.45)", borderRadius:999 }} />
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ──────────────────────────────────────────────── */}
      <section style={{ padding:"80px 40px", background:"#f1f5f9" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:44 }}>
            <div>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"#6366f1", marginBottom:8 }}>WHAT'S ON</p>
              <h2 style={{ fontSize:32, fontWeight:800, color:"#0f172a", letterSpacing:"-0.025em", margin:0 }}>Upcoming events</h2>
            </div>
            <Link to="/browse-events" style={{ color:"#6366f1", fontWeight:700, fontSize:14, textDecoration:"none" }}>View all →</Link>
          </div>

          {loading ? (
            <p style={{ textAlign:"center", color:"#94a3b8", padding:"60px 0" }}>Loading…</p>
          ) : events.length === 0 ? (
            <p style={{ textAlign:"center", color:"#94a3b8", padding:"60px 0" }}>No upcoming events yet.</p>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
              {events.map(ev => (
                <div key={ev.eventId} className="ev-card">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.07em", color:"#6366f1", background:"#eef2ff", padding:"3px 10px", borderRadius:999 }}>
                      {ev.category?.categoryName?.toUpperCase() || "GENERAL"}
                    </span>
                    <StatusPill status={ev.status} />
                  </div>

                  <h3 style={{ fontSize:17, fontWeight:700, color:"#0f172a", margin:0, letterSpacing:"-0.01em" }}>{ev.eventTitle}</h3>

                  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    <span style={{ fontSize:13, color:"#64748b", display:"flex", alignItems:"center", gap:7 }}>
                      📅 {new Date(ev.eventDate).toLocaleDateString("en-US", { dateStyle:"medium" })}
                    </span>
                    <span style={{ fontSize:13, color:"#64748b", display:"flex", alignItems:"center", gap:7 }}>
                      📍 {ev.location}
                    </span>
                  </div>

                  <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <Link to={`/browse-events/${ev.eventId}`} style={{ fontSize:13, fontWeight:700, color:"#6366f1", textDecoration:"none" }}>
                      View details →
                    </Link>
                    {/* Only show Register if logged in as student */}
                    {role === "STUDENT" && (
                      <Link to={`/studenteventdetails/${ev.eventId}`} style={{
                        fontSize:12, fontWeight:700, color:"#fff",
                        background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                        padding:"5px 14px", borderRadius:999, textDecoration:"none",
                      }}>Register</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Role call-to-action ───────────────────────────────────────────── */}
      {!role && (
        <section style={{ background:"#fff", borderTop:"1px solid #e2e8f0", padding:"72px 40px" }}>
          <div style={{ maxWidth:960, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:24 }}>
            {[
              { title:"I'm a Student",  desc:"Register for events, track your schedule, and stay up to date with campus announcements.", cta:"Student Login", path:"/login", accent:"#6366f1" },
              { title:"I'm Faculty",    desc:"Manage events you're coordinating, view registrations, and post announcements to students.", cta:"Faculty Login",  path:"/login", accent:"#8b5cf6" },
              { title:"Just Visiting", desc:"No account needed — browse all public events happening on campus freely.", cta:"Browse Events",  path:"/browse-events", accent:"#0ea5e9" },
            ].map(card => (
              <div key={card.title} style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:18, padding:"32px 28px", display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:`${card.accent}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
                  {card.title.includes("Student") ? "🎓" : card.title.includes("Faculty") ? "👩‍🏫" : "👤"}
                </div>
                <h3 style={{ fontSize:18, fontWeight:800, color:"#0f172a", margin:0, letterSpacing:"-0.01em" }}>{card.title}</h3>
                <p style={{ fontSize:14, color:"#64748b", lineHeight:1.7, margin:0 }}>{card.desc}</p>
                <Link to={card.path} style={{
                  marginTop:4, display:"inline-flex", alignItems:"center", gap:6,
                  padding:"10px 22px", borderRadius:999, textDecoration:"none",
                  background:`linear-gradient(135deg,${card.accent},${card.accent}cc)`,
                  color:"#fff", fontSize:13, fontWeight:700, alignSelf:"flex-start",
                }}>{card.cta} →</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)", padding:"90px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, left:"20%", width:340, height:340, borderRadius:"50%", background:"rgba(99,102,241,.2)", filter:"blur(70px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-60, right:"15%", width:260, height:260, borderRadius:"50%", background:"rgba(139,92,246,.2)", filter:"blur(60px)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"#a5b4fc", marginBottom:16 }}>OPEN TO EVERYONE</p>
          <h2 style={{ fontSize:"clamp(1.8rem,4vw,3.2rem)", fontWeight:800, color:"#fff", letterSpacing:"-0.03em", marginBottom:18 }}>
            See what's happening on campus
          </h2>
          <p style={{ color:"rgba(255,255,255,.5)", fontSize:17, maxWidth:430, margin:"0 auto 44px" }}>
            No account required to explore events. Sign in when you're ready to participate.
          </p>
          <Link to="/browse-events" className="pill" style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", fontSize:15, padding:"15px 38px" }}>
            Browse All Events →
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ background:"#0f172a", padding:"28px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16, borderTop:"1px solid rgba(255,255,255,.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:"#fff" }}>✦</div>
          <span style={{ color:"rgba(255,255,255,.35)", fontSize:13 }}>EventHub — University Events © {new Date().getFullYear()}</span>
        </div>
        {/* Footer only shows public links */}
        <div style={{ display:"flex", gap:24 }}>
          {[
            { label:"Events", to:"/browse-events" },
            { label:"Sign In", to:"/login" },
          ].map(l => (
            <Link key={l.to} to={l.to} style={{ color:"rgba(255,255,255,.3)", fontSize:13, textDecoration:"none" }}>{l.label}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}