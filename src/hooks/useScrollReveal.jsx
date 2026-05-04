import { useRef, useState, useEffect, useMemo } from 'react';

const DEFAULT_OPTIONS = {
  threshold: 0,
  rootMargin: '0px',
  triggerOnce: true,
};

/**
 * useScrollReveal — 使用 Intersection Observer 检测元素进入视口
 *
 * @param {Object} options
 * @param {number}  [options.threshold=0]     交叉比例阈值
 * @param {string}  [options.rootMargin='0px'] 观察器的 margin
 * @param {boolean} [options.triggerOnce=true] 是否只触发一次
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 */
export function useScrollReveal(options = {}) {
  const { threshold, rootMargin, triggerOnce } = { ...DEFAULT_OPTIONS, ...options };
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // 检查 prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 用户偏好减少动画 — 直接显示
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, prefersReducedMotion]);

  return { ref, isVisible };
}

/**
 * ScrollReveal — 包装组件，为子元素提供滚动进入动画
 *
 * @param {Object}   props
 * @param {ReactNode} props.children       需要动画的子元素
 * @param {string}   [props.className]     额外的 class
 * @param {number}   [props.delay=0]       动画延迟（ms）
 * @param {string}   [props.animation]     自定义动画 class（默认 animate-fade-up）
 * @param {number}   [props.threshold]     透传给 useScrollReveal
 * @param {string}   [props.rootMargin]    透传给 useScrollReveal
 * @param {boolean}  [props.triggerOnce]   透传给 useScrollReveal
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  animation = 'animate-fade-up',
  threshold,
  rootMargin,
  triggerOnce,
}) {
  const { ref, isVisible } = useScrollReveal({ threshold, rootMargin, triggerOnce });

  const style = delay > 0 ? { animationDelay: `${delay}ms` } : undefined;

  return (
    <div
      ref={ref}
      className={`${isVisible ? animation : 'opacity-0'} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
