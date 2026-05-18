"use client";

import { useRef, useCallback } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleOpen = useCallback(() => {
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  }, []);

  const handleClose = useCallback(() => {
    dialogRef.current?.close();
    document.body.style.overflow = "";
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="cursor-zoom-in"
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

      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-0 m-0 max-w-none max-h-none w-full h-full border-0 outline-none"
        onClose={() => { document.body.style.overflow = ""; }}
        onClick={handleClose}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white z-10 cursor-pointer"
          aria-label="Close"
        >
          <X className="h-8 w-8" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90vw] max-h-[90vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </dialog>
    </>
  );
}
