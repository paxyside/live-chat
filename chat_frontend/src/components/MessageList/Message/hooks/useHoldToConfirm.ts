import { useRef, useState, useCallback } from "react";

export const useHoldToConfirm = (timeoutMs: number = 600) => {
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDown = useCallback(() => {
    timerRef.current = setTimeout(() => setShow(true), timeoutMs);
  }, [timeoutMs]);

  const handleUp = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const cancel = () => setShow(false);

  return {
    show,
    handleDown,
    handleUp,
    confirm: () => {
      setShow(false);
    },
    cancel,
  };
};
