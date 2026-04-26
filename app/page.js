'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

// ══════════════════════════════════════════════════════════════════════════════
// ✏️  EDIT ONLY THIS SECTION — change name, photo, and songs here
// ══════════════════════════════════════════════════════════════════════════════
const CONFIG = {
  name:       'Arti',                 // ← change to any name
  photo:      '/ii30.jpeg',               // ← main profile photo
  song0:      'happy-birthday-155461.mp3',                          // welcome page
  song1:      'happy-birthday-254480.mp3',                          // memories page
  song2:      'clock-ticking-60-second-countdown-118231.mp3',                          // countdown trigger
  songCD:     'clock-ticking-60-second-countdown-118231.mp3',       // countdown tick
  song3:      'WhatsApp Audio 2025-10-24 at 21.29.27_789c5f74.mp3', // wishes page
  song4:      'WhatsApp Audio 2025-10-24 at 21.29.27_789c5f74.mp3', // dreams page
};
// ══════════════════════════════════════════════════════════════════════════════

const PHOTOS = [
  'ii444.jpeg','ii.jpg','ii33.png','ii3.jpeg','ii6.jpeg','ii62.jpg','ii44.jpeg', 
  'ii26.jpeg','ii8.jpeg','ii99.jpeg','ii10.jpeg','ii11.jpeg','ii222.jpeg','ii1223.jpeg',
  'ii61.jpeg','ii155.jpeg','ii16.jpeg','ii30.jpeg','ii18.jpeg','ii19.jpeg',
  'ii20.jpeg','ii27.jpeg','ii22.jpeg','ii13.jpeg','ii60.jpeg', 
];

const DREAM_CARDS = [
  { icon:'📚', title:'Her Library',    line:"A room of her own. Floor-to-ceiling shelves. Rain on the window. That's the dream — and she'll get there." },
  { icon:'🌿', title:'Her Forest',     line:'Barefoot on grass. Wind in trees. A girl who knows that the best therapy has no appointment.' },
  { icon:'🍦', title:'Her Ice Cream',  line:'May she always find the best flavour. May nobody ever judge how many scoops. This is non-negotiable.' },
  { icon:'🧸', title:'Her Little Joys',line:'Toys. Soft things. The silly stuff. May she never outgrow the things that make her eyes light up.' },
  { icon:'🌍', title:'Her World',      line:"May she go everywhere she's pinned on a map, talked about at 2am, and quietly dreamed of alone." },
  { icon:'🌸', title:'Her People',     line:'May every person in her life be someone who stays — not just in good chapters, but in the hard ones too.' },
];

const FIREFLIES = [
  { l:22, t:32, tx:'45px',  ty:'-65px', d:0,   dur:4.2 },
  { l:62, t:52, tx:'-35px', ty:'-80px', d:1.1, dur:5.0 },
  { l:42, t:72, tx:'55px',  ty:'-45px', d:2.0, dur:3.8 },
  { l:78, t:28, tx:'-45px', ty:'-72px', d:0.6, dur:4.6 },
  { l:18, t:62, tx:'30px',  ty:'-88px', d:1.7, dur:5.5 },
  { l:88, t:78, tx:'-38px', ty:'-52px', d:2.8, dur:3.6 },
  { l:55, t:18, tx:'28px',  ty:'-60px', d:0.3, dur:6.0 },
];

const CONFETTI_DATA = [
  { l:6,  d:0,   dur:3.6, c:'#c9a44a' },
  { l:16, d:0.5, dur:4.2, c:'#4a7c59' },
  { l:28, d:0.9, dur:3.2, c:'#c9847a' },
  { l:42, d:0.2, dur:4.8, c:'#8aab7a' },
  { l:58, d:1.1, dur:3.9, c:'#c9a44a' },
  { l:70, d:0.7, dur:3.1, c:'#e8b4a8' },
  { l:82, d:1.4, dur:4.4, c:'#2d4a2d' },
  { l:94, d:0.4, dur:3.7, c:'#c9a44a' },
];

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400&display=swap');`;

