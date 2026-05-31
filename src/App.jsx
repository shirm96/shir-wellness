import { useState, useEffect, useRef } from "react";

const ENCOURAGEMENTS = [
  "את חזקה ממה שאת חושבת 💪",
  "15 קילו זה לא מזל — זה את!",
  "יום אחד בכל פעם. את בדרך הנכונה.",
  "הגוף שלך עובד קשה — תני לו אהבה 🌿",
  "אפילו ארוחה אחת טובה היא ניצחון",
  "את לא צריכה להיות מושלמת, רק עקבית",
  "89 היום, 79 מחר 🎯",
];

const EATING_OUT_TIPS = [
  "אכלי משהו קטן לפני — ביצה, לבנה, חופן אגוזים",
  "התחילי מסלט או ירקות לפני שנוגעים בשאר",
  "שימי לעצמך צלחת — אל תאכלי מהאמצע",
  "מים לפני האוכל — תמיד",
  "מנה אחת — לא הכל",
  "את יכולה ליהנות ועדיין לשמור 🤍",
];

// ===== ארוחות מותאמות לשיר =====
const MEALS = {
  breakfast: {
    label: "☀️ בוקר",
    options: [
      { name: "חביתה + ירקות + גבינה לבנה", protein: true, veggies: true, carb: false, tags: ["🥚","🥦","🧀"], prep: "2 ביצים → מחבת עם שמן קוקוס → מוסיפים ירק קצוץ + גבינה לבנה" },
      { name: "טונה + גבינה לבנה + ירק", protein: true, veggies: true, carb: false, tags: ["🐟","🧀","🥦"], prep: "פותחים קופסת טונה → מערבבים עם גבינה לבנה → מגישים עם ירקות טריים" },
      { name: "סלט ירקות + חביתה", protein: true, veggies: true, carb: false, tags: ["🥗","🥚"], prep: "קוצצים עגבנייה מלפפון פלפל → מוסיפים חביתה מקושקשת מעל" },
      { name: "סלט ירקות + טונה", protein: true, veggies: true, carb: false, tags: ["🥗","🐟"], prep: "סלט ירקות טריים + קופסת טונה + טחינה/לימון" },
      { name: "שייק ירקות אמא חטובה", protein: true, veggies: true, carb: false, tags: ["🥤","🥦"], prep: "תרד/כרוב + מלפפון + תפוח + מיץ לימון + מים → בנינג'ה" },
      { name: "יוגורט יווני + פירות", protein: true, veggies: false, carb: false, tags: ["🥛","🍓"], prep: "יוגורט יווני + פירות עונה + אגוזים" },
      { name: "פיתה כוסמין + ביצה + ירק", protein: true, veggies: true, carb: true, tags: ["🫓","🥚","🥦"], prep: "פיתה כוסמין → ממלאים בחביתה + ירקות + לבנה/אבוקדו" },
      { name: "ביצים עם פטריות ותרד", protein: true, veggies: true, carb: false, tags: ["🥚","🍄","🌿"], prep: "מוקפצים פטריות פרוסות + תרד במחבת → מוסיפים 2 ביצים ומגישים" },
      { name: "לבנה + אבוקדו + ירק", protein: true, veggies: true, carb: false, tags: ["🧀","🥑","🥦"], prep: "לבנה בקערה + חצי אבוקדו פרוס + ירקות טריים + שמן זית + לימון" },
    ]
  },
  lunch: {
    label: "🌤️ צהריים",
    options: [
      { name: "אורז פרא + עוף + ירק", protein: true, veggies: true, carb: true, tags: ["🌾","🍗","🥦"], prep: "נינג'ה קומבי: אורז פרא + 1000מ\"ל מים קומה 1 | חזה עוף מתובל קומה 2 | ברוקולי/שעועית ירוקה לצד" },
      { name: "קינואה + סלמון + ירק", protein: true, veggies: true, carb: true, tags: ["🌾","🐟","🥦"], prep: "נינג'ה: קינואה + 830מ\"ל מים קומה 1 | פילה סלמון קומה 2 | מיץ לימון + שום" },
      { name: "כוסמת + קציצות + ירק", protein: true, veggies: true, carb: true, tags: ["🌾","🍖","🥦"], prep: "כוסמת מבושלת + קציצות אפויות בנינג'ה + כרובית/קישוא קלוי" },
      { name: "עדשים + ירקות", protein: true, veggies: true, carb: true, tags: ["🫘","🥦"], prep: "עדשים שחורות/ירוקות מבושלות + ירקות מוקפצים + טחינה" },
      { name: "חזה עוף + שעועית ירוקה + קינואה", protein: true, veggies: true, carb: true, tags: ["🍗","🫘","🌾"], prep: "נינג'ה: קינואה קומה 1 | עוף מתובל קומה 2 | שעועית ירוקה בצד" },
      { name: "סלמון + כרובית + כוסמת", protein: true, veggies: true, carb: true, tags: ["🐟","🥦","🌾"], prep: "נינג'ה: כוסמת קומה 1 | סלמון + כרובית קומה 2 | לימון + שמן זית" },
      { name: "קציצות בקר + אורז פרא + קישואים", protein: true, veggies: true, carb: true, tags: ["🍖","🌾","🥗"], prep: "נינג'ה: אורז פרא קומה 1 | קציצות בקר קומה 2 | קישואים פרוסים בצד" },
      { name: "עוף בתיבול שווארמה + כוסמת + כרוב", protein: true, veggies: true, carb: true, tags: ["🍗","🌾","🥬"], prep: "עוף חתוך לרצועות + תיבול שווארמה → נינג'ה קומה 2 | כוסמת קומה 1 | כרוב מוקפץ בצד" },
      { name: "סלמון אפוי + ברוקולי + קינואה", protein: true, veggies: true, carb: true, tags: ["🐟","🥦","🌾"], prep: "נינג'ה: קינואה קומה 1 | סלמון + ברוקולי קומה 2 | שמן זית + שום + לימון" },
    ]
  },
  dinner: {
    label: "🌙 ערב",
    options: [
      { name: "חביתה + סלט + גבינה בולגרית", protein: true, veggies: true, carb: false, tags: ["🥚","🥗","🧀"], prep: "חביתה מקושקשת + סלט ירקות טרי + גבינה בולגרית מפוררת" },
      { name: "טונה + סלט + אבוקדו", protein: true, veggies: true, carb: false, tags: ["🐟","🥗","🥑"], prep: "סלט ירקות + טונה + חצי אבוקדו פרוס + טחינה + לימון" },
      { name: "לבנה + ירקות + פיתה כוסמין", protein: true, veggies: true, carb: true, tags: ["🧀","🥦","🫓"], prep: "פיתה כוסמין + לבנה + ירקות טריים + זיתים + שמן זית" },
      { name: "סלט חצילים + ביצה", protein: true, veggies: true, carb: false, tags: ["🍆","🥚"], prep: "חציל קלוי → מגרדים לסלט עם שום + לימון + טחינה | לצד ביצה קשה" },
      { name: "יוגורט + ירקות + טחינה", protein: true, veggies: true, carb: false, tags: ["🥛","🥗","🫙"], prep: "יוגורט יווני + מלפפון + עגבנייה + כפית טחינה + שמן זית" },
      { name: "גבינה לבנה + ירקות + אבוקדו", protein: true, veggies: true, carb: false, tags: ["🧀","🥦","🥑"], prep: "גבינה לבנה + ירקות קצוצים + אבוקדו + שמן זית + לימון" },
      { name: "ביצים מקושקשות + פטריות + גבינה", protein: true, veggies: true, carb: false, tags: ["🥚","🍄","🧀"], prep: "מטגנים פטריות קצוצות → מוסיפים 2 ביצים → מפזרים גבינה בולגרית מעל" },
      { name: "סלט ניסואז עם טונה + ביצה", protein: true, veggies: true, carb: false, tags: ["🐟","🥚","🥗"], prep: "עלי חסה + עגבנייה + מלפפון + ביצה קשה + טונה + זיתים + רוטב לימון" },
      { name: "עוף קר + סלט ירוק + טחינה", protein: true, veggies: true, carb: false, tags: ["🍗","🥗","🫙"], prep: "שאריות עוף מהמקרר → חותכים לפרוסות | סלט ירקות עם טחינה + לימון" },
    ]
  }
};

