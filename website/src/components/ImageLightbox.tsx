"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function ImageLightbox({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setOpen(false), 200);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-zoom-in transition-transform hover:scale-[1.02]"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
        />
      </button>

      {open && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-200 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-transform hover:scale-110"
          >
            <X className="h-8 w-8" />
          </button>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`max-w-[90vw] max-h-[90vh] object-contain transition-all duration-200 ${
              visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          />
        </div>
      )}
    </>
  );
}
