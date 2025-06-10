import {type RefObject, useEffect} from 'react';

export function usePopupClose<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClose: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleTouch = (e: TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouch);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, [ref, onClose]);
}