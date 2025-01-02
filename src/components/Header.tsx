import type { Component } from "solid-js";

const Header: Component = () => {
  return (
    <header class="p-4 container mx-auto flex justify-between items-center">
      <a class="text-lg font-bold underline" href="/">
        # ucpr.dev
      </a>
      <nav>
        <ul class="flex space-x-5">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/articles">Articles</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
