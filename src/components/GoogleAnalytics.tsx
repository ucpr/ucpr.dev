"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

// Google Analytics 測定ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (!GA_MEASUREMENT_ID || !window.gtag) return;

		// ページビューのトラッキング
		const url = pathname + searchParams.toString();
		window.gtag("config", GA_MEASUREMENT_ID, {
			page_path: url,
		});
	}, [pathname, searchParams]);

	// Google Analytics が無効な場合は何も表示しない
	if (!GA_MEASUREMENT_ID) return null;

	return (
		<>
			{/* Google Analytics スクリプト */}
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
			</Script>
		</>
	);
}
