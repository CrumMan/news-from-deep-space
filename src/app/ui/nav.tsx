"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Info,
  LogIn,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { clearSession, getCurrentAccount } from "../admin/bot-config";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const syncAuth = () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setIsAdmin(loggedIn && (getCurrentAccount()?.isAdmin ?? false));
  };

  useEffect(() => {
    syncAuth();

    window.addEventListener("authChange", syncAuth);

    return () => {
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = "/";
  };

  const iconSize = 16;
  type NavItem = {
    name: string;
    href: string;
    icon: ReactNode;
    onClick?: () => void;
  };

  const navLinks: NavItem[] = [
    { name: "Home", href: "/", icon: <Home size={iconSize} /> },
    { name: "Articles", href: "/article", icon: <Newspaper size={iconSize} /> },
    { name: "About Us", href: "/about", icon: <Info size={iconSize} /> },
  ];

  const authLinks: NavItem[] = isLoggedIn
    ? [
        ...(isAdmin
          ? [
              {
                name: "Admin",
                href: "/admin",
                icon: <Settings size={iconSize} />,
              },
            ]
          : []),
        { name: "Account", href: "/account", icon: <User size={iconSize} /> },
        {
          name: "Logout",
          href: "#",
          onClick: handleLogout,
          icon: <LogOut size={iconSize} />,
        },
      ]
    : [
        { name: "Login", href: "/login", icon: <LogIn size={iconSize} /> },
        { name: "Sign Up", href: "/signup", icon: <UserPlus size={iconSize} /> },
      ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <nav
        style={{
          backgroundColor: "#2a2a42",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
          padding: "1rem 0",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          borderBottom: "1px solid rgba(187, 189, 246, 0.2)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              textDecoration: "none",
              background: "linear-gradient(135deg, #bbbdf6 0%, #7a5980 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            NFDS
          </Link>

          <div
            style={{
              display: "flex",
              gap: "2rem",
              alignItems: "center",
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                style={{
                  color: isActive(link.href) ? "#bbbdf6" : "#e0e0e0",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: isActive(link.href) ? "600" : "400",
                  borderBottom: isActive(link.href)
                    ? "2px solid #bbbdf6"
                    : "2px solid transparent",
                  paddingBottom: "4px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#bbbdf6";
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    e.currentTarget.style.color = "#e0e0e0";
                  }
                }}
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}

            {authLinks.map((link) =>
              link.onClick ? (
                <button
                  key={link.name}
                  onClick={link.onClick}
                  style={{
                    color: "#e0e0e0",
                    textDecoration: "none",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    padding: "4px 0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#bbbdf6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#e0e0e0";
                  }}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </button>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    color: isActive(link.href) ? "#bbbdf6" : "#e0e0e0",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: isActive(link.href) ? "600" : "400",
                    borderBottom: isActive(link.href)
                      ? "2px solid #bbbdf6"
                      : "2px solid transparent",
                    paddingBottom: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#bbbdf6";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.href)) {
                      e.currentTarget.style.color = "#e0e0e0";
                    }
                  }}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ),
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "6px",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            style={{
              display: "none",
              flexDirection: "column",
              padding: "1rem 20px",
              backgroundColor: "#2a2a42",
              borderTop: "1px solid rgba(187, 189, 246, 0.1)",
            }}
            className="mobile-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                style={{
                  color: isActive(link.href) ? "#bbbdf6" : "#e0e0e0",
                  textDecoration: "none",
                  padding: "0.75rem 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  borderBottom: "1px solid rgba(187, 189, 246, 0.1)",
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
            {authLinks.map((link) =>
              link.onClick ? (
                <button
                  key={link.name}
                  onClick={() => {
                    link.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    color: "#e0e0e0",
                    textDecoration: "none",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.75rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    textAlign: "left",
                    borderBottom: "1px solid rgba(187, 189, 246, 0.1)",
                    width: "100%",
                  }}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </button>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    color: isActive(link.href) ? "#bbbdf6" : "#e0e0e0",
                    textDecoration: "none",
                    padding: "0.75rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    borderBottom: "1px solid rgba(187, 189, 246, 0.1)",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ),
            )}
          </div>
        )}
      </nav>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-nav {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
