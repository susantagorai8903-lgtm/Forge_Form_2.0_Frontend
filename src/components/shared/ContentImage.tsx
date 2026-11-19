"use client";

import Image from "next/image";
import { useState } from "react";

import type { CSSProperties } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectPosition?: CSSProperties["objectPosition"];
};

export function ContentImage({
  src,
  alt,
  className = "cover-image",
  priority = false,
  sizes = "100vw",
  objectPosition = "center",
}: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;

  if (src.startsWith("/") && !src.startsWith("//")) {
    return <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      style={{ objectPosition }}
      onError={() => setFailed(true)}
    />;
  }

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  return (
    <Image
      src={url.href}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      unoptimized
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition }}
      onError={() => setFailed(true)}
    />
  );
}
