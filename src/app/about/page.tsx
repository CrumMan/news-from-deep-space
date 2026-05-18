"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  Bot,
  Check,
  Code2,
  Globe2,
  Microscope,
  Newspaper,
  Rocket,
  Sparkles,
  Star,
  Telescope,
  User,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container">
      <div
        className="hero-card"
        style={{ maxWidth: "900px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              color: "#bbbdf6",
              marginBottom: "0.5rem",
              fontSize: "2.5rem",
            }}
          >
            About NFDS
          </h1>
          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              backgroundColor: "#7a5980",
              color: "white",
              borderRadius: "20px",
              fontSize: "0.875rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            News From Deep Space
          </div>
          <p style={{ color: "#d1d5db", fontSize: "1.125rem" }}>
            Your daily gateway to the wonders of the universe
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <SectionHeading icon={<Rocket size={22} />}>
            Our Mission
          </SectionHeading>
          <p
            style={{
              color: "#d1d5db",
              lineHeight: "1.6",
              marginBottom: "1rem",
            }}
          >
            NFDS (News From Deep Space) is dedicated to bringing the latest and
            most exciting discoveries from the cosmos directly to you. We
            believe that space exploration and astronomical discoveries should
            be accessible to everyone, regardless of their background or
            expertise.
          </p>
          <p style={{ color: "#d1d5db", lineHeight: "1.6" }}>
            Our mission is to inspire curiosity, foster learning, and share the
            breathtaking beauty of our universe through daily space content,
            breaking news, and in-depth articles about humanity's greatest
            adventures beyond Earth.
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <SectionHeading icon={<Star size={22} />}>
            What We Do
          </SectionHeading>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                background: "rgba(59, 59, 88, 0.5)",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <TileIcon><Newspaper size={28} /></TileIcon>
              <h3
                style={{
                  color: "#bbbdf6",
                  marginBottom: "0.5rem",
                  fontSize: "1.1rem",
                }}
              >
                Daily Space News
              </h3>
              <p
                style={{
                  color: "#d1d5db",
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                }}
              >
                Curated articles and breaking news from space agencies, research
                institutions, and space companies worldwide.
              </p>
            </div>

            <div
              style={{
                background: "rgba(59, 59, 88, 0.5)",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <TileIcon><Globe2 size={28} /></TileIcon>
              <h3
                style={{
                  color: "#bbbdf6",
                  marginBottom: "0.5rem",
                  fontSize: "1.1rem",
                }}
              >
                Daily Space Photos
              </h3>
              <p
                style={{
                  color: "#d1d5db",
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                }}
              >
                Stunning astronomical images captured by NASA, ESA, and other
                space observatories from around the globe.
              </p>
            </div>

            <div
              style={{
                background: "rgba(59, 59, 88, 0.5)",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <TileIcon><Telescope size={28} /></TileIcon>
              <h3
                style={{
                  color: "#bbbdf6",
                  marginBottom: "0.5rem",
                  fontSize: "1.1rem",
                }}
              >
                Educational Content
              </h3>
              <p
                style={{
                  color: "#d1d5db",
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                }}
              >
                In-depth articles explaining complex space phenomena in an
                accessible and engaging way for all learning levels.
              </p>
            </div>

            <div
              style={{
                background: "rgba(59, 59, 88, 0.5)",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <TileIcon><Bot size={28} /></TileIcon>
              <h3
                style={{
                  color: "#bbbdf6",
                  marginBottom: "0.5rem",
                  fontSize: "1.1rem",
                }}
              >
                AI-Powered Assistant
              </h3>
              <p
                style={{
                  color: "#d1d5db",
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                }}
              >
                Smart chatbot to help you find relevant space content and answer
                your questions about the cosmos.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <SectionHeading icon={<Sparkles size={22} />}>
            Why Choose NFDS?
          </SectionHeading>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <FeatureBullet
              title="Curated Content"
              description="Hand-picked articles and images"
            />
            <FeatureBullet
              title="Daily Updates"
              description="Fresh content delivered every day"
            />
            <FeatureBullet
              title="Free Access"
              description="No subscription or payment required"
            />
            <FeatureBullet
              title="User-Friendly"
              description="Simple and intuitive interface"
            />
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <SectionHeading icon={<Telescope size={22} />}>
            Our Vision
          </SectionHeading>
          <p style={{ color: "#d1d5db", lineHeight: "1.6" }}>
            We envision a world where everyone has access to the latest space
            discoveries and can share in the excitement of humanity's expansion
            into the cosmos. Whether you're a student, educator, space
            enthusiast, or just curious about the universe, NFDS is your trusted
            companion on this incredible journey of exploration.
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              color: "#bbbdf6",
              marginBottom: "1rem",
              fontSize: "1.5rem",
            }}
          ></h2>
          <p
            style={{
              color: "#d1d5db",
              lineHeight: "1.6",
              marginBottom: "1rem",
            }}
          >
            NFDS is powered by a passionate team of space enthusiasts, writers,
            and developers who are dedicated to making space exploration
            accessible to everyone. We work tirelessly to bring you the most
            accurate, up-to-date, and engaging space content from around the
            world.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <TeamRole icon={<User size={26} />} label="Space Writers" />
            <TeamRole icon={<Code2 size={26} />} label="Developers" />
            <TeamRole icon={<Microscope size={26} />} label="Science Advisors" />
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            padding: "1.5rem",
            background: "rgba(122, 89, 128, 0.2)",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ color: "#bbbdf6", marginBottom: "0.5rem" }}>
            Ready to Explore the Universe?
          </h3>
          <p
            style={{
              color: "#d1d5db",
              marginBottom: "1rem",
              fontSize: "0.875rem",
            }}
          >
            Join us on our journey through the cosmos
          </p>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <Link href="/" className="button-primary">
              Start Exploring
            </Link>
            <Link href="/article" className="button-secondary">
              Read Daily Article
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <h2
      style={{
        color: "#bbbdf6",
        marginBottom: "1rem",
        fontSize: "1.5rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "rgba(187, 189, 246, 0.12)",
          border: "1px solid rgba(187, 189, 246, 0.25)",
          color: "#bbbdf6",
        }}
      >
        {icon}
      </span>
      {children}
    </h2>
  );
}

function TileIcon({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "44px",
        height: "44px",
        marginBottom: "0.75rem",
        borderRadius: "10px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(187, 189, 246, 0.12)",
        border: "1px solid rgba(187, 189, 246, 0.25)",
        color: "#bbbdf6",
      }}
    >
      {children}
    </div>
  );
}

function FeatureBullet({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <p
        style={{
          color: "#bbbdf6",
          fontWeight: 600,
          marginBottom: "0.25rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <Check size={16} color="#7a5980" strokeWidth={3} />
        {title}
      </p>
      <p style={{ color: "#d1d5db", fontSize: "0.875rem" }}>{description}</p>
    </div>
  );
}

function TeamRole({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "52px",
          height: "52px",
          margin: "0 auto",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(187, 189, 246, 0.18) 0%, rgba(122, 89, 128, 0.18) 100%)",
          border: "1px solid rgba(187, 189, 246, 0.25)",
          color: "#bbbdf6",
        }}
      >
        {icon}
      </div>
      <p
        style={{
          color: "#bbbdf6",
          fontWeight: "bold",
          marginTop: "0.5rem",
        }}
      >
        {label}
      </p>
    </div>
  );
}
