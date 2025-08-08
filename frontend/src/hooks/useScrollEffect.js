import { useState, useEffect } from 'react';

export const useScrollEffect = () => {
    const [scrollData, setScrollData] = useState({
        isScrolled: false,
        scrollY: 0
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrollData({
                isScrolled: window.scrollY > 100,
                scrollY: window.scrollY
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return scrollData;
};