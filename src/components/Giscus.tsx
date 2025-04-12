'use client';

import { useEffect, useRef } from 'react';

export default function Giscus() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) {
      // 既にスクリプトが読み込まれている場合は再評価
      const iframe = document.querySelector<HTMLIFrameElement>('.giscus-frame');
      if (iframe) iframe.remove();
    }

    // スクリプトを作成
    const script = document.createElement('script');
    script.src = "https://giscus.app/client.js";
    script.setAttribute('data-repo', "ucpr/ucpr.dev");
    script.setAttribute('data-repo-id', "MDEwOlJlcG9zaXRvcnkxNzg4MzY4NTM=");
    script.setAttribute('data-category', "Announcements");
    script.setAttribute('data-category-id', "DIC_kwDOCqjVdc4ChhkN");
    script.setAttribute('data-mapping', "title");
    script.setAttribute('data-strict', "0");
    script.setAttribute('data-reactions-enabled', "1");
    script.setAttribute('data-emit-metadata', "1");
    script.setAttribute('data-input-position', "top");
    script.setAttribute('data-theme', "light");
    script.setAttribute('data-lang', "ja");
    script.setAttribute('data-loading', "lazy");
    script.setAttribute('crossorigin', "anonymous");
    script.async = true;

    // コンテナにスクリプトを追加
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
      loaded.current = true;
    }

    // クリーンアップ関数
    return () => {
      if (containerRef.current) {
        const script = containerRef.current.querySelector('script');
        if (script) script.remove();
      }
    };
  }, []);

  return <div className="giscus-container" ref={containerRef} />;
}
