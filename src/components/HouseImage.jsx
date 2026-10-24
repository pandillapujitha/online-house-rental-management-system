import { useState } from "react";

// Shows a photo, falls back to a neutral block if the image cannot load
export default function HouseImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className={`img-fallback ${className}`} role="img" aria-label={alt}>No photo</div>;
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
