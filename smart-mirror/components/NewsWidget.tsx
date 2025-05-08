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
  const [containerWidth, setContainerWidth] = useState<number | null>(null); 
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news', { next: { revalidate: 60 } });
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        if (data.articles) {
          setNews(data.articles);
        } else {
          console.error('Invalid news format:', data);
          setNews([]); // fallback to empty
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]); // fallback to empty
      }
    };

    fetchNews();
  }, []);

  // Measure the width of the widest headline
  useEffect(() => {
    if (news && news.length > 0 && contentRef.current) {
      let maxWidth = 0;
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.style.font = window.getComputedStyle(contentRef.current).font;
      document.body.appendChild(tempSpan);

      news.forEach((article) => {
        tempSpan.textContent = article.title || 'No title available';
        const width = tempSpan.scrollWidth;
        if (width > maxWidth) maxWidth = width;
      });

      document.body.removeChild(tempSpan);
      setContainerWidth(maxWidth);
    }
  }, [news]);

  // Rotate ticker every 4 seconds with fade & slide
  useEffect(() => {
    if (!news || news.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true); // Start transition (fade+slide out)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
        setIsTransitioning(false); // Fade+slide back in
      }, 500); // must match transition duration
    }, 4000);

    return () => clearInterval(interval);
  }, [news]);

  return (
    <div
      className="bg-primary p-4 rounded-lg shadow-md text-white overflow-hidden"
      style={{
        width: containerWidth ? `${containerWidth}px` : 'auto', 
        transition: 'width 0.5s ease', 
      }}
    >
      <h2 className="text-lg font-semibold mb-2">📰 Latest News</h2>

      {news === null ? (
        <p className="text-sm opacity-60">Loading news...</p>
      ) : news.length > 0 ? (
        <div
          ref={contentRef}
          className={`text-sm transition-all duration-500 ease-in-out ${
            isTransitioning
              ? 'opacity-0 translate-y-2'
              : 'opacity-80 translate-y-0'
          }`}
        >
          {news[currentIndex]?.title || 'No title available'}
        </div>
      ) : (
        <p className="text-sm opacity-60">No news available</p>
      )}
    </div>
  );
};

export default NewsWidget;