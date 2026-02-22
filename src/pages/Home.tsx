import React, { useEffect, useState, useRef } from "react";
import { Category, Restaurant, Food } from "../types";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { getCachedData, setCachedData } from "../utils/cacheUtils";
import toast, { Toaster } from "react-hot-toast";
import {
  Search,
  Star,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    font-family: 'Inter', sans-serif;
    background: #f5f5f5;
    color: #111;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* drag-scroll */
  .drag-scroll { overflow-x: auto; cursor: grab; user-select: none; -webkit-overflow-scrolling: touch; }
  .drag-scroll::-webkit-scrollbar { display: none; }
  .drag-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  .drag-scroll.dragging { cursor: grabbing; }

  /* banner */
  .bn-track { display: flex; transition: transform 0.72s cubic-bezier(0.77,0,0.175,1); will-change: transform; }
  .bn-slide  { min-width: 100%; position: relative; overflow: hidden; }

  /* card */
  .card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.24s ease, box-shadow 0.24s ease;
  }
  .card:hover { transform: translateY(-6px); box-shadow: 0 20px 52px rgba(0,0,0,0.10); }

  /* card image */
  .card-img { width: 100%; height: 230px; overflow: hidden; position: relative; background: #e8e8e8; }
  .card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .card:hover .card-img img { transform: scale(1.06); }

  /* category tile */
  .cat-tile {
    flex-shrink: 0;
    display: flex; flex-direction: column; align-items: center;
    cursor: pointer; transition: transform 0.2s ease; text-align: center;
  }
  .cat-tile:hover { transform: translateY(-4px); }
  .cat-tile.sel .cat-img-box { outline: 3px solid #e8b84b; outline-offset: 3px; }
  .cat-img-box {
    width: 110px; height: 90px; border-radius: 14px;
    overflow: hidden; background: #ebebeb; margin-bottom: 0.6rem;
  }
  .cat-img-box img { width: 100%; height: 100%; object-fit: cover; }

  /* buttons */
  .add-btn {
    border: 1.5px solid #e8b84b; color: #1a1a1a; background: #e8b84b;
    font-weight: 700; font-size: 0.77rem; letter-spacing: 0.06em;
    border-radius: 8px; padding: 0.44rem 1.1rem; cursor: pointer;
    transition: background 0.18s, border-color 0.18s, transform 0.14s;
    font-family: 'Inter', sans-serif; white-space: nowrap;
  }
  .add-btn:hover { background: #d4a33a; border-color: #d4a33a; transform: translateY(-1px); }

  .menu-btn {
    width: 100%; padding: 0.82rem; background: #fdf6e3; color: #1a1a1a;
    border: 1.5px solid #e8b84b; border-radius: 10px; font-family: 'Inter', sans-serif;
    font-weight: 700; font-size: 0.83rem; cursor: pointer;
    letter-spacing: 0.04em; transition: background 0.18s, border-color 0.18s;
  }
  .menu-btn:hover { background: #e8b84b; border-color: #d4a33a; }

  /* marquee */
  @keyframes mq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .mq-inner { animation: mq 34s linear infinite; display: flex; gap: 3rem; width: max-content; }
  .mq-inner:hover { animation-play-state: paused; }

  /* fade up */
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  .fu  { animation: fadeUp 0.48s ease both; }
  .fu1 { animation-delay: 0.10s; }
  .fu2 { animation-delay: 0.22s; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* layout */
  .wrap { max-width: 1380px; margin: 0 auto; padding: 0 2.5rem; }

  /* sections — alternating white / light-grey, NO black */
  .sec-a { background: #ffffff; padding: 3.5rem 0; }
  .sec-b { background: #f5f5f5; padding: 3.5rem 0; }

  /* typography */
  .eyebrow {
    font-size: 0.66rem; font-weight: 700; letter-spacing: 0.18em;
    color: #c79a30; text-transform: uppercase; margin-bottom: 0.35rem;
  }
  .title-cat  { font-size: clamp(1rem,1.8vw,1.3rem);  font-weight: 500; letter-spacing: -0.015em; color: #1a1a1a; line-height: 1.15; }
  .title-main { font-size: clamp(1.45rem,2.6vw,2rem); font-weight: 600; letter-spacing: -0.03em;  color: #1a1a1a; line-height: 1.1; }
  .count-tag  { font-size: 0.86rem; font-weight: 500; color: #c79a30; margin-left: 0.5rem; }

  .see-link {
    display: flex; align-items: center; gap: 0.25rem;
    font-size: 0.82rem; font-weight: 600; color: #c79a30;
    text-decoration: none; border-bottom: 1.5px solid #e8b84b; padding-bottom: 1px; flex-shrink: 0;
    transition: color 0.18s, border-color 0.18s;
  }
  .see-link:hover { color: #a07820; border-color: #c79a30; }

  /* filter pills */
  .pill {
    flex-shrink: 0; padding: 0.36rem 1rem; border-radius: 30px;
    border: 1.5px solid #ddd; background: #fff; color: #666;
    font-size: 0.74rem; font-weight: 600; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: all 0.16s; white-space: nowrap;
  }
  .pill.active { border-color: #e8b84b; background: #e8b84b; color: #1a1a1a; }

  /* 3-column grid */
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.6rem; }

  /* stats — light background */
  .stats-bar { background: linear-gradient(135deg,#fdf8ec 0%,#fcefc8 100%); }
  .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); }

  /* app */
  .app-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }

  /* footer — only section that's dark */
  .footer-grid { display: grid; grid-template-columns: 1.5fr repeat(4,1fr); gap: 3rem; margin-bottom: 3rem; }

  /* ── MOBILE ≤ 700px ── */
  @media (max-width: 700px) {
    .wrap { padding: 0 1rem; }
    .sec-a, .sec-b { padding: 2.2rem 0; }

    /* category circles on mobile */
    .cat-img-box { width: 68px !important; height: 68px !important; border-radius: 50% !important; }
    .cat-tile { min-width: 76px; }
    .cat-name  { font-size: 0.64rem !important; max-width: 72px; }

    /* card image smaller */
    .card-img { height: 160px !important; }

    /* 3-col grid → 2-col on mobile */
    .grid-3 { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }

    /* banner */
    .bn-emoji    { display: none !important; }
    .banner-form { max-width: 100% !important; }
    .bn-title    { font-size: clamp(1.15rem,5.5vw,1.7rem) !important; }

    /* stats 2×2 */
    .stats-grid { grid-template-columns: repeat(2,1fr) !important; }

    /* app stack */
    .app-grid   { grid-template-columns: 1fr !important; gap: 2rem !important; }
    .app-phones { display: none !important; }

    /* footer 2 col */
    .footer-grid  { grid-template-columns: 1fr 1fr !important; gap: 1.5rem !important; }
    .footer-brand { grid-column: 1/-1 !important; }
  }
`;

/* ─── Banners ─── */
const BANNERS = [
  {
    bg: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
    accent: "#e8b84b",
    tag: "⚡ Express Delivery",
    title: "Cravings delivered\nin 30 minutes",
    sub: "500+ restaurant partners across the city",
    emoji: "🍕",
  },
  {
    bg: "linear-gradient(135deg,#0d2137 0%,#1c3d55 100%)",
    accent: "#5ec8a0",
    tag: "🌿 Farm to Table",
    title: "Chef-crafted meals,\nalways fresh",
    sub: "Locally sourced ingredients prepared daily",
    emoji: "🥗",
  },
  {
    bg: "linear-gradient(135deg,#1e0a2e 0%,#2d1050 100%)",
    accent: "#c09dff",
    tag: "🎉 Weekend Deal",
    title: "Save up to 40%\non your next order",
    sub: "Exclusive savings for members every week",
    emoji: "🍣",
  },
];

/* ─── drag hook ─── */
function useDrag() {
  const ref = useRef<HTMLDivElement>(null);
  const down = useRef(false);
  const startX = useRef(0);
  const scrollL = useRef(0);
  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    down.current = true;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollL.current = ref.current.scrollLeft;
    ref.current.classList.add("dragging");
  };
  const stop = () => {
    down.current = false;
    ref.current?.classList.remove("dragging");
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!down.current || !ref.current) return;
    e.preventDefault();
    ref.current.scrollLeft =
      scrollL.current -
      (e.pageX - ref.current.offsetLeft - startX.current) * 1.4;
  };
  return {
    ref,
    handlers: { onMouseDown, onMouseLeave: stop, onMouseUp: stop, onMouseMove },
  };
}

/* ─── Section header ─── */
const SecHead = ({
  eyebrow,
  title,
  count,
  to,
  cls,
}: {
  eyebrow: string;
  title: string;
  count?: string | number;
  to: string;
  cls: string;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: "1.8rem",
      flexWrap: "wrap",
      gap: "0.6rem",
    }}
  >
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={cls}>
        {title}
        {count !== undefined && <span className="count-tag">{count}</span>}
      </h2>
    </div>
    <Link to={to} className="see-link">
      See all <ChevronRight size={14} />
    </Link>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   HOME
═══════════════════════════════════════════════════════════ */
const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selCat, setSelCat] = useState<string | "all">("all");
  const [bannerIdx, setBannerIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const catDrag = useDrag();
  const pillDrag = useDrag();

  /* styles */
  useEffect(() => {
    const el = document.createElement("style");
    el.innerHTML = STYLE;
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, []);

  /* banner timer */
  useEffect(() => {
    timerRef.current = setInterval(
      () => setBannerIdx((p) => (p + 1) % BANNERS.length),
      4500,
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /* fetch */
  useEffect(() => {
    (async () => {
      try {
        const cc = getCachedData("home_categories");
        const cr = getCachedData("home_restaurants");
        const cf = getCachedData("home_foods");
        if (cc && cr && cf) {
          setCategories(cc);
          setRestaurants(cr);
          setFoods(cf);
          setLoading(false);
          return;
        }
        const [catRes, restRes, foodRes] = await Promise.all([
          api.get("/catogary/getAllCategories"),
          api.get("/restaurant/getAllRestaurants"),
          api.get("/api/food/getAllFoods"),
        ]);
        const cD = Array.isArray(catRes.data?.categories)
          ? catRes.data.categories
          : [];
        const rD = Array.isArray(restRes.data?.restaurants)
          ? restRes.data.restaurants
          : [];
        const fD = Array.isArray(foodRes.data?.foods) ? foodRes.data.foods : [];
        setCachedData("home_categories", cD);
        setCachedData("home_restaurants", rD);
        setCachedData("home_foods", fD);
        setCategories(cD);
        setRestaurants(rD);
        setFoods(fD);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredFoods =
    selCat === "all" ? foods : foods.filter((f) => f.categoryId === selCat);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim())
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
          gap: "1rem",
        }}
      >
        <style>{STYLE}</style>
        <div
          style={{
            width: 46,
            height: 46,
            border: "3px solid #e0e0e0",
            borderTopColor: "#555",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p
          style={{
            fontSize: "0.88rem",
            color: "#aaa",
            fontFamily: "Inter,sans-serif",
          }}
        >
          Loading…
        </p>
      </div>
    );

  const bn = BANNERS[bannerIdx];

  return (
    <div style={{ background: "#f5f5f5", overflowX: "hidden" }}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            fontFamily: "Inter,sans-serif",
            fontSize: "0.84rem",
            borderRadius: 10,
            background: "#222",
            color: "#fff",
          },
        }}
      />

      {/* ══════════════════════════════
          HERO BANNER
      ══════════════════════════════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          height: "clamp(210px,34vw,370px)",
        }}
      >
        <div
          className="bn-track"
          style={{
            transform: `translateX(-${bannerIdx * 100}%)`,
            height: "100%",
          }}
        >
          {BANNERS.map((b, i) => (
            <div
              key={i}
              className="bn-slide"
              style={{
                background: b.bg,
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `radial-gradient(circle,${b.accent}18 1px,transparent 1px)`,
                  backgroundSize: "28px 28px",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: "6%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "clamp(120px,20vw,280px)",
                  height: "clamp(120px,20vw,280px)",
                  background: `${b.accent}1a`,
                  borderRadius: "50%",
                  filter: "blur(70px)",
                  pointerEvents: "none",
                }}
              />
              <div
                className="wrap"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  zIndex: 2,
                  width: "100%",
                }}
              >
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontSize: "0.66rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: b.accent,
                      background: `${b.accent}18`,
                      border: `1px solid ${b.accent}38`,
                      borderRadius: 5,
                      padding: "0.2rem 0.65rem",
                      marginBottom: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {b.tag}
                  </span>
                  <h1
                    key={`h-${bannerIdx}`}
                    className="fu bn-title"
                    style={{
                      fontWeight: 900,
                      fontSize: "clamp(1.4rem,4vw,2.8rem)",
                      color: "#fff",
                      lineHeight: 1.12,
                      whiteSpace: "pre-line",
                      marginBottom: "0.55rem",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {b.title}
                  </h1>
                  <p
                    key={`s-${bannerIdx}`}
                    className="fu fu1"
                    style={{
                      fontSize: "clamp(0.76rem,1.5vw,0.96rem)",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: "1.4rem",
                    }}
                  >
                    {b.sub}
                  </p>
                  <form
                    key={`f-${bannerIdx}`}
                    className="fu fu2 banner-form"
                    onSubmit={handleSearch}
                    style={{
                      display: "flex",
                      background: "rgba(255,255,255,0.08)",
                      border: "1.5px solid rgba(255,255,255,0.15)",
                      borderRadius: 10,
                      overflow: "hidden",
                      maxWidth: 460,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div
                      style={{
                        padding: "0 1rem",
                        display: "flex",
                        alignItems: "center",
                        borderRight: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <Search size={15} color="rgba(255,255,255,0.4)" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search dishes or restaurants…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        flex: 1,
                        background: "none",
                        border: "none",
                        outline: "none",
                        padding: "0.82rem 0.85rem",
                        color: "#fff",
                        fontSize: "0.86rem",
                        fontFamily: "Inter,sans-serif",
                      }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "0 0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        <X size={13} color="rgba(255,255,255,0.4)" />
                      </button>
                    )}
                    <button
                      type="submit"
                      style={{
                        background: b.accent,
                        border: "none",
                        padding: "0 1.3rem",
                        fontFamily: "Inter,sans-serif",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        color: "#111",
                        cursor: "pointer",
                        letterSpacing: "0.05em",
                      }}
                    >
                      GO
                    </button>
                  </form>
                </div>
                <div
                  className="bn-emoji"
                  style={{
                    fontSize: "clamp(4rem,12vw,9rem)",
                    opacity: 0.12,
                    userSelect: "none",
                    flexShrink: 0,
                    marginLeft: "2rem",
                  }}
                >
                  {b.emoji}
                </div>
              </div>
            </div>
          ))}
        </div>
        {(["left", "right"] as const).map((side, si) => (
          <button
            key={side}
            onClick={() =>
              setBannerIdx(
                (p) =>
                  (p + (si === 0 ? -1 : 1) + BANNERS.length) % BANNERS.length,
              )
            }
            style={{
              position: "absolute",
              [side]: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 8,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
              color: "#fff",
            }}
          >
            {si === 0 ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
          </button>
        ))}
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.4rem",
            zIndex: 10,
          }}
        >
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              style={{
                width: i === bannerIdx ? 24 : 7,
                height: 7,
                borderRadius: 4,
                background:
                  i === bannerIdx ? bn.accent : "rgba(255,255,255,0.25)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          TICKER — light version
      ══════════════════════════════ */}
      <div
        style={{
          background: "#e8e8e8",
          padding: "0.65rem 0",
          overflow: "hidden",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div className="mq-inner">
          {[...Array(2)].map((_, r) =>
            [
              "Free delivery on first order",
              "30-min guarantee",
              "500+ restaurants",
              "Fresh daily ingredients",
              "Live order tracking",
              "Exclusive member deals",
            ].map((t, i) => (
              <span
                key={`${r}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.68rem",
                  color: "#888",
                  letterSpacing: "0.07em",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "#aaa" }}>✦</span>
                {t}
              </span>
            )),
          )}
        </div>
      </div>

      {/* ══════════════════════════════
          CATEGORIES — drag-scroll, 12 items
          Smaller heading
      ══════════════════════════════ */}
      <div className="sec-a">
        <div className="wrap">
          <SecHead
            eyebrow="Browse"
            title="Categories"
            count={categories.length}
            to="/category/all"
            cls="title-cat"
          />
          <div className="drag-scroll" ref={catDrag.ref} {...catDrag.handlers}>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                paddingBottom: "0.5rem",
                width: "max-content",
              }}
            >
              <div
                className={`cat-tile ${selCat === "all" ? "sel" : ""}`}
                onClick={() => setSelCat("all")}
                style={{ minWidth: "110px" }}
              >
                <div
                  className="cat-img-box"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "1.9rem" }}>🍽️</span>
                </div>
                <p
                  className="cat-name"
                  style={{
                    fontSize: "0.71rem",
                    fontWeight: 600,
                    color: "#333",
                    lineHeight: 1.3,
                    maxWidth: "100px",
                    wordBreak: "break-word",
                  }}
                >
                  All
                </p>
              </div>
              {categories.slice(0, 12).map((cat) => (
                <div
                  key={cat._id}
                  className={`cat-tile ${selCat === cat._id ? "sel" : ""}`}
                  onClick={() => setSelCat(cat._id)}
                  style={{ minWidth: "110px" }}
                >
                  <div className="cat-img-box">
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.7rem",
                        }}
                      >
                        🍽️
                      </div>
                    )}
                  </div>
                  <p
                    className="cat-name"
                    style={{
                      fontSize: "0.71rem",
                      fontWeight: 600,
                      color: "#333",
                      lineHeight: 1.3,
                      maxWidth: "100px",
                      wordBreak: "break-word",
                    }}
                  >
                    {cat.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          RESTAURANTS — 3×2 grid (6 total)
          Larger heading
      ══════════════════════════════ */}
      <div className="sec-b">
        <div className="wrap">
          <SecHead
            eyebrow="Featured"
            title="Top Restaurants"
            count={`${restaurants.length} near you`}
            to="/restaurants"
            cls="title-main"
          />
          <div className="grid-3">
            {restaurants.slice(0, 6).map((r) => (
              <div
                key={r._id}
                className="card"
                onClick={() => navigate(`/restaurant/${r._id}`)}
              >
                <div className="card-img">
                  <img
                    src={r.imageUrl}
                    alt={r.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top,rgba(0,0,0,0.52) 0%,transparent 52%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      left: "1.1rem",
                      right: "1.1rem",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 800,
                        fontSize: "1.05rem",
                        color: "#fff",
                        lineHeight: 1.2,
                        marginBottom: "0.45rem",
                      }}
                    >
                      {r.title}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {[
                        {
                          icon: (
                            <Star size={10} fill="#e8b84b" color="#e8b84b" />
                          ),
                          label: String(r.rating || 4.5),
                        },
                        {
                          icon: <Clock size={10} />,
                          label: r.time || "25-30 min",
                        },
                        {
                          icon: <Truck size={10} />,
                          label: `₹${r.deliveryPrice || 25}`,
                        },
                      ].map((item, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            background: "rgba(255,255,255,0.16)",
                            backdropFilter: "blur(6px)",
                            borderRadius: 5,
                            padding: "0.18rem 0.48rem",
                            fontSize: "0.7rem",
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        >
                          {item.icon}
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      background: r.isOpen
                        ? "rgba(50,170,70,0.9)"
                        : "rgba(130,130,130,0.85)",
                      borderRadius: 5,
                      padding: "0.18rem 0.52rem",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {r.isOpen ? "OPEN" : "CLOSED"}
                  </div>
                </div>
                <div style={{ padding: "1rem 1.2rem 1.2rem" }}>
                  <button
                    className="menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/restaurant/${r._id}`);
                    }}
                  >
                    View Menu →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          FOOD — 3×2 grid (6 total)
          Larger heading
      ══════════════════════════════ */}
      <div className="sec-a">
        <div className="wrap">
          <SecHead
            eyebrow={selCat === "all" ? "Trending" : "Filtered"}
            title={selCat === "all" ? "Popular Dishes" : "Featured Items"}
            count={`${filteredFoods.length} items`}
            to="/all-foods"
            cls="title-main"
          />
          {/* filter pills drag-scroll */}
          <div
            className="drag-scroll"
            ref={pillDrag.ref}
            {...pillDrag.handlers}
            style={{ marginBottom: "1.8rem" }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.55rem",
                paddingBottom: "0.25rem",
                width: "max-content",
              }}
            >
              {[
                { id: "all", label: "All" },
                ...categories
                  .slice(0, 10)
                  .map((c) => ({ id: c._id, label: c.title })),
              ].map(({ id, label }) => (
                <button
                  key={id}
                  className={`pill ${selCat === id ? "active" : ""}`}
                  onClick={() => setSelCat(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid-3">
            {filteredFoods.slice(0, 6).map((food) => (
              <div
                key={food._id}
                className="card"
                onClick={() => navigate(`/food/${food._id}`)}
              >
                <div className="card-img">
                  <img
                    src={food.imageUrl}
                    alt={food.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/600x400?text=Food";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 52%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "0.9rem",
                      left: "0.9rem",
                      background: "rgba(255,255,255,0.92)",
                      color: "#111",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      borderRadius: 5,
                      padding: "0.18rem 0.55rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    10% OFF
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "0.9rem",
                      right: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.28rem",
                      background: "rgba(255,255,255,0.16)",
                      backdropFilter: "blur(6px)",
                      borderRadius: 5,
                      padding: "0.18rem 0.55rem",
                    }}
                  >
                    <Star size={11} fill="#e8b84b" color="#e8b84b" />
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {food.rating || 4.5}
                    </span>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0.9rem",
                      left: "1.1rem",
                      right: "1.1rem",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 800,
                        fontSize: "1.05rem",
                        color: "#fff",
                        lineHeight: 1.2,
                      }}
                    >
                      {food.title}
                    </p>
                  </div>
                </div>
                <div style={{ padding: "1rem 1.2rem 1.3rem" }}>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "#888",
                      marginBottom: "1rem",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {food.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontWeight: 900,
                          fontSize: "1.4rem",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        ₹{food.price}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "#bbb",
                          marginLeft: "0.35rem",
                        }}
                      >
                        / serving
                      </span>
                    </div>
                    <button
                      className="add-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(food);
                        toast.success(`${food.title} added to cart`);
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          STATS — light grey, no black bg
      ══════════════════════════════ */}
      <div className="stats-bar">
        <div className="wrap">
          <div className="stats-grid">
            {[
              { num: `${restaurants.length}+`, label: "Partner Restaurants" },
              { num: "30 min", label: "Average Delivery" },
              { num: "100%", label: "Food Safety" },
              { num: "4.8 ★", label: "Avg Rating" },
            ].map(({ num, label }, i) => (
              <div
                key={i}
                style={{
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  borderRight: i < 3 ? "1px solid #ddd" : "none",
                }}
              >
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: "clamp(1.5rem,2.8vw,2.2rem)",
                    color: "#111",
                    letterSpacing: "-0.03em",
                    marginBottom: "0.35rem",
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#aaa",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          APP CTA — light
      ══════════════════════════════ */}
      <div className="sec-b">
        <div className="wrap">
          <div className="app-grid">
            <div>
              <p className="eyebrow">Mobile App</p>
              <h2 className="title-main" style={{ marginBottom: "1rem" }}>
                Get the FoodVerse
                <br />
                App — Free
              </h2>
              <p
                style={{
                  color: "#888",
                  fontSize: "0.96rem",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  maxWidth: 400,
                }}
              >
                Real-time tracking, exclusive in-app deals, and reorder your
                favorites in one tap.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {[
                  { l: "App Store", s: "Download on", e: "🍎" },
                  { l: "Google Play", s: "Get it on", e: "▶" },
                ].map(({ l, s, e }) => (
                  <button
                    key={l}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.9rem",
                      background: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "0.9rem 1.5rem",
                      cursor: "pointer",
                      color: "#111",
                      fontFamily: "Inter,sans-serif",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                      transition: "box-shadow 0.2s,transform 0.2s",
                    }}
                    onMouseOver={(e2) => {
                      e2.currentTarget.style.boxShadow =
                        "0 8px 32px rgba(0,0,0,0.12)";
                      e2.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e2) => {
                      e2.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(0,0,0,0.07)";
                      e2.currentTarget.style.transform = "none";
                    }}
                  >
                    <span style={{ fontSize: "1.6rem" }}>{e}</span>
                    <div>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          color: "#aaa",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {s}
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 800 }}>
                        {l}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div
              className="app-phones"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1.5rem",
                alignItems: "flex-end",
              }}
            >
              {["🍔", "🍣", "🍰", "🍜"].map((em, i) => (
                <div
                  key={i}
                  style={{
                    width: "clamp(70px,8vw,100px)",
                    height: "clamp(130px,15vw,190px)",
                    background: "#fff",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "clamp(1.8rem,3vw,2.6rem)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    marginBottom: i % 2 === 1 ? "2rem" : 0,
                  }}
                >
                  {em}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          FOOTER — only dark section
      ══════════════════════════════ */}
      <footer style={{ background: "#0d0d0d", padding: "4rem 2.5rem 2.5rem" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto" }}>
          <div className="footer-grid">
            <div className="footer-brand">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    background: "#fff",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 900,
                      fontSize: "0.9rem",
                      color: "#111",
                    }}
                  >
                    F
                  </span>
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  FoodVerse
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.34)",
                  maxWidth: 240,
                }}
              >
                Premium food delivery, redefining how you experience cuisine.
              </p>
            </div>
            {["Company", "Support", "Legal", "Cities"].map((sec) => (
              <div key={sec}>
                <h4
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "1.1rem",
                  }}
                >
                  {sec}
                </h4>
                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.65rem",
                  }}
                >
                  {[1, 2, 3, 4].map((n) => (
                    <li key={n}>
                      <a
                        href="#"
                        style={{
                          fontSize: "0.8rem",
                          color: "rgba(255,255,255,0.3)",
                          textDecoration: "none",
                          transition: "color 0.18s",
                        }}
                        onMouseOver={(e) =>
                          ((e.target as HTMLElement).style.color = "#fff")
                        }
                        onMouseOut={(e) =>
                          ((e.target as HTMLElement).style.color =
                            "rgba(255,255,255,0.3)")
                        }
                      >
                        Link {n}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <span
              style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.28)" }}
            >
              © 2024 FoodVerse. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["📘", "🐦", "📷", "▶️"].map((ic, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    fontSize: "0.82rem",
                    transition: "background 0.18s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.14)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.06)")
                  }
                >
                  {ic}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
