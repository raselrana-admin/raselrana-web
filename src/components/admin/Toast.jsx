"use client";

import { Check } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(() => {});

/** const toast = useToast(); toast("Saved"); */
export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[120] flex flex-col items-center gap-2 px-6"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="rise flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2.5 text-sm font-medium text-[var(--paper)] shadow-lg"
          >
            <Check size={16} aria-hidden />
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
