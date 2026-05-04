/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        // Existing
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.4s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        // Scroll-reveal: fade-up from below
        'scroll-fade-up': 'scrollFadeUp 0.6s ease-out forwards',
        'scroll-slide-left': 'scrollSlideLeft 0.6s ease-out forwards',
        'scroll-slide-right': 'scrollSlideRight 0.6s ease-out forwards',
        'scroll-scale-in': 'scrollScaleIn 0.6s ease-out forwards',
        // Duration variants for scroll-reveal
        'scroll-fade-up-slow': 'scrollFadeUp 0.9s ease-out forwards',
        'scroll-fade-up-fast': 'scrollFadeUp 0.35s ease-out forwards',
        'scroll-slide-left-slow': 'scrollSlideLeft 0.9s ease-out forwards',
        'scroll-slide-right-slow': 'scrollSlideRight 0.9s ease-out forwards',
        'scroll-scale-in-slow': 'scrollScaleIn 0.9s ease-out forwards',
        // Enhanced existing variants
        'fade-up-slow': 'fadeUp 0.7s ease-out forwards',
        'fade-up-fast': 'fadeUp 0.25s ease-out forwards',
        'fade-in-scale-slow': 'fadeInScale 0.8s ease-out forwards',
        'float-slow': 'float 10s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
        'pulse-subtle-slow': 'pulseSubtle 4s ease-in-out infinite',
        // Reduced-motion-safe overrides (final state instantly)
        'reduce-fade-up': 'reduceFadeUp 0.01s forwards',
        'reduce-fade-in-scale': 'reduceFadeInScale 0.01s forwards',
        'reduce-scroll-fade-up': 'reduceScrollFadeUp 0.01s forwards',
        'reduce-scroll-slide-left': 'reduceScrollSlideLeft 0.01s forwards',
        'reduce-scroll-slide-right': 'reduceScrollSlideRight 0.01s forwards',
        'reduce-scroll-scale-in': 'reduceScrollScaleIn 0.01s forwards',
        'reduce-shimmer': 'reduceShimmer 0.01s forwards',
        'reduce-float': 'reduceFloat 0.01s forwards',
        'reduce-pulse-subtle': 'reducePulseSubtle 0.01s forwards',
      },
      keyframes: {
        // Existing keyframes
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInScale: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseSubtle: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
        // Scroll-reveal keyframes
        scrollFadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollSlideLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scrollSlideRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scrollScaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Reduced-motion keyframes — jump to final state instantly
        reduceFadeUp: { '0%': { opacity: '1', transform: 'translateY(0)' }, '100%': {} },
        reduceFadeInScale: { '0%': { opacity: '1', transform: 'scale(1)' }, '100%': {} },
        reduceScrollFadeUp: { '0%': { opacity: '1', transform: 'translateY(0)' }, '100%': {} },
        reduceScrollSlideLeft: { '0%': { opacity: '1', transform: 'translateX(0)' }, '100%': {} },
        reduceScrollSlideRight: { '0%': { opacity: '1', transform: 'translateX(0)' }, '100%': {} },
        reduceScrollScaleIn: { '0%': { opacity: '1', transform: 'scale(1)' }, '100%': {} },
        reduceShimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': {} },
        reduceFloat: { '0%': { transform: 'translateY(0)' }, '100%': {} },
        reducePulseSubtle: { '0%': { opacity: '1' }, '100%': {} },
      },
    },
  },
  plugins: [],
};
