import { useState, useCallback, useRef } from "react";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  exiting?: boolean;
}

let toastId = 0;
let globalAddToast: ((message: string, type?: Toast["type"]) => void) | null =
  null;

export function showToast(message: string, type: Toast["type"] = "success") {
  globalAddToast?.(message, type);
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const removeToast = useCallback((id: number) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    // Actually remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      const timer = timerRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timerRef.current.delete(id);
      }
    }, 200);
  }, []);

  const addToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = ++toastId;
      setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
      const timer = setTimeout(() => removeToast(id), 2500);
      timerRef.current.set(id, timer);
    },
    [removeToast],
  );

  globalAddToast = addToast;

  return { toasts, removeToast };
}