const RAND = arr => arr[Math.floor(Math.random() * arr.length)];

// localStorage helpers
const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

// Reset daily data if it's a new day
const todayStr = () => new Date().toISOString().slice(0, 10);
const checkAndResetDaily = () => {
  const lastDay = localStorage.getItem("shir_last_day");
  const today = todayStr();
  if (lastDay !== today) {
    localStorage.removeItem("shir_water");
    localStorage.removeItem("shir_checkin");
    localStorage.removeItem("shir_meals");
    localStorage.setItem("shir_last_day", today);
  }
};
checkAndResetDaily();

export default function App() {
  const [screen, setScreen] = useState("home");
  const [water, setWater] = useState(() => load("shir_water", 0));
  const [checkin, setCheckin] = useState(() => load("shir_checkin", { protein: null, veggies: null }));
  const [meals, setMeals] = useState(() => load("shir_meals", { breakfast: null, lunch: null, dinner: null }));
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [prepVisible, setPrepVisible] = useState(null);
  const [weightLog, setWeightLog] = useState(() => load("shir_weight", [
    { date: "01/05", weight: 90 }, { date: "08/05", weight: 89.5 }, { date: "15/05", weight: 89 },
  ]));
  const [newWeight, setNewWeight] = useState("");
  const [tip, setTip] = useState(null);
  const [chatMessages, setChatMessages] = useState(() => load("shir_chat", [
    { role: "assistant", text: "היי שיר! שואלי כל מה שצריכה 😊" }
  ]));
  const [chatInput, setChatInput] = useState("");

  // Save to localStorage on every change
  useEffect(() => { save("shir_water", water); }, [water]);
  useEffect(() => { save("shir_checkin", checkin); }, [checkin]);
  useEffect(() => { save("shir_meals", meals); }, [meals]);
  useEffect(() => { save("shir_weight", weightLog); }, [weightLog]);
  useEffect(() => { save("shir_chat", chatMessages.slice(-30)); }, [chatMessages]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [encouragement] = useState(() => RAND(ENCOURAGEMENTS));

  const proteinMeals = Object.values(meals).filter(m => m?.protein).length +
    ([checkin.protein === true ? 1 : 0].reduce((a, b) => a + b, 0));
  const veggiesMeals = Object.values(meals).filter(m => m?.veggies).length +
    ([checkin.veggies === true ? 1 : 0].reduce((a, b) => a + b, 0));

  const score = Math.round(((water / 10) * 34) + ((Math.min(proteinMeals, 3) / 3) * 33) + ((Math.min(veggiesMeals, 3) / 3) * 33));

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const updated = [...chatMessages, { role: "user", text: userMsg }];
    setChatMessages(updated);
    setChatLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: `את מאמנת תזונה ישראלית תומכת ומעשית. המשתמשת היא שיר: ירדה 15 ק"ג (מ-104 ל-89 ק"ג, גובה 1.63). מתאמנת 2x בשבוע. עקרונות: חלבון בכל ארוחה, חצי צלחת ירקות, 10 כוסות מים, פחמימות מלאות. אוהבת: עוף, סלמון, ביצים, בקר, גבינה לבנה, בולגרית, לבנה, טחינה, אבוקדו, קינואה, אורז פרא, כוסמת, עדשים. לא אוהבת: בטטה. יש לה נינג'ה קומבי. אתגר: אכילה בחוץ. ענה עברית, קצר, חם, מעשי.`,
          messages: updated.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }))
        })
      });
      const data = await res.json();
      setChatMessages(p => [...p, { role: "assistant", text: data.content?.[0]?.text || "נסי שוב 🙏" }]);
    } catch { setChatMessages(p => [...p, { role: "assistant", text: "שגיאת חיבור 🙏" }]); }
    setChatLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const chartH = 110, chartW = 290;
  const minW = Math.min(...weightLog.map(w => w.weight)) - 1;
  const maxW = Math.max(...weightLog.map(w => w.weight)) + 1;
  const pts = weightLog.map((w, i) => ({
    x: (i / (weightLog.length - 1)) * (chartW - 40) + 20,
    y: chartH - ((w.weight - minW) / (maxW - minW)) * (chartH - 20) - 10, ...w
  }));

  const C = {
    page: { minHeight: "100vh", background: "linear-gradient(160deg,#0f0a1e,#1a1035 50%,#0a1a0f)", fontFamily: "'Segoe UI',Tahoma,sans-serif", color: "#f0e8ff", display: "flex", flexDirection: "column", maxWidth: 420, margin: "0 auto" },
    hdr: { padding: "18px 20px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" },
    badge: { background: "rgba(167,139,250,.15)", borderRadius: 12, padding: "6px 12px", fontSize: 13, color: "#c4b5fd", border: "1px solid rgba(167,139,250,.3)" },
    body: { flex: 1, padding: "14px 20px 88px", overflowY: "auto" },
    card: (extra={}) => ({ background: "rgba(255,255,255,.04)", borderRadius: 18, padding: 16, marginBottom: 12, border: "1px solid rgba(255,255,255,.08)", ...extra }),
    btn: (extra={}) => ({ padding: 14, borderRadius: 14, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", fontSize: 15, fontWeight: 700, ...extra }),
    bar: (pct, good) => ({ height: 6, background: good ? "linear-gradient(90deg,#34d399,#059669)" : "linear-gradient(90deg,#7c3aed,#4f46e5)", borderRadius: 4, width: `${Math.min(100, pct * 100)}%`, transition: "width .4s" }),
    nav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "rgba(8,4,18,.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(167,139,250,.12)", display: "flex", justifyContent: "space-around", padding: "10px 0 20px" },
  };

  const navItems = [
    { id: "home", icon: "🏠", label: "בית" },
    { id: "diary", icon: "📝", label: "יומן" },
    { id: "eating-out", icon: "🍽️", label: "בחוץ" },
    { id: "weight", icon: "📊", label: "משקל" },
    { id: "coach", icon: "💬", label: "מאמנת" },
  ];

  return (
    <div dir="rtl" style={C.page}>

      {/* HEADER */}
      <div style={C.hdr}>
        <div>
          <div style={{ fontSize: 11, color: "#a78bfa", letterSpacing: 2, marginBottom: 2 }}>שלום שיר 👋</div>
          <div style={{ fontSize: 21, fontWeight: 700 }}>
            {{ home:"היום שלי", diary:"יומן ארוחות", "eating-out":"יוצאת לאכול?", weight:"מעקב משקל", coach:"המאמנת" }[screen]}
          </div>
        </div>
        <div style={C.badge}>89 ק"ג</div>
      </div>

      <div style={C.body}>

        {/* ===== HOME ===== */}
        {screen === "home" && <>
          {/* encouragement */}
          <div style={C.card({ marginTop: 14, background: "linear-gradient(135deg,rgba(167,139,250,.14),rgba(52,211,153,.09))", border: "1px solid rgba(167,139,250,.2)", fontSize: 14, lineHeight: 1.6, color: "#e9d5ff" })}>
            {encouragement}
          </div>

          {/* Score ring */}
          <div style={C.card({ textAlign: "center", padding: 20 })}>
            <svg width={100} height={100} viewBox="0 0 100 100" style={{ display: "block", margin: "0 auto 8px" }}>
              <circle cx={50} cy={50} r={42} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={10} />
              <circle cx={50} cy={50} r={42} fill="none" stroke="url(#sg)" strokeWidth={10}
                strokeDasharray={`${2 * Math.PI * 42 * score / 100} ${2 * Math.PI * 42}`}
                strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: "stroke-dasharray .5s" }} />
              <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#34d399" /></linearGradient></defs>
              <text x={50} y={46} textAnchor="middle" fill="#fff" fontSize={20} fontWeight={700}>{score}%</text>
              <text x={50} y={62} textAnchor="middle" fill="#a78bfa" fontSize={10}>היום</text>
            </svg>
            <div style={{ fontSize: 13, color: "#c4b5fd" }}>{score >= 80 ? "מעולה! 🌟" : score >= 50 ? "טוב! המשיכי 💪" : "בואי נשפר 🌱"}</div>
          </div>

          {/* Water */}
          <div style={C.card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>💧 מים</span>
              <span style={{ fontSize: 13, color: water >= 10 ? "#34d399" : "#a78bfa" }}>{water}/10 כוסות</span>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} onClick={() => setWater(i < water ? i : i + 1)} style={{ width: 26, height: 26, borderRadius: 8, background: i < water ? "linear-gradient(135deg,#3b82f6,#06b6d4)" : "rgba(255,255,255,.07)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, border: "1px solid rgba(255,255,255,.1)", transition: "all .2s" }}>
                  {i < water ? "💧" : ""}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setWater(Math.max(0, water - 1))} style={{ flex: 1, padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "#c4b5fd", cursor: "pointer", fontSize: 18 }}>−</button>
              <button onClick={() => setWater(Math.min(10, water + 1))} style={{ flex: 2, padding: 10, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#3b82f6,#06b6d4)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>+ שתיתי כוס</button>
            </div>
          </div>

          {/* Checkin: protein + veggies */}
          <div style={C.card()}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#c4b5fd", marginBottom: 12 }}>צ׳ק-אין עקרונות</div>
            {[
              { key: "protein", emoji: "🥚", q: "היה חלבון בכל ארוחה?" },
              { key: "veggies", emoji: "🥦", q: "חצי צלחת ירקות בכל ארוחה?" },
            ].map(item => (
              <div key={item.key} style={{ marginBottom: 12, borderRadius: 14, padding: "12px 14px", background: "rgba(255,255,255,.03)", border: `1px solid ${checkin[item.key] === true ? "rgba(52,211,153,.4)" : checkin[item.key] === false ? "rgba(248,113,113,.3)" : "rgba(255,255,255,.06)"}`, transition: "border .3s" }}>
                <div style={{ fontSize: 14, marginBottom: 10 }}>{item.emoji} {item.q}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[true, false].map(val => (
                    <button key={String(val)} onClick={() => setCheckin(p => ({ ...p, [item.key]: val }))} style={{ flex: 1, padding: 9, borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: checkin[item.key] === val ? (val ? "linear-gradient(135deg,#34d399,#059669)" : "linear-gradient(135deg,#f87171,#dc2626)") : "rgba(255,255,255,.07)", color: checkin[item.key] === val ? "#fff" : "#a78bfa", transition: "all .2s" }}>
                      {val ? "כן ✓" : "לא"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Progress bars */}
          <div style={C.card()}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#c4b5fd", marginBottom: 12 }}>עקרונות אמא חטובה</div>
            {[
              { label: "💧 מים", val: water, total: 10, unit: "כוסות" },
              { label: "🥚 חלבון", val: Math.min(proteinMeals, 3), total: 3, unit: "ארוחות" },
              { label: "🥦 ירקות", val: Math.min(veggiesMeals, 3), total: 3, unit: "ארוחות" },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span>{item.label}</span>
                  <span style={{ color: item.val >= item.total ? "#34d399" : "#a78bfa" }}>{item.val}/{item.total} {item.unit}</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,.07)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={C.bar(item.val / item.total, item.val >= item.total)} />
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* ===== DIARY ===== */}
        {screen === "diary" && <>
          <div style={{ fontSize: 13, color: "#a78bfa", marginTop: 8, marginBottom: 14 }}>
            לחצי על ארוחה לבחור — לחצי על ✨ לראות הכנה
          </div>
          {(["breakfast","lunch","dinner"]).map(type => {
            const M = MEALS[type];
            const logged = meals[type];
            const isOpen = expandedMeal === type;
            return (
              <div key={type} style={C.card({ marginBottom: 14 })}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: isOpen || logged ? 10 : 0 }} onClick={() => setExpandedMeal(isOpen ? null : type)}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{M.label}</div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {logged && <>{logged.protein && <span>🥚</span>}{logged.veggies && <span>🥦</span>}</>}
                    <span style={{ fontSize: 18, color: "#a78bfa" }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {logged && !isOpen && (
                  <div style={{ background: "rgba(52,211,153,.1)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(52,211,153,.22)", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>✓ {logged.name}</span>
                    <button onClick={e => { e.stopPropagation(); setMeals(p => ({ ...p, [type]: null })); setExpandedMeal(type); }} style={{ background: "transparent", border: "none", color: "#6b7280", fontSize: 11, cursor: "pointer" }}>שנה</button>
                  </div>
                )}

                {isOpen && (
                  <div>
                    {logged && (
                      <div style={{ background: "rgba(52,211,153,.1)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(52,211,153,.22)", fontSize: 13, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
                        <span>✓ {logged.name}</span>
                        <button onClick={() => setMeals(p => ({ ...p, [type]: null }))} style={{ background: "transparent", border: "none", color: "#f87171", fontSize: 11, cursor: "pointer" }}>✕ בטל</button>
                      </div>
                    )}
                    {M.options.map((opt, i) => (
                      <div key={i} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
                          <button onClick={() => { setMeals(p => ({ ...p, [type]: opt })); setExpandedMeal(null); }} style={{ flex: 1, padding: "11px 14px", borderRadius: 12, border: `1px solid ${meals[type]?.name === opt.name ? "rgba(52,211,153,.5)" : "rgba(255,255,255,.1)"}`, background: meals[type]?.name === opt.name ? "rgba(52,211,153,.1)" : "rgba(255,255,255,.04)", color: "#f0e8ff", cursor: "pointer", fontSize: 13, textAlign: "right", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>{opt.name}</span>
                            <span style={{ display: "flex", gap: 3, fontSize: 14 }}>{opt.tags.map((t,j) => <span key={j}>{t}</span>)}</span>
                          </button>
                          <button onClick={() => setPrepVisible(prepVisible === `${type}-${i}` ? null : `${type}-${i}`)} style={{ width: 38, borderRadius: 12, border: "1px solid rgba(167,139,250,.3)", background: prepVisible === `${type}-${i}` ? "rgba(167,139,250,.2)" : "rgba(255,255,255,.04)", color: "#a78bfa", cursor: "pointer", fontSize: 16, flexShrink: 0 }}>
                            ✨
                          </button>
                        </div>
                        {prepVisible === `${type}-${i}` && (
                          <div style={{ background: "rgba(167,139,250,.08)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(167,139,250,.2)", fontSize: 12, color: "#c4b5fd", lineHeight: 1.6, marginTop: 5 }}>
                            👩‍🍳 {opt.prep}
                          </div>
                        )}
                      </div>
                    ))}
                    <button onClick={() => { setMeals(p => ({ ...p, [type]: { name: "ארוחה בחוץ 🍽️", protein: false, veggies: false } })); setExpandedMeal(null); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1px dashed rgba(167,139,250,.35)", background: "transparent", color: "#a78bfa", cursor: "pointer", fontSize: 13, marginTop: 4 }}>
                      + ארוחה בחוץ / אחר
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </>}

        {/* ===== EATING OUT ===== */}
        {screen === "eating-out" && <>
          <div style={{ fontSize: 13, color: "#a78bfa", marginTop: 8, marginBottom: 14 }}>קבלי עוגן לפני שיוצאים</div>
          <button onClick={() => setTip(RAND(EATING_OUT_TIPS))} style={{ ...C.btn({ width: "100%", marginBottom: 14 }) }}>💡 תני לי טיפ לעכשיו</button>
          {tip && <div style={C.card({ background: "linear-gradient(135deg,rgba(52,211,153,.1),rgba(167,139,250,.08))", border: "1px solid rgba(52,211,153,.28)", fontSize: 16, lineHeight: 1.6, textAlign: "center", color: "#ecfdf5", marginBottom: 14 })}>{tip}</div>}
          {["🥗 סלט/ירקות קודם","💧 מים לפני האוכל","🍽️ צלחת לעצמי — לא מהאמצע","🐌 לאכול לאט","✋ מותר ליהנות — לא להתמכר"].map((t,i) => (
            <div key={i} style={C.card({ padding: "13px 16px", fontSize: 14, marginBottom: 8 })}>{t}</div>
          ))}
        </>}

        {/* ===== WEIGHT ===== */}
        {screen === "weight" && <>
          <div style={C.card({ padding: 20, marginTop: 8 })}>
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 20}`} style={{ overflow: "visible" }}>
              <defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#34d399" /></linearGradient></defs>
              <path d={pts.map((p,i) => `${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ")} fill="none" stroke="url(#lg)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => <g key={i}><circle cx={p.x} cy={p.y} r={5} fill="#7c3aed" stroke="#fff" strokeWidth={2} /><text x={p.x} y={p.y - 12} textAnchor="middle" fill="#c4b5fd" fontSize={10}>{p.weight}</text><text x={p.x} y={chartH + 16} textAnchor="middle" fill="#6b7280" fontSize={9}>{p.date}</text></g>)}
            </svg>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <input type="number" value={newWeight} onChange={e => setNewWeight(e.target.value)} placeholder="משקל היום..." style={{ flex: 1, padding: "13px 16px", borderRadius: 14, border: "1px solid rgba(167,139,250,.3)", background: "rgba(255,255,255,.06)", color: "#f0e8ff", fontSize: 16, outline: "none" }} />
            <button onClick={() => { if (!newWeight) return; const d = new Date(); setWeightLog(p => [...p, { date: `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`, weight: parseFloat(newWeight) }]); setNewWeight(""); }} style={C.btn({ padding: "13px 18px", width: "auto" })}>+</button>
          </div>
          <div style={C.card({ textAlign: "center" })}>
            <div style={{ fontSize: 12, color: "#a78bfa", marginBottom: 4 }}>המטרה</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>79 ק"ג</div>
            <div style={{ fontSize: 13, color: "#c4b5fd", marginTop: 4 }}>עוד 10 ק"ג 🎯</div>
          </div>
        </>}

        {/* ===== COACH ===== */}
        {screen === "coach" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 178px)", marginTop: 8 }}>
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
              {chatMessages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end", marginBottom: 10 }}>
                  <div style={{ maxWidth: "83%", padding: "11px 15px", borderRadius: m.role === "user" ? "18px 18px 18px 4px" : "18px 18px 4px 18px", background: m.role === "user" ? "rgba(255,255,255,.07)" : "linear-gradient(135deg,rgba(124,58,237,.32),rgba(79,70,229,.22))", border: m.role === "user" ? "1px solid rgba(255,255,255,.1)" : "1px solid rgba(167,139,250,.22)", fontSize: 14, lineHeight: 1.6, color: "#f0e8ff" }}>{m.text}</div>
                </div>
              ))}
              {chatLoading && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}><div style={{ padding: "11px 18px", borderRadius: "18px 18px 4px 18px", background: "linear-gradient(135deg,rgba(124,58,237,.32),rgba(79,70,229,.22))", border: "1px solid rgba(167,139,250,.22)", fontSize: 18, letterSpacing: 4 }}>···</div></div>}
              <div ref={chatEndRef} />
            </div>
            <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,.07)" }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="שאלי אותי משהו..." style={{ flex: 1, padding: "13px 15px", borderRadius: 14, border: "1px solid rgba(167,139,250,.3)", background: "rgba(255,255,255,.06)", color: "#f0e8ff", fontSize: 15, outline: "none" }} />
              <button onClick={sendChat} style={C.btn({ padding: "13px 16px", width: "auto", fontSize: 18 })}>➤</button>
            </div>
          </div>
        )}
      </div>

      {/* NAV */}
      <div style={C.nav}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setScreen(item.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "transparent", border: "none", cursor: "pointer", padding: "6px 10px" }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ fontSize: 11, color: screen === item.id ? "#a78bfa" : "#4b5563", fontWeight: screen === item.id ? 700 : 400 }}>{item.label}</span>
          </button>
        ))}
      </div>

      <style>{`* { -webkit-tap-highlight-color: transparent; } input::placeholder { color: #6b7280; } ::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
