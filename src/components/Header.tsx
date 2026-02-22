import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

/* ─── inline styles ─── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .hdr-root {
    position: sticky; top: 0; z-index: 100;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-bottom: 1px solid rgba(232,184,75,0.15);
    box-shadow: 0 2px 24px rgba(0,0,0,0.35);
    font-family: 'Inter', sans-serif;
  }

  .hdr-inner {
    max-width: 1380px; margin: 0 auto;
    padding: 0 2.5rem;
    display: flex; align-items: center;
    height: 64px; gap: 2.5rem;
  }

  /* ── Logo ── */
  .hdr-logo {
    display: flex; align-items: center; gap: 0.5rem;
    text-decoration: none; flex-shrink: 0;
    font-size: 1.18rem; font-weight: 800; letter-spacing: -0.02em;
    color: #e8b84b;
    transition: opacity 0.18s;
  }
  .hdr-logo:hover { opacity: 0.85; }
  .hdr-logo-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: linear-gradient(135deg,#e8b84b,#d4a33a);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.05rem; flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(232,184,75,0.35);
  }

  /* ── Nav links ── */
  .hdr-nav {
    display: flex; align-items: center; gap: 0.25rem;
    flex: 1;
  }
  .hdr-nav-link {
    position: relative;
    padding: 0.38rem 0.85rem; border-radius: 8px;
    font-size: 0.82rem; font-weight: 500; letter-spacing: 0.01em;
    color: rgba(255,255,255,0.65); text-decoration: none;
    transition: color 0.18s, background 0.18s;
    white-space: nowrap;
  }
  .hdr-nav-link::after {
    content: ''; position: absolute;
    bottom: -1px; left: 50%; right: 50%;
    height: 2px; border-radius: 2px;
    background: #e8b84b;
    transition: left 0.22s ease, right 0.22s ease;
  }
  .hdr-nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
  .hdr-nav-link:hover::after { left: 0.85rem; right: 0.85rem; }
  .hdr-nav-link.active { color: #e8b84b; }
  .hdr-nav-link.active::after { left: 0.85rem; right: 0.85rem; }

  /* ── Right actions ── */
  .hdr-actions {
    display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;
  }
  .hdr-icon-btn {
    position: relative;
    width: 40px; height: 40px; border-radius: 10px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.10);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.18s, border-color 0.18s;
    color: rgba(255,255,255,0.8); text-decoration: none;
  }
  .hdr-icon-btn:hover {
    background: rgba(232,184,75,0.14);
    border-color: rgba(232,184,75,0.35);
    color: #e8b84b;
  }

  /* cart badge */
  .hdr-badge {
    position: absolute; top: -5px; right: -5px;
    min-width: 18px; height: 18px; padding: 0 4px;
    background: #e8b84b; color: #1a1a2e;
    border-radius: 99px; border: 2px solid #16213e;
    font-size: 0.62rem; font-weight: 800; line-height: 1;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 8px rgba(232,184,75,0.6);
  }

  /* ── Login button ── */
  .hdr-login {
    padding: 0.42rem 1.1rem; border-radius: 9px;
    background: #e8b84b; color: #1a1a2e;
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.04em;
    text-decoration: none; border: none; cursor: pointer;
    transition: background 0.18s, transform 0.14s;
    font-family: 'Inter', sans-serif;
  }
  .hdr-login:hover { background: #d4a33a; transform: translateY(-1px); }

  /* ── User dropdown ── */
  .hdr-user-wrap { position: relative; }
  .hdr-user-btn {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.36rem 0.9rem 0.36rem 0.5rem; border-radius: 10px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.10);
    cursor: pointer; transition: background 0.18s, border-color 0.18s;
    font-family: 'Inter', sans-serif;
  }
  .hdr-user-btn:hover {
    background: rgba(232,184,75,0.12);
    border-color: rgba(232,184,75,0.30);
  }
  .hdr-avatar {
    width: 28px; height: 28px; border-radius: 8px;
    background: linear-gradient(135deg,#e8b84b,#d4a33a);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.78rem; font-weight: 800; color: #1a1a2e;
    flex-shrink: 0;
  }
  .hdr-user-name {
    font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.85);
    max-width: 96px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .hdr-chevron { color: rgba(255,255,255,0.4); transition: transform 0.22s; }
  .hdr-chevron.open { transform: rotate(180deg); }

  .hdr-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    min-width: 180px;
    background: #1e2a42;
    border: 1px solid rgba(232,184,75,0.2);
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.45);
    padding: 0.4rem;
    animation: hdropIn 0.18s ease both;
  }
  @keyframes hdropIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  .hdr-drop-item {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.6rem 0.85rem; border-radius: 8px;
    font-size: 0.8rem; font-weight: 500; color: rgba(255,255,255,0.7);
    text-decoration: none; cursor: pointer;
    transition: background 0.15s, color 0.15s;
    border: none; background: none; width: 100%;
    font-family: 'Inter', sans-serif; text-align: left;
  }
  .hdr-drop-item:hover { background: rgba(232,184,75,0.12); color: #e8b84b; }
  .hdr-drop-item.danger:hover { background: rgba(239,68,68,0.12); color: #ef4444; }
  .hdr-drop-divider {
    height: 1px; background: rgba(255,255,255,0.07);
    margin: 0.3rem 0;
  }

  /* ── Mobile hamburger ── */
  .hdr-burger {
    display: none;
    width: 40px; height: 40px; border-radius: 10px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.10);
    align-items: center; justify-content: center;
    cursor: pointer; color: rgba(255,255,255,0.8);
    transition: background 0.18s;
    flex-shrink: 0;
  }
  .hdr-burger:hover { background: rgba(232,184,75,0.14); color: #e8b84b; }

  /* ── Mobile drawer ── */
  .hdr-drawer-overlay {
    position: fixed; inset: 0; z-index: 98;
    background: rgba(0,0,0,0.55); backdrop-filter: blur(3px);
    animation: overlayIn 0.22s ease;
  }
  @keyframes overlayIn { from { opacity:0; } to { opacity:1; } }

  .hdr-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 99;
    width: min(320px, 88vw);
    background: linear-gradient(160deg,#1a1a2e 0%,#16213e 100%);
    border-left: 1px solid rgba(232,184,75,0.15);
    box-shadow: -12px 0 40px rgba(0,0,0,0.5);
    display: flex; flex-direction: column;
    animation: drawerIn 0.26s cubic-bezier(0.22,1,0.36,1);
    font-family: 'Inter', sans-serif;
  }
  @keyframes drawerIn { from { transform:translateX(100%); opacity:0.5; } to { transform:translateX(0); opacity:1; } }

  .hdr-drawer-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .hdr-drawer-nav { display: flex; flex-direction: column; padding: 0.8rem 0.75rem; flex: 1; overflow-y: auto; }
  .hdr-drawer-link {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.75rem 0.85rem; border-radius: 10px;
    font-size: 0.88rem; font-weight: 500; color: rgba(255,255,255,0.7);
    text-decoration: none; transition: background 0.16s, color 0.16s;
    margin-bottom: 0.15rem;
  }
  .hdr-drawer-link:hover, .hdr-drawer-link.active { background: rgba(232,184,75,0.12); color: #e8b84b; }
  .hdr-drawer-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 0.5rem 0; }
  .hdr-drawer-foot { padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.07); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .hdr-nav { display: none !important; }
    .hdr-burger { display: flex !important; }
    .hdr-inner { padding: 0 1.25rem; gap: 1rem; }
  }
  @media (max-width: 480px) {
    .hdr-user-name { display: none; }
  }
`;

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Restaurants", to: "/restaurants" },
  { label: "Menu", to: "/category/all" },
  { label: "Orders", to: "/orders" },
];

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useCart();
  const { user, logout } = useAuth();

  const [dropOpen, setDropOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  /* close dropdown on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* close drawer on route change */
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const initial = user?.userName?.[0]?.toUpperCase() ?? "U";

  const handleLogout = () => {
    setDropOpen(false);
    setDrawerOpen(false);
    logout();
    navigate("/");
  };

  return (
    <>
      <style>{STYLE}</style>

      <header className="hdr-root">
        <div className="hdr-inner">
          {/* Logo */}
          <a
            href="/"
            className="hdr-logo"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <div className="hdr-logo-icon">🍕</div>
            Food Mart
          </a>

          {/* Desktop nav */}
          <nav className="hdr-nav">
            {NAV_LINKS.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`hdr-nav-link${isActive(n.to) ? " active" : ""}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hdr-actions">
            {/* Cart */}
            <Link to="/cart" className="hdr-icon-btn" title="Cart">
              <ShoppingCart size={19} />
              {state.totalItems > 0 && (
                <span className="hdr-badge">
                  {state.totalItems > 99 ? "99+" : state.totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="hdr-user-wrap" ref={dropRef}>
                <button
                  className="hdr-user-btn"
                  onClick={() => setDropOpen((p) => !p)}
                  aria-expanded={dropOpen}
                >
                  <div className="hdr-avatar">{initial}</div>
                  <span className="hdr-user-name">{user.userName}</span>
                  <ChevronDown
                    size={14}
                    className={`hdr-chevron${dropOpen ? " open" : ""}`}
                  />
                </button>

                {dropOpen && (
                  <div className="hdr-dropdown">
                    <Link
                      to="/profile"
                      className="hdr-drop-item"
                      onClick={() => setDropOpen(false)}
                    >
                      <User size={14} /> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="hdr-drop-item"
                      onClick={() => setDropOpen(false)}
                    >
                      <LayoutDashboard size={14} /> My Orders
                    </Link>
                    <div className="hdr-drop-divider" />
                    <button
                      className="hdr-drop-item danger"
                      onClick={handleLogout}
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hdr-login">
                Login
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="hdr-burger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {drawerOpen && (
        <>
          <div
            className="hdr-drawer-overlay"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="hdr-drawer">
            <div className="hdr-drawer-head">
              <span
                style={{
                  color: "#e8b84b",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                }}
              >
                🍕 Food Mart
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <nav className="hdr-drawer-nav">
              {NAV_LINKS.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`hdr-drawer-link${isActive(n.to) ? " active" : ""}`}
                >
                  {n.label}
                </Link>
              ))}

              <div className="hdr-drawer-divider" />

              <Link
                to="/cart"
                className="hdr-drawer-link"
                style={{ justifyContent: "space-between" }}
              >
                <span>Cart</span>
                {state.totalItems > 0 && (
                  <span
                    style={{
                      background: "#e8b84b",
                      color: "#1a1a2e",
                      borderRadius: 99,
                      padding: "0.1rem 0.55rem",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                    }}
                  >
                    {state.totalItems}
                  </span>
                )}
              </Link>

              {user && (
                <>
                  <Link to="/profile" className="hdr-drawer-link">
                    My Profile
                  </Link>
                  <Link to="/orders" className="hdr-drawer-link">
                    My Orders
                  </Link>
                </>
              )}
            </nav>

            <div className="hdr-drawer-foot">
              {user ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.9rem",
                  }}
                >
                  <div
                    className="hdr-avatar"
                    style={{
                      width: 36,
                      height: 36,
                      fontSize: "0.88rem",
                      borderRadius: 10,
                    }}
                  >
                    {initial}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {user.userName}
                    </p>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      Logged in
                    </p>
                  </div>
                </div>
              ) : null}
              {user ? (
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "0.72rem",
                    borderRadius: 10,
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#ef4444",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontFamily: "Inter,sans-serif",
                    transition: "background 0.18s",
                  }}
                >
                  <LogOut size={15} /> Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.72rem",
                    borderRadius: 10,
                    background: "#e8b84b",
                    color: "#1a1a2e",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Login
                </Link>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Header;