// ─────────────────────────────────────────────────────────────────────────────
export default function BirthdaySurprise() {
  const [step, setStep]         = useState(0);
  const [count, setCount]       = useState(3);
  const [counting, setCounting] = useState(false);
  const [muted, setMuted]       = useState(false);
  const [mounted, setMounted]   = useState(false);
  // userStarted: true once user taps the very first button — needed for autoplay policy
  const [userStarted, setUserStarted] = useState(false);
  const audioRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  // ── Core play helper ───────────────────────────────────────────────────────
  const playBg = useCallback((src) => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.src = src;
    el.loop = true;
    el.load();
    if (!muted) el.play().catch(() => {});
  }, [muted]);

  // ── Play correct song when step changes (only after user has interacted) ───
  useEffect(() => {
    if (!mounted || counting || !userStarted) return;
    const map = { 0: CONFIG.song0, 1: CONFIG.song1, 2: CONFIG.song2, 3: CONFIG.song3, 4: CONFIG.song4 };
    playBg(map[step] ?? CONFIG.song3);
  }, [step, mounted, counting, userStarted, playBg]);

  // ── Mute toggle ────────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    setMuted(m => {
      const next = !m;
      if (next) { audioRef.current?.pause(); countRef.current?.pause(); }
      else      { audioRef.current?.play().catch(() => {}); }
      return next;
    });
  }, []);

  // ── First tap: start music then go to step 1 ───────────────────────────────
  const handleStart = useCallback(() => {
    setUserStarted(true);
    const el = audioRef.current;
    if (el && !muted) {
      el.src = CONFIG.song0;
      el.loop = true;
      el.load();
      el.play().catch(() => {});
    }
    setStep(1);
  }, [muted]);

  // ── Countdown ──────────────────────────────────────────────────────────────
  const startCountdown = useCallback(() => {
    audioRef.current?.pause();
    const el = countRef.current;
    if (el) {
      el.src = CONFIG.songCD;
      el.load();
      if (!muted) el.play().catch(() => {});
    }
    setCount(3);
    setCounting(true);
  }, [muted]);

  useEffect(() => {
    if (!counting) return;
    if (count > 0) {
      const t = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setTimeout(() => {
        countRef.current?.pause();
        setCounting(false);
        setStep(3);
      }, 600);
    }
  }, [counting, count]);

  const restart = useCallback(() => {
    setStep(0);
    setCounting(false);
    setCount(3);
    setUserStarted(false);
    audioRef.current?.pause();
  }, []);

  // ── Confetti ───────────────────────────────────────────────────────────────
  const Confetti = () => (
    <>
      <style>{`@keyframes cfall{from{transform:translateY(-8px) rotate(0deg);opacity:.8}to{transform:translateY(105dvh) rotate(540deg);opacity:0}}`}</style>
      {CONFETTI_DATA.map((c,i) => (
        <div key={i} style={{ position:'fixed',top:0,left:`${c.l}%`,width:6,height:6,borderRadius:'50%',background:c.c,zIndex:200,pointerEvents:'none',animation:`cfall ${c.dur}s ${c.d}s linear infinite` }} />
      ))}
    </>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // COUNTDOWN SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (counting) return (
    <>
      <style>{`
        ${FONT}
        *{box-sizing:border-box;margin:0;padding:0}
        .cd-screen{min-height:100dvh;background:linear-gradient(160deg,#1a2e1a 0%,#2d4a2d 55%,#1f3d1f 100%);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
        .cd-screen::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 25% 25%,rgba(138,171,122,.13) 0%,transparent 55%),radial-gradient(ellipse at 75% 75%,rgba(201,164,74,.08) 0%,transparent 55%)}
        .cd-num{font-family:'Cormorant Garamond',serif;font-weight:900;font-size:clamp(8rem,40vw,15rem);color:#e8c97a;text-shadow:0 0 60px rgba(201,164,74,.42),0 0 120px rgba(201,164,74,.18);animation:cdPulse .85s ease-in-out infinite;line-height:1}
        @keyframes cdPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.07);opacity:.82}}
        .cd-caption{font-family:'Cormorant Garamond',serif;font-style:italic;color:#b8d4a8;font-size:clamp(.95rem,4vw,1.45rem);margin-top:14px;letter-spacing:.05em;text-align:center}
        .cd-ff{position:absolute;width:5px;height:5px;border-radius:50%;background:#e8c97a;box-shadow:0 0 8px 3px rgba(232,201,122,.52);animation:cdFloat linear infinite;pointer-events:none}
        @keyframes cdFloat{0%{transform:translate(0,0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translate(var(--tx),var(--ty));opacity:0}}
      `}</style>
      <audio ref={countRef} />
      <div className="cd-screen">
        {FIREFLIES.map((f,i) => <div key={i} className="cd-ff" style={{ left:`${f.l}%`,top:`${f.t}%`,'--tx':f.tx,'--ty':f.ty,animationDelay:`${f.d}s`,animationDuration:`${f.dur}s` }} />)}
        <div style={{ textAlign:'center',position:'relative',zIndex:2 }}>
          <div className="cd-num">{count}</div>
          <p className="cd-caption">The forest holds its breath, {CONFIG.name}… ✨</p>
        </div>
      </div>
    </>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 0 — WELCOME
  // ══════════════════════════════════════════════════════════════════════════
 if (step === 0) return (
    <>
      <style>{`
        ${FONT}
        *{box-sizing:border-box;margin:0;padding:0}

        .s0-root{
          min-height:100dvh;background:#020f0f;
          display:flex;align-items:center;justify-content:center;
          padding:40px 18px;position:relative;overflow:hidden;
          font-family:'DM Sans',sans-serif;
        }
        .s0-root::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
          background:radial-gradient(ellipse at 20% 20%,rgba(20,140,120,.22) 0%,transparent 55%),
                      radial-gradient(ellipse at 80% 80%,rgba(10,100,90,.18) 0%,transparent 55%),
                      radial-gradient(ellipse at 55% 45%,rgba(0,80,70,.10) 0%,transparent 65%)}
        .s0-root::after{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")}

        .s0-speck{position:fixed;border-radius:50%;background:rgba(40,200,160,.35);pointer-events:none;z-index:1;animation:s0drift ease-in-out infinite}
        @keyframes s0drift{0%,100%{transform:translateY(0) scale(1);opacity:.18}50%{transform:translateY(-20px) scale(1.3);opacity:.42}}

        .s0-prog{position:fixed;top:0;left:0;right:0;height:2px;z-index:99;background:rgba(255,255,255,.04)}
        .s0-pf{height:100%;width:0%;background:linear-gradient(90deg,#0d9980,#50e3c2,#0d9980);background-size:200%;animation:s0sh 2.8s linear infinite}
        @keyframes s0sh{0%{background-position:200% 0}100%{background-position:-200% 0}}

        .s0-music{position:fixed;top:14px;right:14px;z-index:99;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.05);border:1px solid rgba(40,200,160,.22);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px);transition:transform .2s}
        .s0-music:active{transform:scale(.88)}

        /* ─── MOBILE default: single centered card ─── */
        .s0-desktop-wrap{
          position:relative;z-index:2;
          width:100%;max-width:400px;
        }
        .s0-desktop-left{ display:none; }
        .s0-card{
          width:100%;
          background:rgba(255,255,255,.03);border:1px solid rgba(40,200,160,.14);
          border-radius:4px;padding:44px 26px 40px;
          backdrop-filter:blur(16px);
          box-shadow:0 8px 48px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.06);
          position:relative;
        }

        /* ─── DESKTOP: two-column split at 900px ─── */
        @media(min-width:900px){
          .s0-root{ padding:0; align-items:stretch; }

          .s0-desktop-wrap{
            max-width:none;width:100%;height:100dvh;
            display:grid;
            grid-template-columns:1fr 1fr;
          }

          /* LEFT — large editorial panel */
          .s0-desktop-left{
            display:flex;flex-direction:column;
            justify-content:center;
            padding:80px 72px;
            background:linear-gradient(150deg,rgba(13,153,128,.12) 0%,rgba(0,60,50,.2) 100%);
            border-right:1px solid rgba(40,200,160,.1);
            position:relative;overflow:hidden;
          }
          .s0-desktop-left::before{
            content:'';position:absolute;inset:0;
            background:radial-gradient(ellipse at 25% 55%,rgba(40,200,160,.09) 0%,transparent 60%);
          }

          .s0-dl-tag{
            font-family:'DM Sans',sans-serif;font-weight:300;
            font-size:.72rem;letter-spacing:.3em;text-transform:uppercase;
            color:rgba(40,200,160,.45);margin-bottom:24px;
            position:relative;z-index:1;
          }
          .s0-dl-name{
            font-family:'Cormorant Garamond',serif;font-weight:400;
            line-height:.9;color:#e0f5f0;
            position:relative;z-index:1;
          }
          .s0-dl-name em{
            font-style:italic;color:#50e3c2;
            font-size:clamp(4rem,6vw,6.5rem);
            display:block;margin-bottom:4px;
          }
          .s0-dl-name span{
            font-size:clamp(2rem,3vw,3.2rem);
            color:rgba(224,245,240,.35);
            letter-spacing:.06em;display:block;
          }
          .s0-dl-divider{
            width:56px;height:1px;
            background:linear-gradient(90deg,rgba(40,200,160,.6),transparent);
            margin:36px 0;position:relative;z-index:1;
          }
          .s0-dl-quote{
            font-family:'Cormorant Garamond',serif;font-style:italic;
            font-size:clamp(1rem,1.4vw,1.2rem);line-height:1.8;
            color:rgba(224,245,240,.4);
            max-width:340px;position:relative;z-index:1;
          }
          .s0-dl-steps{
            display:flex;gap:20px;margin-top:48px;
            position:relative;z-index:1;
          }
          .s0-dl-step{
            display:flex;flex-direction:column;align-items:center;gap:6px;
          }
          .s0-dl-step-dot{
            width:7px;height:7px;border-radius:50%;
            background:rgba(40,200,160,.3);border:1px solid rgba(40,200,160,.5);
          }
          .s0-dl-step-dot.active{
            background:#0d9980;
            box-shadow:0 0 8px rgba(13,153,128,.6);
          }
          .s0-dl-step-label{
            font-family:'DM Sans',sans-serif;font-weight:300;
            font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;
            color:rgba(40,200,160,.35);
          }
          .s0-dl-step-label.active{ color:rgba(40,200,160,.7); }
          /* giant watermark */
          .s0-dl-wm{
            position:absolute;bottom:-40px;right:-30px;
            font-size:14rem;opacity:.03;line-height:1;
            pointer-events:none;user-select:none;
          }

          /* RIGHT — form panel */
          .s0-card{
            border-radius:0;border:none;
            border-left:1px solid rgba(40,200,160,.07);
            padding:80px 72px;
            background:rgba(2,15,15,.6);
            box-shadow:none;
            display:flex;flex-direction:column;
            justify-content:center;
          }
        }

        /* shared inner styles */
        .s0-cn{position:absolute;font-size:1.4rem;opacity:.2;pointer-events:none}
        .s0-cn.tl{top:12px;left:14px;transform:rotate(-15deg)}.s0-cn.tr{top:12px;right:14px;transform:rotate(15deg)}
        .s0-cn.bl{bottom:12px;left:14px;transform:rotate(10deg)}.s0-cn.br{bottom:12px;right:14px;transform:rotate(-10deg)}
        @media(min-width:900px){ .s0-cn{ display:none } }

        @keyframes s0bob{0%,100%{transform:rotate(-5deg) scale(1)}50%{transform:rotate(5deg) scale(1.08)}}
        .s0-ico{font-size:2.8rem;text-align:center;margin-bottom:12px;display:block;animation:s0bob 3.5s ease-in-out infinite}
        @media(min-width:900px){ .s0-ico{ display:none } }

        .s0-ey{font-family:'DM Sans',sans-serif;font-weight:300;font-size:clamp(.68rem,2vw,.76rem);letter-spacing:.26em;text-transform:uppercase;color:rgba(40,200,160,.55);text-align:center;margin-bottom:8px}
        @media(min-width:900px){ .s0-ey{ text-align:left } }

        .s0-ttl-mobile{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(2.4rem,10vw,3.4rem);line-height:1.08;text-align:center;color:#e0f5f0;margin-bottom:6px}
        .s0-ttl-mobile em{font-style:italic;color:#50e3c2}
        @media(min-width:900px){ .s0-ttl-mobile{ display:none } }

        .s0-sub{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(.9rem,3vw,1rem);color:rgba(40,200,160,.6);text-align:center;margin-bottom:26px}
        @media(min-width:900px){ .s0-sub{ text-align:left } }

        .s0-rule{display:flex;align-items:center;gap:14px;margin:20px 0}
        .s0-rl{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(40,200,160,.28),transparent)}

        .s0-body{font-family:'DM Sans',sans-serif;font-weight:300;font-size:clamp(.88rem,3vw,.95rem);color:rgba(224,245,240,.6);text-align:center;line-height:1.75;margin-bottom:30px}
        @media(min-width:900px){ .s0-body{ text-align:left;font-size:.96rem } }

        .s0-cta{width:100%;padding:18px 20px;border-radius:14px;border:none;background:linear-gradient(135deg,#0d9980,#18c4a0);color:#fff;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1.05rem,4vw,1.2rem);cursor:pointer;letter-spacing:.02em;display:flex;align-items:center;justify-content:center;gap:10px;animation:s0glow 2s ease-in-out infinite;transition:transform .2s;position:relative;overflow:hidden}
        .s0-cta::after{content:'';position:absolute;top:0;left:-75%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);animation:s0sw 2.4s ease-in-out infinite}
        @keyframes s0sw{0%{left:-75%}100%{left:125%}}
        @keyframes s0glow{0%,100%{box-shadow:0 4px 20px rgba(13,153,128,.5),0 0 36px rgba(13,153,128,.18)}50%{box-shadow:0 4px 34px rgba(13,153,128,.82),0 0 60px rgba(13,153,128,.36)}}
        .s0-cta:active{transform:scale(.97)}

        .s0-arr{display:inline-block;animation:s0ab 1.1s ease-in-out infinite}
        @keyframes s0ab{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}

        .s0-hint{text-align:center;margin-top:11px;font-family:'DM Sans',sans-serif;font-weight:300;font-size:.72rem;color:rgba(40,200,160,.4);letter-spacing:.08em;animation:s0bl 2.6s ease-in-out infinite}
        @keyframes s0bl{0%,100%{opacity:.4}50%{opacity:.9}}

        @keyframes s0up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .s0-in{animation:s0up .6s ease both}
        .s0-d1{animation-delay:.05s}.s0-d2{animation-delay:.12s}.s0-d3{animation-delay:.19s}.s0-d4{animation-delay:.26s}
      `}</style>

      <audio ref={audioRef} loop />

      <div className="s0-root">
        {/* ambient specks */}
        {[{l:8,t:15,sz:3,d:0,dur:5},{l:82,t:22,sz:4,d:1.4,dur:6.2},{l:18,t:70,sz:3,d:2.1,dur:4.6},{l:90,t:68,sz:5,d:.7,dur:5.8},{l:50,t:10,sz:3,d:1.9,dur:4.2},{l:35,t:88,sz:4,d:.4,dur:6.5},{l:70,t:50,sz:3,d:2.6,dur:5.3}].map((s,i) => (
          <div key={i} className="s0-speck" style={{ left:`${s.l}%`,top:`${s.t}%`,width:s.sz,height:s.sz,animationDelay:`${s.d}s`,animationDuration:`${s.dur}s` }} />
        ))}

        <div className="s0-prog"><div className="s0-pf" /></div>
        {mounted && <button className="s0-music" onClick={toggleMute}>{muted?'🔇':'🔊'}</button>}

        {/* outer wrapper — single column mobile, two-column desktop */}
        <div className="s0-desktop-wrap">

          {/* ── LEFT panel (desktop only) ── */}
          <div className="s0-desktop-left">
            <p className="s0-dl-tag">a letter just for you</p>
            <h1 className="s0-dl-name">
              <em>{CONFIG.name}</em>
              <span>Birthday</span>
            </h1>
            <div className="s0-dl-divider" />
            <p className="s0-dl-quote">
              "Turn the page to a new chapter.<br />
              Something special has been pressed<br />
              between these leaves — just for you."
            </p>
            {/* journey dots */}
            <div className="s0-dl-steps">
              {['Open','Memories','Countdown','Wishes','Dreams'].map((label,i) => (
                <div key={i} className="s0-dl-step">
                  <div className={`s0-dl-step-dot${i===0?' active':''}`} />
                  <span className={`s0-dl-step-label${i===0?' active':''}`}>{label}</span>
                </div>
              ))}
            </div>
            <div className="s0-dl-wm">🌿</div>
          </div>

          {/* ── RIGHT panel — the card (shown on both mobile + desktop) ── */}
          <div className="s0-card">
            {/* corners — mobile only */}
            <span className="s0-cn tl">🌿</span><span className="s0-cn tr">🍃</span>
            <span className="s0-cn bl">🍂</span><span className="s0-cn br">🌸</span>

            {/* bobbing icon — mobile only */}
            <span className="s0-ico">🌿</span>

            <div className="s0-in s0-d1">
              <p className="s0-ey">a letter just for you</p>
              {/* title shown only on mobile (desktop uses left panel) */}
              <h1 className="s0-ttl-mobile">
                <em>{CONFIG.name}&apos;s</em><br />Birthday
              </h1>
              <p className="s0-sub">as gentle as a forest morning 🍃</p>
            </div>

            <div className="s0-rule s0-in s0-d2">
              <div className="s0-rl" />
              <span style={{fontSize:'.85rem',opacity:.35}}>✦</span>
              <div className="s0-rl" />
            </div>

            <p className="s0-body s0-in s0-d3">
              Turn the page to a new chapter.<br />
              Something special has been pressed<br />
              between these leaves — just for you.
            </p>

            <div className="s0-in s0-d4">
              <button className="s0-cta" onClick={handleStart}>
                🌿 Open the Book <span className="s0-arr">→</span>
              </button>
              <p className="s0-hint">tap to begin the journey ✦</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 1 — MEMORIES
  // ══════════════════════════════════════════════════════════════════════════
  if (step === 1) return (
    <>
      <style>{`
        ${FONT}
        *{box-sizing:border-box;margin:0;padding:0}
        .s1-root{min-height:100dvh;background:#08060f;font-family:'DM Sans',sans-serif;color:#ece8f5;position:relative;overflow-x:hidden;padding-bottom:120px}
        .s1-root::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse at 10% 15%,rgba(100,60,180,.22) 0%,transparent 55%),radial-gradient(ellipse at 90% 85%,rgba(60,40,140,.18) 0%,transparent 55%),radial-gradient(ellipse at 55% 40%,rgba(140,80,200,.08) 0%,transparent 60%)}
        .s1-root::after{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")}
        .s1-dust{position:fixed;border-radius:50%;background:rgba(160,120,255,.4);pointer-events:none;z-index:1;animation:s1fl ease-in-out infinite}
        @keyframes s1fl{0%,100%{transform:translateY(0) scale(1);opacity:.18}50%{transform:translateY(-22px) scale(1.2);opacity:.45}}
        .s1-prog{position:fixed;top:0;left:0;right:0;height:2px;z-index:99;background:rgba(255,255,255,.04)}
        .s1-pf{height:100%;width:25%;background:linear-gradient(90deg,#6b3fa0,#a07ad4,#6b3fa0);background-size:200%;animation:s1sh 2.5s linear infinite}
        @keyframes s1sh{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .s1-music{position:fixed;top:14px;right:14px;z-index:110;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.05);border:1px solid rgba(160,120,255,.25);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px);transition:transform .2s}
        .s1-music:active{transform:scale(.88)}
        .s1-scroll{position:relative;z-index:2;padding:54px 16px 16px;max-width:540px;margin:0 auto}
        .s1-back{font-family:'DM Sans',sans-serif;font-weight:300;font-size:.82rem;color:rgba(196,168,240,.4);background:transparent;border:none;cursor:pointer;letter-spacing:.04em;padding:4px 0;margin-bottom:20px;display:block;transition:color .2s}
        .s1-back:active{color:rgba(196,168,240,.85)}
        .s1-ey{font-family:'DM Sans',sans-serif;font-weight:300;font-size:clamp(.68rem,2vw,.76rem);letter-spacing:.26em;text-transform:uppercase;color:rgba(160,120,255,.5);text-align:center;margin-bottom:6px}
        .s1-ttl{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(2rem,8vw,3rem);line-height:1.05;text-align:center;color:#ece8f5;margin-bottom:4px}
        .s1-ttl em{font-style:italic;color:#c4a8f0}
        .s1-cap{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(.88rem,3vw,.98rem);color:rgba(160,120,255,.55);text-align:center;margin-bottom:22px}
        .s1-rule{display:flex;align-items:center;gap:12px;margin:18px 0}
        .s1-rl{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(160,120,255,.25),transparent)}
        .s1-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}
        @media(min-width:460px){.s1-grid{grid-template-columns:repeat(3,1fr)}}
        .s1-ph{aspect-ratio:1;border-radius:4px;overflow:hidden;position:relative;background:rgba(255,255,255,.03);border:1px solid rgba(160,120,255,.10);transition:transform .22s}
        .s1-ph:active{transform:scale(.96)}
        .s1-ph img{width:100%;height:100%;object-fit:cover;display:block}
        .s1-ph::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(50,15,100,.68) 0%,transparent 52%);opacity:0;transition:opacity .28s}
        .s1-ph:hover::after{opacity:1}
        .s1-ml{position:absolute;bottom:7px;left:8px;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.64rem;color:rgba(236,232,245,.8);z-index:2;opacity:0;transform:translateY(4px);transition:opacity .28s,transform .28s}
        .s1-ph:hover .s1-ml{opacity:1;transform:translateY(0)}
        .s1-sticky{position:fixed;bottom:0;left:0;right:0;z-index:100;padding:14px 20px 22px;background:rgba(12,8,24,.82);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid rgba(160,120,255,.14)}
        .s1-cta{width:100%;max-width:500px;margin:0 auto;display:flex;align-items:center;justify-content:center;gap:10px;padding:17px 24px;border-radius:16px;border:none;background:linear-gradient(135deg,#6b3fa0 0%,#9b6fd4 60%,#7c4fd4 100%);color:#fff;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1.1rem,4.5vw,1.25rem);letter-spacing:.02em;cursor:pointer;position:relative;overflow:hidden;animation:s1glow 2s ease-in-out infinite;transition:transform .15s}
        .s1-cta::before{content:'';position:absolute;top:0;left:-80%;width:55%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);animation:s1sw 2.2s ease-in-out infinite}
        @keyframes s1sw{0%{left:-80%}100%{left:130%}}
        @keyframes s1glow{0%,100%{box-shadow:0 4px 22px rgba(107,63,160,.55),0 0 40px rgba(107,63,160,.2)}50%{box-shadow:0 4px 36px rgba(107,63,160,.88),0 0 64px rgba(107,63,160,.42)}}
        .s1-cta:active{transform:scale(.97)}
        .s1-arr{display:inline-block;font-style:normal;animation:s1bn 1.1s ease-in-out infinite}
        @keyframes s1bn{0%,100%{transform:translateX(0)}50%{transform:translateX(7px)}}
        .s1-hint{text-align:center;margin-top:8px;font-family:'DM Sans',sans-serif;font-weight:300;font-size:.70rem;color:rgba(160,120,255,.5);letter-spacing:.1em;animation:s1bl 2.4s ease-in-out infinite}
        @keyframes s1bl{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes s1up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .s1-in{animation:s1up .55s ease both}
        .s1-d1{animation-delay:.04s}.s1-d2{animation-delay:.10s}.s1-d3{animation-delay:.16s}.s1-d4{animation-delay:.22s}
      `}</style>
      <audio ref={audioRef} loop />
      <div className="s1-root">
        {[{l:8,t:18,sz:3,d:0,dur:4.5},{l:25,t:65,sz:4,d:1.2,dur:5.5},{l:50,t:30,sz:3,d:.6,dur:4.8},{l:70,t:72,sz:5,d:1.8,dur:6},{l:88,t:22,sz:3,d:.3,dur:5.2},{l:40,t:88,sz:4,d:2.1,dur:4.2},{l:92,t:55,sz:3,d:.9,dur:5.8}].map((s,i) => (
          <div key={i} className="s1-dust" style={{ left:`${s.l}%`,top:`${s.t}%`,width:s.sz,height:s.sz,animationDelay:`${s.d}s`,animationDuration:`${s.dur}s` }} />
        ))}
        <div className="s1-prog"><div className="s1-pf" /></div>
        {mounted && <button className="s1-music" onClick={toggleMute}>{muted?'🔇':'🔊'}</button>}
        <div className="s1-scroll">
          <button className="s1-back s1-in s1-d1" onClick={() => setStep(0)}>← back</button>
          <div className="s1-in s1-d2">
            <p className="s1-ey">a collection of moments</p>
            <h2 className="s1-ttl"><em>Memory</em> Lane</h2>
            <p className="s1-cap">every photo, a pressed petal 🌸</p>
          </div>
          <div className="s1-rule s1-in s1-d2">
            <div className="s1-rl" /><span style={{fontSize:'.8rem',opacity:.3}}>✦</span><div className="s1-rl" />
          </div>
          <div className="s1-grid s1-in s1-d3">
            {PHOTOS.map((p,i) => (
              <div key={i} className="s1-ph">
                <Image src={`/${p}`} alt={`Memory ${i+1}`} width={300} height={300} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                <div className="s1-ml">#{i+1}</div>
              </div> 
            ))}
          </div>
        </div>
        <div className="s1-sticky">
          <button className="s1-cta" onClick={() => setStep(2)}>
            Turn the page <span className="s1-arr">→</span>
          </button>
          <p className="s1-hint">scroll through the memories, then tap ✦</p>
        </div>
      </div>
    </>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 2 — COUNTDOWN TRIGGER
  // ══════════════════════════════════════════════════════════════════════════
  if (step === 2) return (
    <>
      <style>{`
        ${FONT}
        *{box-sizing:border-box;margin:0;padding:0}
        .s2-root{min-height:100dvh;background:#0a0a14;display:flex;align-items:center;justify-content:center;padding:40px 18px;position:relative;overflow:hidden;font-family:'DM Sans',sans-serif}
        .s2-root::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse at 30% 30%,rgba(180,140,60,.15) 0%,transparent 55%),radial-gradient(ellipse at 70% 70%,rgba(140,100,30,.12) 0%,transparent 55%)}
        .s2-root::after{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")}
        .s2-speck{position:fixed;border-radius:50%;background:rgba(220,180,80,.4);pointer-events:none;z-index:1;animation:s2dr ease-in-out infinite}
        @keyframes s2dr{0%,100%{transform:translateY(0) scale(1);opacity:.15}50%{transform:translateY(-18px) scale(1.25);opacity:.38}}
        .s2-prog{position:fixed;top:0;left:0;right:0;height:2px;z-index:99;background:rgba(255,255,255,.04)}
        .s2-pf{height:100%;width:50%;background:linear-gradient(90deg,#c98232,#e8c97a,#c98232);background-size:200%;animation:s2sh 2.8s linear infinite}
        @keyframes s2sh{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .s2-music{position:fixed;top:14px;right:14px;z-index:99;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.05);border:1px solid rgba(220,180,80,.22);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px);transition:transform .2s}
        .s2-music:active{transform:scale(.88)}
        .s2-card{position:relative;z-index:2;width:100%;max-width:400px;background:rgba(255,255,255,.03);border:1px solid rgba(220,180,80,.14);border-radius:4px;padding:44px 26px 40px;text-align:center;backdrop-filter:blur(16px);box-shadow:0 8px 48px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.06)}
        .s2-cn{position:absolute;font-size:1.4rem;opacity:.18;pointer-events:none}
        .s2-cn.tl{top:12px;left:14px;transform:rotate(-15deg)}.s2-cn.tr{top:12px;right:14px;transform:rotate(15deg)}.s2-cn.bl{bottom:12px;left:14px;transform:rotate(10deg)}.s2-cn.br{bottom:12px;right:14px;transform:rotate(-10deg)}
        @keyframes s2bob{0%,100%{transform:rotate(-5deg) scale(1)}50%{transform:rotate(5deg) scale(1.08)}}
        .s2-ico{font-size:2.8rem;margin-bottom:14px;display:block;animation:s2bob 2.5s ease-in-out infinite}
        .s2-ey{font-family:'DM Sans',sans-serif;font-weight:300;font-size:clamp(.68rem,2vw,.76rem);letter-spacing:.26em;text-transform:uppercase;color:rgba(220,180,80,.5);margin-bottom:8px}
        .s2-ttl{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(2rem,8vw,2.8rem);line-height:1.08;color:#f0e6d0;margin-bottom:6px}
        .s2-ttl em{font-style:italic;color:#e8c97a}
        .s2-rule{display:flex;align-items:center;gap:14px;margin:18px 0}
        .s2-rl{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(220,180,80,.28),transparent)}
        .s2-body{font-family:'DM Sans',sans-serif;font-weight:300;font-size:clamp(.88rem,3vw,.96rem);color:rgba(240,230,208,.6);line-height:1.8;margin-bottom:28px}
        .s2-body em{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.06em;color:rgba(220,180,80,.75)}
        .s2-cta{width:100%;padding:18px 20px;border-radius:14px;border:none;background:linear-gradient(135deg,#b86e1a,#e89a32);color:#fff;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1.05rem,4vw,1.2rem);cursor:pointer;letter-spacing:.02em;display:flex;align-items:center;justify-content:center;gap:10px;animation:s2glow 2s ease-in-out infinite;transition:transform .2s;position:relative;overflow:hidden}
        .s2-cta::after{content:'';position:absolute;top:0;left:-75%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);animation:s2sw 2.4s ease-in-out infinite}
        @keyframes s2sw{0%{left:-75%}100%{left:125%}}
        @keyframes s2glow{0%,100%{box-shadow:0 4px 20px rgba(184,110,26,.5),0 0 36px rgba(184,110,26,.18)}50%{box-shadow:0 4px 34px rgba(184,110,26,.82),0 0 60px rgba(184,110,26,.36)}}
        .s2-cta:active{transform:scale(.97)}
        .s2-arr{display:inline-block;animation:s2ab 1.1s ease-in-out infinite}
        @keyframes s2ab{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}
        .s2-hint{text-align:center;margin-top:11px;font-family:'DM Sans',sans-serif;font-weight:300;font-size:.72rem;color:rgba(220,180,80,.38);letter-spacing:.08em;animation:s2bl 2.6s ease-in-out infinite}
        @keyframes s2bl{0%,100%{opacity:.38}50%{opacity:.85}}
        .s2-back{margin-top:12px;width:100%;padding:12px 20px;border-radius:4px;border:1px solid rgba(255,255,255,.07);background:transparent;color:rgba(240,230,208,.35);font-family:'DM Sans',sans-serif;font-weight:300;font-size:.86rem;cursor:pointer;letter-spacing:.04em}
        .s2-back:active{color:rgba(240,230,208,.7)}
        @keyframes s2up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .s2-in{animation:s2up .6s ease both}
        .s2-d1{animation-delay:.05s}.s2-d2{animation-delay:.12s}.s2-d3{animation-delay:.19s}.s2-d4{animation-delay:.26s}
      `}</style>
      <audio ref={audioRef} loop />
      <div className="s2-root">
        {[{l:10,t:12,sz:3,d:0,dur:5},{l:80,t:25,sz:4,d:1.3,dur:6},{l:20,t:75,sz:3,d:2,dur:4.5},{l:88,t:60,sz:5,d:.6,dur:5.8},{l:48,t:8,sz:3,d:1.7,dur:4},{l:60,t:90,sz:4,d:.3,dur:6.2}].map((s,i) => (
          <div key={i} className="s2-speck" style={{ left:`${s.l}%`,top:`${s.t}%`,width:s.sz,height:s.sz,animationDelay:`${s.d}s`,animationDuration:`${s.dur}s` }} />
        ))}
        <div className="s2-prog"><div className="s2-pf" /></div>
        {mounted && <button className="s2-music" onClick={toggleMute}>{muted?'🔇':'🔊'}</button>}
        <div className="s2-card">
          <span className="s2-cn tl">🍃</span><span className="s2-cn tr">🌿</span>
          <span className="s2-cn bl">🌸</span><span className="s2-cn br">🍂</span>
          <span className="s2-ico">⏳</span>
          <div className="s2-in s2-d1">
            <p className="s2-ey">the moment arrives</p>
            <h2 className="s2-ttl">Almost <em>Time…</em></h2>
          </div>
          <div className="s2-rule s2-in s2-d2">
            <div className="s2-rl" /><span style={{fontSize:'.85rem',opacity:.35}}>✦</span><div className="s2-rl" />
          </div>
          <p className="s2-body s2-in s2-d3">
            The forest holds its breath…<br />
            The last page turns, slowly.<br />
            <em>Are you ready, {CONFIG.name}?</em>
          </p>
          <div className="s2-in s2-d4">
            <button className="s2-cta" onClick={startCountdown}>
              🌸 Start the Countdown <span className="s2-arr">→</span>
            </button>
            <p className="s2-hint">tap when you&apos;re ready ✦</p>
            <button className="s2-back" onClick={() => setStep(1)}>← back to memories</button>
          </div>
        </div>
      </div>
    </>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 3 — BIRTHDAY WISHES
  // ══════════════════════════════════════════════════════════════════════════
 if (step === 3) {
    const wishes = [
      { icon:'📖', line:"You are someone's favourite chapter." },
      { icon:'🌿', line:'Rare. Like a forest path nobody else finds.' },
      { icon:'🍃', line:'Storms only visit forests worth staying for.' },
      { icon:'🌸', line:'Every dream in the margins — this year, let them bloom.' },
      { icon:'🕯️', line:'May your evenings always hold a good book and peace.' },
      { icon:'🌙', line:'Har shaam sukoon bhari ho. Har subah naya sapna.' },
    ];
    return (
      <>
        <style>{`
          ${FONT}
          *{box-sizing:border-box;margin:0;padding:0}

          .s3-root{min-height:100dvh;background:#0d1a0d;font-family:'DM Sans',sans-serif;color:#e8e0d0;position:relative;overflow-x:hidden}
          .s3-root::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
            background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");opacity:.5}
          .s3-b1{position:fixed;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(74,124,89,.18) 0%,transparent 70%);top:-80px;left:-80px;pointer-events:none;z-index:0}
          .s3-b2{position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(201,164,74,.10) 0%,transparent 70%);bottom:60px;right:-60px;pointer-events:none;z-index:0}
          .s3-music{position:fixed;top:14px;right:14px;z-index:99;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);transition:transform .2s}
          .s3-music:active{transform:scale(.88)}
          .s3-prog{position:fixed;top:0;left:0;right:0;height:2px;z-index:98;background:rgba(255,255,255,.06)}
          .s3-pf{height:100%;width:75%;background:linear-gradient(90deg,#4a7c59,#c9a44a)}

          /* ════ MOBILE (unchanged) ════ */
          .s3-sc{position:relative;z-index:1;padding:64px 20px 80px;max-width:520px;margin:0 auto}
          .s3-av{display:flex;justify-content:center;margin-bottom:32px}
          .s3-avr{width:108px;height:108px;border-radius:50%;border:2px solid rgba(201,164,74,.6);box-shadow:0 0 0 8px rgba(201,164,74,.08),0 12px 40px rgba(0,0,0,.5);overflow:hidden}
          .s3-nt{font-family:'DM Sans',sans-serif;font-weight:300;font-size:clamp(.72rem,2.5vw,.82rem);letter-spacing:.22em;text-transform:uppercase;color:rgba(138,171,122,.7);text-align:center;margin-bottom:6px}
          .s3-nm{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(3rem,12vw,4.5rem);line-height:1;text-align:center;color:#e8e0d0;margin-bottom:4px}
          .s3-nm em{font-style:italic;color:#c9a44a}
          .s3-bl{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1rem,4vw,1.25rem);color:rgba(201,132,122,.9);text-align:center;margin-bottom:36px}
          .s3-rule{display:flex;align-items:center;gap:14px;margin:28px 0}
          .s3-rl{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(201,164,74,.35),transparent)}
          .s3-ri{font-size:.9rem;opacity:.6}
          .s3-qt{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1.15rem,4.5vw,1.4rem);line-height:1.65;color:rgba(232,224,208,.92);text-align:center;margin-bottom:6px;padding:0 8px}
          .s3-qc{text-align:center;font-size:.75rem;color:rgba(201,164,74,.6);letter-spacing:.1em;font-family:'DM Sans',sans-serif;font-weight:300;margin-bottom:36px}
          .s3-wr{display:flex;align-items:flex-start;gap:14px;padding:16px 0;border-bottom:1px solid rgba(255,255,255,.05)}
          .s3-wr:last-child{border-bottom:none}
          .s3-wi{font-size:1.1rem;flex-shrink:0;margin-top:2px;width:28px;text-align:center;opacity:.85}
          .s3-wt{font-family:'DM Sans',sans-serif;font-weight:300;font-size:clamp(.9rem,3.2vw,1rem);line-height:1.65;color:rgba(232,224,208,.85)}
          .s3-pw{margin:36px 0;padding:24px 20px;border:1px solid rgba(201,164,74,.18);border-radius:3px;position:relative}
          .s3-pw::before{content:'❧';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#0d1a0d;padding:0 10px;font-size:1.2rem;color:rgba(201,164,74,.5)}
          .s3-pt{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1rem,3.5vw,1.15rem);color:rgba(138,171,122,.9);text-align:center;margin-bottom:18px}
          .s3-pr{display:flex;align-items:flex-start;gap:10px;margin:10px 0;font-family:'DM Sans',sans-serif;font-weight:300;font-size:clamp(.86rem,3vw,.94rem);color:rgba(232,224,208,.8);line-height:1.6}
          .s3-cl{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1.05rem,4vw,1.25rem);color:rgba(201,164,74,.85);text-align:center;line-height:1.7;margin:32px 0}
          .s3-bp{width:100%;padding:15px 20px;border-radius:4px;border:1px solid rgba(201,164,74,.5);background:rgba(201,164,74,.12);color:#e8c97a;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1rem,3.5vw,1.1rem);cursor:pointer;letter-spacing:.03em;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:8px}
          .s3-bp:active{background:rgba(201,164,74,.22)}
          .s3-bg{width:100%;padding:12px 20px;border-radius:4px;border:1px solid rgba(255,255,255,.1);background:transparent;color:rgba(232,224,208,.5);font-family:'DM Sans',sans-serif;font-weight:300;font-size:.88rem;cursor:pointer;letter-spacing:.04em;transition:color .2s}
          .s3-bg:active{color:rgba(232,224,208,.8)}
          .s3-bs{display:flex;flex-direction:column;gap:10px;margin-top:36px}
          .s3-ft{text-align:center;margin-top:40px;padding-top:24px;border-top:1px solid rgba(255,255,255,.06)}
          .s3-fi{font-size:.9rem;opacity:.3;letter-spacing:.3em;margin-bottom:8px}
          .s3-fx{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.82rem;color:rgba(138,171,122,.45)}

          .s3-desk{display:none}

          /* ════ DESKTOP — Book / Broadsheet Spread ════ */
          @media(min-width:960px){
            .s3-sc{display:none}
            .s3-desk{
              display:block;
              position:relative;z-index:1;
              min-height:100dvh;
              padding:0 56px 72px;
              max-width:1200px;
              margin:0 auto;
            }

            /* ── Masthead / newspaper header ── */
            .s3-mast{
              padding:48px 0 24px;
              border-bottom:3px solid rgba(201,164,74,.25);
              margin-bottom:0;
              display:grid;
              grid-template-columns:1fr auto 1fr;
              align-items:end;
              gap:24px;
            }
            .s3-mast-left{
              font-family:'DM Sans',sans-serif;font-weight:300;
              font-size:.62rem;letter-spacing:.3em;text-transform:uppercase;
              color:rgba(138,171,122,.4);
              align-self:end;padding-bottom:6px;
            }
            .s3-mast-center{text-align:center}
            .s3-mast-issue{
              font-family:'DM Sans',sans-serif;font-weight:300;
              font-size:.58rem;letter-spacing:.28em;text-transform:uppercase;
              color:rgba(138,171,122,.35);margin-bottom:8px;display:block;
            }
            .s3-mast-name{
              font-family:'Cormorant Garamond',serif;font-weight:400;
              font-size:clamp(3.5rem,5.5vw,6rem);
              line-height:.9;color:#e8e0d0;
              letter-spacing:-.01em;
            }
            .s3-mast-name em{font-style:italic;color:#c9a44a}
            .s3-mast-sub{
              font-family:'Cormorant Garamond',serif;font-style:italic;
              font-size:clamp(.9rem,1.3vw,1.15rem);
              color:rgba(201,132,122,.7);margin-top:6px;display:block;
            }
            .s3-mast-right{
              text-align:right;align-self:end;padding-bottom:6px;
            }
            .s3-mast-date{
              font-family:'Cormorant Garamond',serif;font-style:italic;
              font-size:.78rem;color:rgba(138,171,122,.35);
              letter-spacing:.04em;
            }

            /* thin rule below masthead */
            .s3-mast-rule{
              display:flex;align-items:center;gap:0;
              margin-bottom:36px;
            }
            .s3-mast-rl{flex:1;height:1px;background:rgba(201,164,74,.15)}
            .s3-mast-ornament{
              font-size:.9rem;opacity:.4;padding:0 12px;
            }

            /* ── 3-column newspaper grid ── */
            .s3-cols{
              display:grid;
              grid-template-columns:1fr 2px 1fr 2px 1fr;
              gap:0 32px;
              align-items:start;
            }
            /* column dividers */
            .s3-col-div{
              background:rgba(201,164,74,.12);
              align-self:stretch;
            }

            /* column 1 — photo + big quote */
            .s3-col1{}
            .s3-c1-photo{
              width:100%;aspect-ratio:.8;
              overflow:hidden;border-radius:2px;
              margin-bottom:16px;
              position:relative;
            }
            .s3-c1-photo img{
              width:100%;height:100%;object-fit:cover;display:block;
              filter:sepia(.15) brightness(.88);
            }
            /* caption under photo */
            .s3-c1-caption{
              font-family:'DM Sans',sans-serif;font-weight:300;
              font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;
              color:rgba(138,171,122,.4);text-align:center;
              border-top:1px solid rgba(201,164,74,.12);
              padding-top:8px;margin-bottom:24px;
            }
            /* pull quote */
            .s3-c1-pull{
              font-family:'Cormorant Garamond',serif;font-style:italic;
              font-size:clamp(1.1rem,1.5vw,1.4rem);line-height:1.55;
              color:rgba(232,224,208,.88);
              border-top:2px solid rgba(201,164,74,.3);
              border-bottom:2px solid rgba(201,164,74,.3);
              padding:18px 0;margin-bottom:12px;
            }
            .s3-c1-credit{
              font-family:'DM Sans',sans-serif;font-weight:300;
              font-size:.62rem;letter-spacing:.12em;
              color:rgba(201,164,74,.5);
            }

            /* column 2 — wishes as typeset paragraphs */
            .s3-col2{}
            .s3-col2-head{
              font-family:'Cormorant Garamond',serif;font-weight:400;
              font-size:clamp(1.3rem,1.8vw,1.7rem);
              color:#e8e0d0;margin-bottom:4px;
              border-bottom:1px solid rgba(201,164,74,.2);
              padding-bottom:10px;margin-bottom:18px;
              letter-spacing:.01em;
            }
            .s3-col2-head em{font-style:italic;color:rgba(201,164,74,.8)}
            /* wishes as paragraph lines */
            .s3-col2-wish{
              font-family:'DM Sans',sans-serif;font-weight:300;
              font-size:.88rem;line-height:1.75;
              color:rgba(232,224,208,.75);
              padding:12px 0;
              border-bottom:1px solid rgba(255,255,255,.04);
              display:flex;align-items:flex-start;gap:10px;
            }
            .s3-col2-wish:last-child{border-bottom:none}
            .s3-col2-icon{flex-shrink:0;font-size:.95rem;margin-top:2px;opacity:.7}
            /* prayer as inset box */
            .s3-col2-prayer{
              margin-top:20px;
              padding:16px 14px;
              background:rgba(201,164,74,.05);
              border:1px solid rgba(201,164,74,.14);
            }
            .s3-col2-prayer-head{
              font-family:'Cormorant Garamond',serif;font-style:italic;
              font-size:.88rem;color:rgba(138,171,122,.7);
              text-align:center;margin-bottom:12px;
              display:flex;align-items:center;gap:8px;justify-content:center;
            }
            .s3-col2-prayer-line{flex:1;height:1px;background:rgba(138,171,122,.15)}
            .s3-col2-pr{
              font-family:'DM Sans',sans-serif;font-weight:300;
              font-size:.8rem;color:rgba(232,224,208,.65);
              line-height:1.65;padding:5px 0;
              display:flex;gap:8px;
            }

            /* column 3 — closing + nav */
            .s3-col3{
              display:flex;flex-direction:column;
              gap:0;
            }
            /* big decorative initial */
            .s3-c3-drop{
              font-family:'Cormorant Garamond',serif;font-weight:400;
              font-size:5rem;line-height:.85;
              color:rgba(201,164,74,.18);
              float:left;margin-right:6px;margin-top:4px;
            }
            .s3-c3-body{
              font-family:'Cormorant Garamond',serif;font-style:italic;
              font-size:.96rem;line-height:1.8;
              color:rgba(232,224,208,.55);
              margin-bottom:28px;
              clear:both;
            }
            /* closing Hindi line as displayed quote */
            .s3-c3-hindi{
              font-family:'Cormorant Garamond',serif;font-style:italic;
              font-size:clamp(1rem,1.4vw,1.2rem);
              color:rgba(201,164,74,.75);
              line-height:1.7;
              border-left:2px solid rgba(201,164,74,.25);
              padding-left:14px;
              margin-bottom:32px;
            }
            /* footer ornament */
            .s3-c3-ornament{
              text-align:center;font-size:.85rem;
              letter-spacing:.4em;opacity:.2;margin-bottom:24px;
            }
            /* nav buttons */
            .s3-c3-next{
              width:100%;padding:14px 16px;
              border:1px solid rgba(201,164,74,.45);
              background:rgba(201,164,74,.1);color:#e8c97a;
              font-family:'Cormorant Garamond',serif;font-style:italic;
              font-size:.94rem;cursor:pointer;letter-spacing:.03em;
              transition:background .2s;
              display:flex;align-items:center;justify-content:center;gap:8px;
              margin-bottom:8px;
            }
            .s3-c3-next:active{background:rgba(201,164,74,.22)}
            .s3-c3-ghost{
              width:100%;padding:10px;border:none;background:transparent;
              font-family:'DM Sans',sans-serif;font-weight:300;
              font-size:.74rem;color:rgba(232,224,208,.25);
              cursor:pointer;letter-spacing:.04em;transition:color .2s;text-align:center;
            }
            .s3-c3-ghost:active{color:rgba(232,224,208,.65)}

            /* footer row */
            .s3-foot{
              margin-top:36px;padding-top:16px;
              border-top:1px solid rgba(201,164,74,.12);
              display:flex;justify-content:space-between;align-items:center;
            }
            .s3-foot-l,.s3-foot-r{
              font-family:'DM Sans',sans-serif;font-weight:300;
              font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;
              color:rgba(138,171,122,.25);
            }
            .s3-foot-center{
              font-family:'Cormorant Garamond',serif;font-style:italic;
              font-size:.72rem;color:rgba(138,171,122,.3);
            }
          }

          @keyframes s3fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          .s3-in{animation:s3fu .6s ease both}
          .s3-d1{animation-delay:.05s}.s3-d2{animation-delay:.12s}.s3-d3{animation-delay:.19s}
          .s3-d4{animation-delay:.26s}.s3-d5{animation-delay:.33s}.s3-d6{animation-delay:.40s}
        `}</style>

        <audio ref={audioRef} loop />
        <Confetti />

        <div className="s3-root">
          <div className="s3-b1" /><div className="s3-b2" />
          <div className="s3-prog"><div className="s3-pf" /></div>
          {mounted && <button className="s3-music" onClick={toggleMute}>{muted?'🔇':'🔊'}</button>}

          {/* ════ MOBILE (untouched) ════ */}
          <div className="s3-sc">
            <div className="s3-av s3-in s3-d1">
              <div className="s3-avr ">
                <Image src={CONFIG.photo} alt={CONFIG.name} width={256} height={256}
                  style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
              </div>
            </div>
            <div className="s3-in s3-d2">
              <p className="s3-nt">happy birthday</p>
              <h1 className="s3-nm"><em>{CONFIG.name}</em></h1>
              <p className="s3-bl">a new chapter begins 🎂</p>
            </div>
            <div className="s3-in s3-d3">
              <p className="s3-qt">"Unplanned, like a wildflower<br />pressed inside a library book —<br />right time, right person."</p>
              <p className="s3-qc">— that&apos;s always been you ❤️</p>
            </div>
            <div className="s3-rule s3-in s3-d3"><div className="s3-rl" /><span className="s3-ri">🌿</span><div className="s3-rl" /></div>
            <div className="s3-in s3-d4">
              {wishes.map((w,i) => (
                <div key={i} className="s3-wr">
                  <span className="s3-wi">{w.icon}</span>
                  <p className="s3-wt">{w.line}</p>
                </div>
              ))}
            </div>
            <div className="s3-rule s3-in s3-d4"><div className="s3-rl" /><span className="s3-ri">🌸</span><div className="s3-rl" /></div>
            <div className="s3-pw s3-in s3-d5">
              <p className="s3-pt">a small prayer, pressed in these pages</p>
              {[
                ['🍃',"May you rise higher than you've ever dared to dream."],
                ['🌸',"May your softness always be your strength, not your wound."],
                ['📖',"May every next chapter be better than the last."],
                ['🌿',"May your smile stay exactly this bright, always."],
              ].map(([ic,tx],i) => (
                <div key={i} className="s3-pr"><span>{ic}</span><span>{tx}</span></div>
              ))}
            </div>
            <p className="s3-cl s3-in s3-d5">Aaj ka din tumhare naam —<br />tumhari muskaan, tumhari kahani. 💫</p>
            <div className="s3-bs s3-in s3-d6">
              <button className="s3-bp" onClick={() => setStep(4)}>📖 Your Next Chapter →</button>
              <button className="s3-bg" onClick={() => setStep(1)}>↩ walk through memories again</button>
            </div>
            <div className="s3-ft s3-in s3-d6">
              <p className="s3-fi">🌿 🍃 🌸 🍂 🌿</p>
              <p className="s3-fx">with all the warmth of a forest morning</p>
            </div>
          </div>

          {/* ════ DESKTOP — Broadsheet / Book spread ════ */} 
          <div className="s3-desk s3-in s3-d1">

            {/* masthead */}
            <div className="s3-mast">
              <div className="s3-mast-left">I dont know why i do this </div>
              <div className="s3-mast-center">
                <span className="s3-mast-issue">happy birthday</span>
                <div className="s3-mast-name"><em>{CONFIG.name}</em></div>
                <span className="s3-mast-sub">a new chapter begins 🎂</span>
              </div>
              <div className="s3-mast-right">
                <span className="s3-mast-date"> smile Please </span>
              </div>
            </div>

            {/* thin ornamental rule */}
            <div className="s3-mast-rule">
              <div className="s3-mast-rl"/>
              <span className="s3-mast-ornament">❧ 🌿 ❧</span>
              <div className="s3-mast-rl"/>
            </div>

            {/* 3-column grid */}
            <div className="s3-cols">

              {/* COL 1 — photo + pull quote */}
              <div className="s3-col1">
                <div className="s3-c1-photo">
                  <Image src={CONFIG.photo} alt={CONFIG.name} width={400} height={500}
                    style={{width:'100%',height:'100%',objectFit:'cover',display:'block',filter:'sepia(.15) brightness(.88)'}} />
                </div>
                <p className="s3-c1-caption">{CONFIG.name} · this year's chapter</p>
                <p className="s3-c1-pull">
                  "Unplanned, like a wildflower<br />
                  pressed inside a library book —<br />
                  right time, right person."
                </p>
                <p className="s3-c1-credit">— that&apos;s always been you ❤️</p>
              </div>

              {/* divider */}
              <div className="s3-col-div" />

              {/* COL 2 — wishes */}
              <div className="s3-col2">
                <h2 className="s3-col2-head">
                  Six things that are <em>true</em>
                </h2>
                {wishes.map((w,i) => (
                  <div key={i} className="s3-col2-wish">
                    <span className="s3-col2-icon">{w.icon}</span>
                    <span>{w.line}</span>
                  </div>
                ))}
                <div className="s3-col2-prayer">
                  <div className="s3-col2-prayer-head">
                    <div className="s3-col2-prayer-line"/>
                    <span>a small prayer</span>
                    <div className="s3-col2-prayer-line"/>
                  </div>
                  {[
                    ['🍃',"May you rise higher than you've ever dared to dream."],
                    ['🌸',"May your softness always be your strength, not your wound."],
                    ['📖',"May every next chapter be better than the last."],
                    ['🌿',"May your smile stay exactly this bright, always."],
                  ].map(([ic,tx],i) => (
                    <div key={i} className="s3-col2-pr"><span>{ic}</span><span>{tx}</span></div>
                  ))}
                </div>
              </div>

              {/* divider */}
              <div className="s3-col-div" />

              {/* COL 3 — closing + nav */}
              <div className="s3-col3">
                <div>
                  <span className="s3-c3-drop">A</span>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'.96rem',lineHeight:'1.8',color:'rgba(232,224,208,.55)',marginBottom:0}}>
                    nd so another year turns its page — quietly, beautifully, the way all the best things do.
                    Like a reader who reaches the last line of a favourite chapter and has to stop, just to let it settle.
                  </p>
                </div>
                <div style={{clear:'both',marginTop:20,marginBottom:28}}>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:'.84rem',lineHeight:'1.75',color:'rgba(232,224,208,.45)'}}>
                    May this year be a good read. May the pages be full.
                    May there always be a quiet corner, a warm cup, and the right book at the right moment.
                  </p>
                </div>
                <div className="s3-c3-hindi">
                  Aaj ka din tumhare naam —<br />
                  tumhari muskaan, tumhari kahani. 💫
                </div>
                <div className="s3-c3-ornament">🌿 🍃 🌸 🍂 🌿</div>
                <button className="s3-c3-next" onClick={() => setStep(4)}>
                  📖 Your Next Chapter →
                </button>
                <button className="s3-c3-ghost" onClick={() => setStep(1)}>
                  ↩ walk through memories again
                </button>
              </div>

            </div>{/* end cols */}

            {/* footer bar */}
            <div className="s3-foot">
              <span className="s3-foot-l">Nothing Nothing </span>
              <span className="s3-foot-center">with all the warmth of a forest morning</span>
              <span className="s3-foot-r">a letter pressed in leaves</span>
            </div>

          </div>
        </div>
      </>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 4 — DREAMS & FUTURE
  // ══════════════════════════════════════════════════════════════════════════
if (step === 4) return (
    <>
      <style>{`
        ${FONT}
        *{box-sizing:border-box;margin:0;padding:0}

        .s4-root{min-height:100dvh;background:#1a0f00;font-family:'DM Sans',sans-serif;color:#f0e6d3;position:relative;overflow-x:hidden}
        .s4-root::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
          background:radial-gradient(ellipse at 15% 10%,rgba(201,130,50,.22) 0%,transparent 55%),
                      radial-gradient(ellipse at 85% 80%,rgba(160,80,20,.18) 0%,transparent 55%),
                      radial-gradient(ellipse at 50% 50%,rgba(120,60,10,.10) 0%,transparent 70%)}
        .s4-root::after{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")}
        .s4-sp{position:fixed;border-radius:50%;pointer-events:none;z-index:1;background:rgba(220,160,60,.55);box-shadow:0 0 6px 2px rgba(220,160,60,.35);animation:s4sk linear infinite}
        @keyframes s4sk{0%{transform:translateY(0) scale(1);opacity:0}15%{opacity:1}85%{opacity:.6}100%{transform:translateY(-80px) scale(.3);opacity:0}}
        .s4-prog{position:fixed;top:0;left:0;right:0;height:2px;z-index:99;background:rgba(255,255,255,.05)}
        .s4-pf{height:100%;width:100%;background:linear-gradient(90deg,#c98232,#e8c97a,#c98232);background-size:200% 100%;animation:s4sh 3s linear infinite}
        @keyframes s4sh{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .s4-music{position:fixed;top:14px;right:14px;z-index:99;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(220,160,60,.25);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px);transition:transform .2s}
        .s4-music:active{transform:scale(.88)}

        /* ════ MOBILE (unchanged) ════ */
        .s4-sc{position:relative;z-index:2;padding:60px 20px 80px;max-width:520px;margin:0 auto}
        .s4-ey{font-family:'DM Sans',sans-serif;font-weight:300;font-size:clamp(.7rem,2.2vw,.78rem);letter-spacing:.26em;text-transform:uppercase;color:rgba(220,160,60,.6);text-align:center;margin-bottom:8px}
        .s4-ttl{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(2.6rem,10vw,4rem);line-height:1.05;text-align:center;color:#f0e6d3;margin-bottom:6px}
        .s4-ttl em{font-style:italic;color:#e8a832}
        .s4-sub{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(.95rem,3.5vw,1.1rem);color:rgba(220,160,60,.7);text-align:center;margin-bottom:36px}
        .s4-rule{display:flex;align-items:center;gap:14px;margin:28px 0}
        .s4-rl{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(220,160,60,.3),transparent)}
        .s4-cd{display:flex;align-items:flex-start;gap:16px;padding:18px 16px;margin:10px 0;border-radius:2px;border-left:2px solid rgba(220,160,60,.35);background:rgba(255,255,255,.03);transition:border-color .2s}
        .s4-cd:active{border-left-color:rgba(220,160,60,.7)}
        .s4-ci{font-size:1.4rem;flex-shrink:0;width:34px;text-align:center;margin-top:1px}
        .s4-cb{flex:1}
        .s4-ct{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1rem,3.8vw,1.15rem);color:#e8c97a;margin-bottom:4px;line-height:1.2}
        .s4-cx{font-family:'DM Sans',sans-serif;font-weight:300;font-size:clamp(.86rem,3vw,.94rem);color:rgba(240,230,211,.75);line-height:1.65}
        .s4-lt{margin:36px 0;padding:26px 22px;border:1px solid rgba(220,160,60,.18);border-radius:2px;position:relative;background:rgba(201,130,50,.05)}
        .s4-lt::before{content:'"';position:absolute;top:-18px;left:18px;font-family:'Cormorant Garamond',serif;font-size:4rem;color:rgba(220,160,60,.25);line-height:1}
        .s4-lx{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1.05rem,4vw,1.2rem);color:rgba(240,230,211,.88);line-height:1.75}
        .s4-lx span{color:#e8a832;display:block;margin-top:14px}
        .s4-vs{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1.05rem,4vw,1.2rem);color:rgba(240,230,211,.8);text-align:center;line-height:1.75;margin:32px 0}
        .s4-vs strong{font-style:normal;color:#e8a832;font-weight:600}
        .s4-bp{width:100%;padding:15px 20px;border-radius:2px;border:1px solid rgba(220,160,60,.45);background:rgba(220,160,60,.1);color:#e8c97a;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1rem,3.5vw,1.1rem);cursor:pointer;letter-spacing:.02em;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:8px}
        .s4-bp:active{background:rgba(220,160,60,.2)}
        .s4-bg{width:100%;padding:12px 20px;border-radius:2px;border:1px solid rgba(255,255,255,.08);background:transparent;color:rgba(240,230,211,.4);font-family:'DM Sans',sans-serif;font-weight:300;font-size:.86rem;cursor:pointer;letter-spacing:.04em}
        .s4-bg:active{color:rgba(240,230,211,.75)}
        .s4-bs{display:flex;flex-direction:column;gap:10px;margin-top:36px}
        .s4-ft{text-align:center;margin-top:44px;padding-top:24px;border-top:1px solid rgba(255,255,255,.05)}
        .s4-fi{font-size:.9rem;opacity:.25;letter-spacing:.3em;margin-bottom:8px}
        .s4-fx{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.82rem;color:rgba(220,160,60,.35)}

        /* desktop hidden on mobile */
        .s4-desk{display:none}

        /* ════ DESKTOP ════ */
        @media(min-width:960px){
          .s4-sc{display:none}
          .s4-desk{
            display:block;
            position:relative;z-index:2;
            padding:0;
          }

          /* ── Section 1: hero header ── */
          .s4-hero{
            padding:72px 80px 56px;
            display:flex;
            align-items:flex-end;
            justify-content:space-between;
            gap:40px;
            border-bottom:1px solid rgba(220,160,60,.1);
          }
          .s4-hero-left{}
          .s4-hero-tag{
            display:block;font-family:'DM Sans',sans-serif;font-weight:300;
            font-size:.62rem;letter-spacing:.32em;text-transform:uppercase;
            color:rgba(220,160,60,.45);margin-bottom:14px;
          }
          .s4-hero-title{
            font-family:'Cormorant Garamond',serif;font-weight:400;
            font-size:clamp(4rem,6vw,7rem);line-height:.88;
            color:#f0e6d3;
          }
          .s4-hero-title em{font-style:italic;color:#e8a832;display:block}
          .s4-hero-right{
            max-width:380px;flex-shrink:0;
            text-align:right;padding-bottom:8px;
          }
          .s4-hero-sub{
            font-family:'Cormorant Garamond',serif;font-style:italic;
            font-size:1.05rem;line-height:1.7;
            color:rgba(240,230,211,.45);margin-bottom:0;
          }
          /* thin gold rule below hero */
          .s4-hero-rule{
            width:80px;height:1px;
            background:rgba(220,160,60,.35);
            margin-left:auto;margin-top:12px;
          }

          /* ── Section 2: staggered card grid ── */
          .s4-grid{
            display:grid;
            grid-template-columns:repeat(3,1fr);
            padding:0 80px;
            border-bottom:1px solid rgba(220,160,60,.08);
          }
          .s4-gcard{
            padding:40px 32px 40px 0;
            border-right:1px solid rgba(220,160,60,.08);
            position:relative;
          }
          .s4-gcard:last-child{border-right:none;padding-right:0;padding-left:32px}
          .s4-gcard:nth-child(2){padding-left:32px}
          /* stagger: 2nd col down, 3rd col even further */
          .s4-gcard:nth-child(2){padding-top:72px}
          .s4-gcard:nth-child(3){padding-top:112px}
          .s4-gcard:nth-child(4){padding-top:56px}
          .s4-gcard:nth-child(5){padding-top:88px}
          .s4-gcard:nth-child(6){padding-top:48px}

          /* large icon */
          .s4-gcard-icon{
            font-size:2rem;margin-bottom:16px;display:block;
            opacity:.8;
          }
          /* card number */
          .s4-gcard-num{
            font-family:'Cormorant Garamond',serif;font-weight:400;
            font-size:3.5rem;line-height:1;
            color:rgba(220,160,60,.08);
            position:absolute;top:32px;right:24px;
          }
          .s4-gcard-title{
            font-family:'Cormorant Garamond',serif;font-style:italic;
            font-size:1.15rem;color:#e8c97a;margin-bottom:8px;line-height:1.2;
          }
          .s4-gcard-line{
            font-family:'DM Sans',sans-serif;font-weight:300;
            font-size:.88rem;color:rgba(240,230,211,.6);line-height:1.7;
          }

          /* ── Section 3: full-width letter + closing ── */
          .s4-letter-section{
            padding:64px 80px;
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:80px;
            align-items:center;
            border-bottom:1px solid rgba(220,160,60,.08);
          }
          .s4-letter-left{}
          .s4-letter-ornament{
            font-size:.8rem;opacity:.3;letter-spacing:.4em;margin-bottom:20px;display:block;
          }
          /* huge watermark quote mark */
          .s4-letter-box{
            position:relative;
            padding:28px 28px 28px 32px;
            border:1px solid rgba(220,160,60,.16);
            background:rgba(201,130,50,.04);
          }
          .s4-letter-box::before{
            content:'"';
            position:absolute;top:-22px;left:16px;
            font-family:'Cormorant Garamond',serif;
            font-size:5rem;color:rgba(220,160,60,.22);line-height:1;
          }
          .s4-letter-text{
            font-family:'Cormorant Garamond',serif;font-style:italic;
            font-size:1.15rem;color:rgba(240,230,211,.85);line-height:1.8;
          }
          .s4-letter-text span{color:#e8a832;display:block;margin-top:16px;font-size:1.05rem}

          .s4-letter-right{text-align:center}
          /* big hindi verse */
          .s4-verse-big{
            font-family:'Cormorant Garamond',serif;font-style:italic;
            font-size:clamp(1.1rem,1.8vw,1.5rem);
            color:rgba(240,230,211,.7);line-height:1.85;
            margin-bottom:28px;
          }
          .s4-verse-big strong{
            display:block;font-style:normal;
            color:#e8a832;font-weight:600;
            font-size:clamp(1.2rem,2vw,1.65rem);
            margin:8px 0;
          }

          /* ── Section 4: nav footer ── */
          .s4-nav-section{
            padding:48px 80px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:32px;
          }
          .s4-nav-ornament{
            font-family:'Cormorant Garamond',serif;font-style:italic;
            font-size:.82rem;color:rgba(220,160,60,.3);
            flex:1;
          }
          .s4-nav-btns{
            display:flex;gap:12px;
          }
          .s4-nav-primary{
            padding:14px 28px;border-radius:2px;
            border:1px solid rgba(220,160,60,.45);
            background:rgba(220,160,60,.1);color:#e8c97a;
            font-family:'Cormorant Garamond',serif;font-style:italic;
            font-size:1rem;cursor:pointer;letter-spacing:.02em;
            transition:background .2s;white-space:nowrap;
          }
          .s4-nav-primary:active{background:rgba(220,160,60,.2)}
          .s4-nav-ghost{
            padding:14px 24px;border-radius:2px;
            border:1px solid rgba(255,255,255,.08);background:transparent;
            color:rgba(240,230,211,.35);
            font-family:'DM Sans',sans-serif;font-weight:300;
            font-size:.86rem;cursor:pointer;letter-spacing:.04em;
            transition:color .2s;white-space:nowrap;
          }
          .s4-nav-ghost:active{color:rgba(240,230,211,.7)}
          .s4-nav-right{
            font-family:'DM Sans',sans-serif;font-weight:300;
            font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;
            color:rgba(220,160,60,.22);text-align:right;flex:1;
          }
        }

        @keyframes s4up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .s4-in{animation:s4up .6s ease both}
        .s4-d1{animation-delay:.04s}.s4-d2{animation-delay:.10s}.s4-d3{animation-delay:.16s}
        .s4-d4{animation-delay:.22s}.s4-d5{animation-delay:.28s}.s4-d6{animation-delay:.34s}
      `}</style>

      <audio ref={audioRef} loop />
      <Confetti />

      <div className="s4-root">
        {[{l:10,t:20,w:3,d:0,dur:4.5},{l:30,t:60,w:4,d:1.2,dur:5.5},{l:55,t:35,w:3,d:.6,dur:4},{l:72,t:75,w:5,d:2,dur:6},{l:88,t:20,w:3,d:.3,dur:5},{l:20,t:85,w:4,d:1.8,dur:4.8},{l:65,t:50,w:3,d:.9,dur:5.2}].map((s,i) => (
          <div key={i} className="s4-sp" style={{ left:`${s.l}%`,top:`${s.t}%`,width:s.w,height:s.w,animationDelay:`${s.d}s`,animationDuration:`${s.dur}s` }} />
        ))}
        <div className="s4-prog"><div className="s4-pf" /></div>
        {mounted && <button className="s4-music" onClick={toggleMute}>{muted?'🔇':'🔊'}</button>}

        {/* ════ MOBILE (untouched) ════ */}
        <div className="s4-sc">
          <div className="s4-in s4-d1">
            <p className="s4-ey">the next chapter</p>
            <h2 className="s4-ttl">Her <em>Dreams</em></h2>
            <p className="s4-sub">for her library, her forest, her future 🌿</p>
          </div>
          <div className="s4-rule s4-in s4-d2"><div className="s4-rl" /><span style={{fontSize:'.9rem',opacity:.4}}>✦</span><div className="s4-rl" /></div>
          <div className="s4-in s4-d3">
            {DREAM_CARDS.map((d,i) => (
              <div key={i} className="s4-cd">
                <div className="s4-ci">{d.icon}</div>
                <div className="s4-cb">
                  <div className="s4-ct">{d.title}</div>
                  <div className="s4-cx">{d.line}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="s4-rule s4-in s4-d4"><div className="s4-rl" /><span style={{fontSize:'.9rem',opacity:.4}}>✦</span><div className="s4-rl" /></div>
          <div className="s4-lt s4-in s4-d4">
            <p className="s4-lx">
              Every library has one book that changes everything.<br />
              Every forest has one path nobody else takes.<br /><br />
              You are both — the book and the path.
              <span>May this year be the one where you finally see how extraordinary your own story is.</span>
            </p>
          </div>
          <p className="s4-vs s4-in s4-d5">
            Har kitaab jo tum padhogi —<br />
            har ped ke neeche jo tum bethogi —<br />
            <strong>woh pal sirf tumhare honge.</strong><br />
            Protect them. Live them fully.
          </p>
          <div className="s4-bs s4-in s4-d6">
            <button className="s4-bp" onClick={restart}>↩ read from the beginning</button>
            <button className="s4-bg" onClick={() => setStep(3)}>← back to birthday wishes</button>
          </div>
          <div className="s4-ft s4-in s4-d6">
            <p className="s4-fi">🌿 🍃 🌸 🍂 🌿</p>
            <p className="s4-fx">written in the margins of a very good year</p>
          </div>
        </div>

        {/* ════ DESKTOP layout ════ */}
        <div className="s4-desk s4-in s4-d1">

          {/* ── 1. Hero header ── */}
          <div className="s4-hero">
            <div className="s4-hero-left">
              <span className="s4-hero-tag">the next chapter · her dreams</span>
              <div className="s4-hero-title">
                Her<br /><em>Dreams</em>
              </div>
            </div>
            <div className="s4-hero-right">
              <p className="s4-hero-sub">
                for her library, her forest,<br />
                her ice cream, her little joys,<br />
                her world — and everyone in it.
              </p>
              <div className="s4-hero-rule" />
            </div>
          </div>

          {/* ── 2. Staggered 3-col card grid ── */}
          <div className="s4-grid">
            {DREAM_CARDS.map((d,i) => (
              <div key={i} className="s4-gcard">
                <span className="s4-gcard-num">{String(i+1).padStart(2,'0')}</span>
                <span className="s4-gcard-icon">{d.icon}</span>
                <div className="s4-gcard-title">{d.title}</div>
                <div className="s4-gcard-line">{d.line}</div>
              </div>
            ))}
          </div>

          {/* ── 3. Letter + Hindi verse ── */}
          <div className="s4-letter-section">
            <div className="s4-letter-left">
              <span className="s4-letter-ornament">❧ ✦ ❧</span>
              <div className="s4-letter-box">
                <p className="s4-letter-text">
                  Every library has one book that changes everything.<br />
                  Every forest has one path nobody else takes.<br /><br />
                  You are both — the book and the path.
                  <span>May this year be the one where you finally see how extraordinary your own story is.</span>
                </p>
              </div>
            </div>
            <div className="s4-letter-right">
              <p className="s4-verse-big">
                Har kitaab jo tum padhogi —<br />
                har ped ke neeche jo tum bethogi —<br />
                <strong>woh pal sirf tumhare honge.</strong><br />
                Protect them. Live them fully.
              </p>
            </div>
          </div>

          {/* ── 4. Nav footer ── */}
          <div className="s4-nav-section">
            <div className="s4-nav-ornament">
              written in the margins of a very good year 🌿
            </div>
            <div className="s4-nav-btns">
              <button className="s4-nav-primary" onClick={restart}>↩ read from the beginning</button>
              <button className="s4-nav-ghost" onClick={() => setStep(3)}>← back to birthday wishes</button>
            </div>
            <div className="s4-nav-right">a botanical journal<br />🌿 🍃 🌸 🍂 🌿</div>
          </div>

        </div>
      </div>
    </>
  );

  return null;
} 


 

// git add .
// git commit -m "first commit"
// git branch -M main
// git push -u origin main W  



// for referesh -Remove-Item -Recurse -Force .next


// if error then 

// git push -u origin main