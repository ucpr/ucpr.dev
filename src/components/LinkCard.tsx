import type { Component } from "solid-js";

type LinkCardProps = {
  title: string;
  url: string;
};

const getFaviconUrl = (url: string) => {
  const { hostname } = new URL(url);
  return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
};

/*
 * TODO:
 *  - OGP 画像を取得して表示する
 *  - ページの title, description を取得して表示する
 * */
const LinkCard: Component<LinkCardProps> = (props) => {
  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      class="block rounded border hover:shadow transition duration-300 ease-in-out my-4"
    >
      <div class="flex items-center">
        <img
          class="w-12 h-12 m-4 item-center"
          src={getFaviconUrl(props.url)}
          alt={`${props.title} favicon`}
        />
        <div class="px-6 py-4">
          <div class="font-bold text-sm mb-2">{props.title}</div>
        </div>
      </div>
    </a>
  );
};

export default LinkCard;
