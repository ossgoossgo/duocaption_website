import { useEffect, useState } from "react";
import { usePalette } from "../theme";

interface ToastProps {
  message: string;
  onDone: () => void;
  duration?: number;
}

export function Toast({ message, onDone, duration = 1500 }: ToastProps) {
  const P = usePalette();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <div style={{
      position: "fixed", bottom: 40, left: "50%", transform: "translateX(-50%)",
      padding: "10px 20px", borderRadius: 10,
      background: P.text, color: P.bg,
      fontSize: 14, fontWeight: P.w.medium, fontFamily: P.font,
      boxShadow: P.shadowLg, zIndex: 200,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.3s ease",
    }}>
      {message}
    </div>
  );
}
