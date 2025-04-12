"use client";

import { FC, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import OgpCardLink from "./OgpCardLink";

interface ArticleContentProps {
	content: string;
}

const ArticleContent: FC<ArticleContentProps> = ({ content }) => {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current) {
			const ogpElements = contentRef.current.querySelectorAll(
				"[data-ogp-card-link]",
			);
			ogpElements.forEach((element) => {
				const title = element.getAttribute("data-title");
				const url = element.getAttribute("data-url");

				if (url) {
					// Clear the element's content
					while (element.firstChild) {
						element.removeChild(element.firstChild);
					}

					// Create a new React root and render the OgpCardLink component
					const root = document.createElement("div");
					element.appendChild(root);
					const props = { title: title || undefined, url };

					// 一意のIDを持つコンテナを作成
					const id = `ogp-card-${Math.random().toString(36).substring(7)}`;
					root.innerHTML = `<div id="${id}"></div>`;
					const container = document.getElementById(id);

					if (container) {
						ReactDOM.createRoot(container).render(<OgpCardLink {...props} />);
					}
				}
			});
		}
	}, [content]);

	return (
		<div
			ref={contentRef}
			className="article-content"
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	);
};

export default ArticleContent;
