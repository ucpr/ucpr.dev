---
title: "Neovimのプラグイン管理をdpp.vimに移行した"
description: "Neovimのプラグイン管理をdpp.vimに移行しました"
publishedAt: "2024-05-09"
tags: ["neovim"]
---

## はじめに

以前までは Neovim のプラグイン管理に [packer.nvim](https://github.com/wbthomason/packer.nvim) を使用していましたが、2023 年の 8 月からメンテナンスが停止していました。そのため、プラグイン管理を以前から気になっていた [dpp.vim](https://github.com/Shougo/dpp.vim) に移行しました。

本記事では、移行後の構成やハマりポイントについて紹介します。
設定は下記のリポジトリで公開しています。

[[カードOGP:github.com/ucpr/dotfiles/nvim]](https://github.com/ucpr/dotfiles/tree/master/nvim)

## 前提

この記事内では、以下のバージョンの Neovim を使用しています。

```bash
$ nvim --version                       
NVIM v0.10.0-dev-3085+gb024543ca
Build type: RelWithDebInfo
LuaJIT 2.1.1713484058
Run "nvim -V1 -v" for more info
```

## dpp.vim とは

[dpp.vim](https://github.com/Shougo/dpp.vim) は、dark powered plugin でおなじみの Shougo さんが開発している Vim のプラグイン管理ツールです。デフォルトでは何もできず、ユーザーが設定を追加することですべてをコントロールできるようになっています。

詳しくは、Shougo さんが書かれた以下の記事を参照すると良いと思います。

- [プラグインマネージャーの歴史と新世代のプラグインマネージャー dpp.vim | zenn.dev](https://github.com/Shougo/dein.vim)

## 移行

### 移行の方針

移行にあたっては、下記の方針で進めました。

- [dein.vim](https://github.com/Shougo/dein.vim) のように toml でプラグインを管理する
- 基本的に遅延読み込みを行う
- プラグインの設定は `lua` で行う
- プラグインの設定はそのまま移行する

### セットアップ

セットアップのほとんどは下記の記事を参考にさせていただきました。

- [Neovimでdpp.vimをセットアップする | zenn.dev](https://zenn.dev/comamoca/articles/howto-setup-dpp-vim)

extension も記事と同じく下記を使用しました。

- [Shougo/dpp-ext-toml](https://github.com/Shougo/dpp-ext-toml)
- [Shougo/dpp-ext-lazy](https://github.com/Shougo/dpp-ext-lazy)
- [Shougo/dpp-ext-installer](https://github.com/Shougo/dpp-ext-installer)
- [Shougo/dpp-protocol-git](https://github.com/Shougo/dpp-protocol-git)

### toml でのプラグイン管理

[dein.vim](https://github.com/Shougo/dein.vim) の設定と同じように記述できたので、以下を意識しつつ移行を進めました。

- `on_event` でプラグインの読み込みタイミングを設定
- 基本的に `hooks_file` で別ファイルでプラグインの設定を記述
  - `lua_add`, `lua_source` などを直接使うときは 1, 2 行で記述できる範囲にする

## 移行の結果

### toml でのプラグイン管理

移行後は toml でプラグインを管理するようになりました。プラグインの追加や削除がしやすくなり、管理が容易になったと思います。

```toml
[[plugins]]
repo = 'navarasu/onedark.nvim'
on_event = 'VimEnter'
hooks_file = '$XDG_CONFIG_HOME/nvim/lua/plugins/colorscheme/onedark.lua'
```

```toml
-- lua_source {{{
require("onedark").setup {
  style = "darker",
}
--- }}}

-- lua_post_source {{{
require("onedark").load()
--- }}}
```

`hooks_file` で設定するようにすることで、純粋に `lua_add`, `lua_source` などに文字列として Lua コードを記述しなくて良くなったため、LSP やその他ツールのサポートを受けながら設定を記述しやすくなったと感じています。

### Neovim の起動速度

移行時に意識して設定をしていたわけではないですが、移行した結果 Neovim の起動速度を向上させることができました。
移行前は 50ms ほどかかっていた Neovim の起動時間が、移行後は 30ms ほどに短縮されました。

```bash
$ vim-startuptime -vimpath=nvim | less

Extra options: []
Measured: 10 times

Total Average: 29.352300 msec
Total Max:     30.001000 msec
Total Min:     28.879000 msec
```

[vim-startuptime](https://github.com/rhysd/vim-startuptime) おすすめです。

## ハマりポイント

### プラグインを追加してもインストールがされない, 設定が読み込まれない

移行後、新しくプラグインを追加してもインストールがされない、設定を更新しても読み込まれないという問題が発生しました。
暫定の対応として、都度 cache にある state のファイルを消してリセットすることで対応しました。

```bash
$ rm -r $XDG_CACHE_HOME/dpp/nvim/*
```

このあたりの state 周りなどを理解しきれていないため、今後理解を深めていきたいと思います。

### treesitter で parser が毎回ダウンロードとビルドが走る

直接 dpp.vim への移行時のハマり点とは関係ありませんが、 nvim-treesitter をインストールして有効化したところ、なぜか parser が毎回ダウンロードとビルドが走るようになりました。
packer.nvim で設定していた際は問題ありませんでしたが、移行に際して発生するようになってしまいました。

最終的な解決策としては、nvim-treesitter の README に記載されていた以下の設定を追加しました。

- ref. [Changing the parser install directory | nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)

```lua
local pasers_path = vim.fn.expand("$XDG_CACHE_HOME/nvim/treesitter/parsers")
vim.opt.runtimepath:append(pasers_path)

require 'nvim-treesitter.configs'.setup {
  parser_install_dir = pasers_path,
-- ...
}
```

## おわりに

Neovim のプラグイン管理を dpp.vim に移行しました。移行後は Neovim の起動速度が向上し、快適に使用できています。 
dpp.vim (dein.vim) の機能である `hooks_file` でマーカーの設定を元に `lua_add`、 `lua_source` ... を設定できたりなど、知らないうちに便利な機能が増えていてとても良かったです。

本記事において、異なっている設定名や表現がありましたらご連絡ください。

## 参考

- [github.com/wbthomason/packer.nvim](https://github.com/wbthomason/packer.nvim)
- [github.com/Shougo/dpp.vim](https://github.com/Shougo/dpp.vim)
- [github.com/Shougo/dein.vim](https://github.com/Shougo/dein.vim)
- [github.com/nvim-treesitter/nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)
- [2年間ほとんどメンテしていなかったinit.luaを整理した話 | zenn.dev](https://zenn.dev/vim_jp/articles/2024-02-11-vim-update-my-init-lua)
- [Neovimでdpp.vimをセットアップする | zenn.dev](https://zenn.dev/comamoca/articles/howto-setup-dpp-vim)
