"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Rocket } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Twitter",
      url: "https://twitter.com",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "#1DA1F2",
    },
    {
      name: "Facebook",
      url: "https://facebook.com",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
      color: "#4267B2",
    },
    {
      name: "Instagram",
      url: "https://instagram.com",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      color: "#E4405F",
    },
    {
      name: "GitHub",
      url: "https://github.com",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.295 2.75-1.026 2.75-1.026.544 1.378.201 2.397.098 2.65.64.7 1.029 1.595 1.029 2.688 0 3.846-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
      color: "#333",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
        </svg>
      ),
      color: "#0077B5",
    },
    {
      name: "YouTube",
      url: "https://youtube.com",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      color: "#FF0000",
    },
    {
      name: "TikTok",
      url: "https://tiktok.com",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      color: "#000000",
    },
    {
      name: "Discord",
      url: "https://discord.com",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.398-.875-.608-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128c.126-.094.251-.19.371-.285a.078.078 0 0 1 .082-.01c3.927 1.793 8.18 1.793 12.061 0a.078.078 0 0 1 .082.009c.12.094.245.19.371.285a.077.077 0 0 1-.008.128c-.601.356-1.224.66-1.872.892a.077.077 0 0 0-.041.106c.353.698.764 1.363 1.226 1.994a.078.078 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .031-.057c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
      color: "#5865F2",
    },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Daily Article", href: "/article" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#1a1a2e",
        color: "#e0e0e0",
        marginTop: "4rem",
        borderTop: "1px solid rgba(187, 189, 246, 0.2)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3rem 20px 2rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.8rem",
                marginBottom: "1rem",
                background: "linear-gradient(135deg, #bbbdf6 0%, #7a5980 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              NFDS
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: "1.6",
                color: "#d1d5db",
              }}
            >
              Exploring the wonders of the universe through daily space content
              and articles. Join us on our journey to discover the cosmos.
            </p>
          </div>

          <div>
            <h4
              style={{
                color: "#bbbdf6",
                marginBottom: "1rem",
                fontSize: "1.1rem",
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {quickLinks.map((link) => (
                <li key={link.name} style={{ marginBottom: "0.5rem" }}>
                  <Link
                    href={link.href}
                    style={{
                      color: "#d1d5db",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#bbbdf6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#d1d5db";
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              style={{
                color: "#bbbdf6",
                marginBottom: "1rem",
                fontSize: "1.1rem",
              }}
            >
              Contact Us
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li
                style={{
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Mail size={16} color="#bbbdf6" />
                <a
                  href="mailto:info@nfds.com"
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#bbbdf6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#d1d5db";
                  }}
                >
                  info@nfds.com
                </a>
              </li>
              <li
                style={{
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Phone size={16} color="#bbbdf6" />
                <span style={{ fontSize: "0.875rem" }}>+1 (123) 123-4567</span>
              </li>
              <li
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <MapPin size={16} color="#bbbdf6" />
                <span style={{ fontSize: "0.875rem" }}>
                  ISS, Low Earth Orbit (LEO)
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                color: "#bbbdf6",
                marginBottom: "1rem",
                fontSize: "1.1rem",
              }}
            >
              Stay Updated
            </h4>
            <p
              style={{
                fontSize: "0.875rem",
                marginBottom: "1rem",
                color: "#d1d5db",
              }}
            >
              Get the latest space news delivered to your inbox
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="Your email address"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  backgroundColor: "rgba(59, 59, 88, 0.5)",
                  border: "1px solid #7a5980",
                  borderRadius: "8px",
                  color: "white",
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                }}
              />
              <button
                className="button-primary"
                style={{ padding: "8px 16px", fontSize: "0.875rem" }}
                onClick={() =>
                  alert("Newsletter subscription feature coming soon!")
                }
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "2rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid rgba(187, 189, 246, 0.2)",
            flexWrap: "wrap",
          }}
        >
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "10px",
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(59, 59, 88, 0.5)",
                borderRadius: "50%",
                textDecoration: "none",
                color: "#e0e0e0",
                transition: "all 0.3s ease",
                fontSize: "0.875rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = social.color;
                e.currentTarget.style.color = "white";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(59, 59, 88, 0.5)";
                e.currentTarget.style.color = "#e0e0e0";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "#9ca3af",
          }}
        >
          <p>
            &copy; {currentYear} NFDS - News From Deep Space. All rights
            reserved.
          </p>
          <p
            style={{
              marginTop: "0.5rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            Designed for space enthusiasts around the world
            <Rocket size={14} />
          </p>
        </div>
      </div>
    </footer>
  );
}
