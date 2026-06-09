"use client";

import Link from "next/link";
import { ReactNode, MouseEvent } from "react";
import {
  ContentApiKind,
  setContentApiCookie,
} from "../lib/content-api-cookie";

type ContentApiLinkProps = {
  href: string;
  apiUrl: string;
  kind: ContentApiKind;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onNavigate?: () => void;
  external?: boolean;
};

export function saveApiBeforeNavigate(
  apiUrl: string,
  kind: ContentApiKind,
  onNavigate?: () => void,
) {
  setContentApiCookie(apiUrl, kind);
  onNavigate?.();
}

export default function ContentApiLink({
  href,
  apiUrl,
  kind,
  children,
  className,
  style,
  onNavigate,
  external = false,
}: ContentApiLinkProps) {
  const handleClick = (e: MouseEvent) => {
    setContentApiCookie(apiUrl, kind);
    onNavigate?.();
    if (external) {
      e.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  if (external) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </Link>
  );
}
