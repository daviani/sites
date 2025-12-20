
'use client';

import {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

// =============================================================================
// Types
// =============================================================================

export type AnimateFrom = 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random';

export interface MasonryItem {
  id: string | number;
  height: number;
  width?: number;
  src?: string;
}

export interface MasonryGridProps<T extends MasonryItem> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** Number of columns at different breakpoints [xl, lg, md, sm, default] */
  columns?: [number, number, number, number, number];
  /** Gap between items in pixels */
  gap?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Stagger delay between items in seconds */
  stagger?: number;
  /** Direction from which items animate in */
  animateFrom?: AnimateFrom;
  /** Enable blur-to-focus effect */
  blurToFocus?: boolean;
}

interface GridItem<T> extends MasonryItem {
  x: number;
  y: number;
  w: number;
  h: number;
  original: T;
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to get responsive column count based on media queries
 */
function useColumns(columnConfig: [number, number, number, number, number]): number {
  const queries = [
    '(min-width: 1280px)', // xl
    '(min-width: 1024px)', // lg
    '(min-width: 768px)',  // md
    '(min-width: 640px)',  // sm
  ];

  const getColumns = useCallback(() => {
    if (typeof window === 'undefined') return columnConfig[4];

    for (let i = 0; i < queries.length; i++) {
      if (window.matchMedia(queries[i]).matches) {
        return columnConfig[i];
      }
    }
    return columnConfig[4];
    // eslint-disable-next-line react-hooks/exhaustive-deps -- queries is a stable constant array
  }, [columnConfig]);

  const [columns, setColumns] = useState(columnConfig[4]);

  useEffect(() => {
    setColumns(getColumns());

    const handler = () => setColumns(getColumns());
    const mediaQueryLists = queries.map((q) => window.matchMedia(q));

    mediaQueryLists.forEach((mql) => {
      mql.addEventListener('change', handler);
    });

    return () => {
      mediaQueryLists.forEach((mql) => {
        mql.removeEventListener('change', handler);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- queries is stable
  }, [getColumns]);

  return columns;
}

/**
 * Hook to measure container width using ResizeObserver
 */
function useMeasure(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, width];
}

// =============================================================================
// Animation helpers
// =============================================================================

function getInitialPosition(
  animateFrom: AnimateFrom,
  itemX: number,
  itemY: number,
  containerWidth: number
): { x: number; y: number } {
  let direction = animateFrom;

  if (animateFrom === 'random') {
    const directions: AnimateFrom[] = ['top', 'bottom', 'left', 'right'];
    direction = directions[Math.floor(Math.random() * directions.length)];
  }

  switch (direction) {
    case 'top':
      return { x: itemX, y: -100 };
    case 'bottom':
      return { x: itemX, y: itemY + 200 };
    case 'left':
      return { x: -100, y: itemY };
    case 'right':
      return { x: containerWidth + 100, y: itemY };
    case 'center':
      return { x: containerWidth / 2, y: 0 };
    default:
      return { x: itemX, y: itemY + 50 };
  }
}

// =============================================================================
// Component
// =============================================================================

export function MasonryGrid<T extends MasonryItem>({
  items,
  renderItem,
  columns: columnConfig = [4, 3, 3, 2, 1],
  gap = 24,
  duration = 0.5,
  stagger = 0.03,
  animateFrom = 'bottom',
  blurToFocus = true,
}: MasonryGridProps<T>) {
  const prefersReducedMotion = useReducedMotion();
  const columns = useColumns(columnConfig);
  const [containerRef, containerWidth] = useMeasure();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Preload images
  useEffect(() => {
    if (items.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: sync loaded state for empty items
      setImagesLoaded(true);
      return;
    }

    const imageUrls = items
      .filter((item) => typeof item.src === 'string')
      .map((item) => item.src as string);

    if (imageUrls.length === 0) {
      setImagesLoaded(true);
      return;
    }

    Promise.all(
      imageUrls.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
      )
    ).then(() => setImagesLoaded(true));
  }, [items]);

  // Reset animation state when items change significantly
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: reset animation state when items change
    setHasAnimated(false);
  }, [items.length]);

  // Calculate grid positions
  const grid = useMemo((): GridItem<T>[] => {
    if (!containerWidth || items.length === 0) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = (containerWidth - gap * (columns - 1)) / columns;

    return items.map((item) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const aspectRatio = typeof item.width === 'number' && typeof item.height === 'number'
        ? item.width / item.height
        : 1;
      const h = columnWidth / aspectRatio;
      const y = colHeights[col];

      colHeights[col] += h + gap;

      return {
        ...item,
        x,
        y,
        w: columnWidth,
        h,
        original: item,
      };
    });
  }, [columns, items, containerWidth, gap]);

  // Calculate total height
  const totalHeight = useMemo(() => {
    if (grid.length === 0) return 0;
    return Math.max(...grid.map((item) => item.y + item.h));
  }, [grid]);

  // Mark as animated after first render
  useEffect(() => {
    if (imagesLoaded && grid.length > 0) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, duration * 1000 + stagger * items.length * 1000 + 100);
      return () => clearTimeout(timer);
    }
  }, [imagesLoaded, grid.length, duration, stagger, items.length]);

  // Animation variants
  const getVariants = useCallback(
    (item: GridItem<T>, index: number): Variants => {
      if (prefersReducedMotion) {
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      }

      const initialPos = getInitialPosition(animateFrom, item.x, item.y, containerWidth);

      return {
        hidden: {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          filter: blurToFocus ? 'blur(10px)' : 'blur(0px)',
        },
        visible: {
          opacity: 1,
          x: item.x,
          y: item.y,
          filter: 'blur(0px)',
          transition: {
            duration,
            delay: hasAnimated ? 0 : index * stagger,
            ease: [0.25, 0.1, 0.25, 1], // cubic-bezier
          },
        },
      };
    },
    [animateFrom, containerWidth, blurToFocus, duration, stagger, prefersReducedMotion, hasAnimated]
  );

  if (!imagesLoaded) {
    return (
      <div
        ref={containerRef}
        className="relative w-full min-h-[400px] flex items-center justify-center"
      >
        <div className="w-8 h-8 border-2 border-nord-10 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: totalHeight || 'auto' }}
    >
      {grid.map((item, index) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{
            width: item.w,
            height: item.h,
            willChange: 'transform, opacity, filter',
          }}
          initial="hidden"
          animate="visible"
          variants={getVariants(item, index)}
          whileHover={
            prefersReducedMotion
              ? undefined
              : {
                  scale: 0.98,
                  transition: { duration: 0.2 },
                }
          }
        >
          {renderItem(item.original, index)}
        </motion.div>
      ))}
    </div>
  );
}