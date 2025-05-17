'use client';

import { useEffect, useState, useRef } from 'react';

type NewsArticle = {
  title: string;
  description?: string;
  url?: string;
  source?: {
    name: string;
  };
};

const NewsWidget = () => {
  const [news, setNews] = useState<NewsArticle[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentWidth, setContentWidth] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news', { next: { revalidate: 60 } });
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        setNews(data.articles || []);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (!news || news.length === 0) return;

    const calculateMaxWidth = () => {
      if (!contentRef.current) return;

      const font = window.getComputedStyle(contentRef.current).font || '14px sans-serif';
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      context.font = font;
      let maxWidth = 0;
      for (const article of news) {
        const text = article.title || 'No title available';
        const metrics = context.measureText(text);
        maxWidth = Math.max(maxWidth, metrics.width);
      }

      // Add buffer space
      setContentWidth(maxWidth + 160); // ~160px to account for title + paddings
    };

    calculateMaxWidth();
  }, [news]);

  useEffect(() => {
    if (!news || news.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
        setIsTransitioning(false);
      }, 300); // Shorter transition for quicker switch
    }, 4000);

    return () => clearInterval(interval);
  }, [news]);

  const currentHeadline = news?.[currentIndex]?.title || 'No title available';

  return (
    <div
      className="rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white relative overflow-hidden flex items-center gap-6 px-6 py-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
      style={{
        width: `${Math.max(contentWidth, 300)}px`,
        transition: 'width 0.5s ease',
        minHeight: '60px',
      }}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none z-0" />

      {/* Widget Title */}
      <h2 className="flex items-center gap-2 text-lg font-semibold whitespace-nowrap z-10 relative">
        <span role="img" aria-label="newspaper"></span> Latest News
      </h2>

      {/* Content */}
      {news === null ? (
        <p className="text-sm text-gray-300 animate-pulse truncate z-10 relative">
          Loading news...
        </p>
      ) : news.length === 0 ? (
        <p className="text-sm text-gray-400 truncate z-10 relative">
          No news available
        </p>
      ) : (
        <div
          ref={contentRef}
          className={`text-sm font-light transition-all duration-300 ease-in-out truncate z-10 relative ${
            isTransitioning ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'
          }`}
          style={{ minHeight: '1.5rem' }}
          title={currentHeadline}
        >
          {currentHeadline}
        </div>
      )}
    </div>
  );
};

export default NewsWidget;