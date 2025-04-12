"use client";

import { getPlatformStyle } from "@/utils/platform";

type PlatformBadgeProps = {
  platform: string;
  className?: string;
};

/**
 * 外部記事のプラットフォームを表すバッジコンポーネント
 * プラットフォームごとに異なった背景色と文字色を持ちます
 */
export default function PlatformBadge({ platform, className = "" }: PlatformBadgeProps) {
  const style = getPlatformStyle(platform);
  
  return (
    <span 
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium platform-tag border ${className}`}
      style={{
        borderColor: style.textColor,
        color: style.textColor,
        '--dark-border': style.darkTextColor,
        '--dark-text': style.darkTextColor,
      } as React.CSSProperties}
    >
      {platform}
    </span>
  );
}
