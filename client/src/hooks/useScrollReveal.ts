import { useEffect } from 'react';

/**
 * useScrollReveal observes all elements with the `.apple-reveal` class
 * and activates smooth Apple-style fade-and-glide transitions as they enter the viewport.
 */
export function useScrollReveal(dependencyKey?: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        // Fallback for environments without IntersectionObserver
        document.querySelectorAll('.apple-reveal').forEach((el) => {
          el.classList.add('revealed');
        });
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -20px 0px',
          threshold: 0.02,
        }
      );

      const observeAll = () => {
        const targets = document.querySelectorAll('.apple-reveal:not(.revealed), .apple-reveal-scale:not(.revealed)');
        targets.forEach((el) => observer.observe(el));
      };

      observeAll();

      // Observe dynamic DOM changes (e.g., when API results appear)
      const mutationObserver = new MutationObserver(() => {
        observeAll();
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
        mutationObserver.disconnect();
      };
    }, 40);

    return () => clearTimeout(timer);
  }, [dependencyKey]);
}
