import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = false
}: UseIntersectionObserverProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<Element | null>(null);
  const frozen = useRef(false);

  const handleObserve = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (frozen.current && freezeOnceVisible) return;

      const isIntersecting = entry.isIntersecting || entry.intersectionRatio > 0;

      if (isIntersecting) {
        setIsVisible(true);
        if (freezeOnceVisible) {
          frozen.current = true;
        }
      } else {
        !freezeOnceVisible && setIsVisible(false);
      }
    },
    [freezeOnceVisible]
  );

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(handleObserve, {
      threshold,
      root,
      rootMargin
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, threshold, root, rootMargin, handleObserve]);

  return { ref: setElement, isVisible };
};