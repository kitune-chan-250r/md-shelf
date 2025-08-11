import { useCallback, type RefObject } from "react";

const SCROLL_POSITIONS_KEY = "scrollPositions";

const getScrollPositions = (): { [key: string]: number } => {
  const json = sessionStorage.getItem(SCROLL_POSITIONS_KEY);
  return json ? JSON.parse(json) : {};
};

const setScrollPosition = (path: string, position: number) => {
  const positions = getScrollPositions();
  positions[path] = position;
  sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions));
};

export const useScrollRestoration = (ref: RefObject<HTMLElement | null>) => {
  const saveScrollPosition = useCallback(
    (path: string) => {
      if (ref.current) {
        setScrollPosition(path, ref.current.scrollTop);
      }
    },
    [ref]
  );

  const restoreScrollPosition = useCallback(
    (path: string) => {
      if (ref.current) {
        const positions = getScrollPositions();
        const position = positions[path];
        if (position) {
          ref.current.scrollTo(0, position);
        }
      }
    },
    [ref]
  );

  return { saveScrollPosition, restoreScrollPosition };
};
