import { useState, useEffect, useRef } from 'react';

export const useIntersectionObserver = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
        ...options
    };

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, defaultOptions);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, defaultOptions]);

    return [ref, isVisible];
};