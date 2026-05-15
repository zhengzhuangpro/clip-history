import { useToast } from "@/hooks/useToast";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colors = {
  success: "bg-green-500/90 text-white",
  error: "bg-red-500/90 text-white",
  info: "bg-blue-500/90 text-white",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm shadow-lg ${
              colors[toast.type]
            } ${
              toast.exiting
                ? "animate-out slide-out-to-right-5 fade-out duration-200"
                : "animate-in slide-in-from-right-5 fade-in duration-200"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 shrink-0 opacity-70 hover:opacity-100"
            >
              <X className="size-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
