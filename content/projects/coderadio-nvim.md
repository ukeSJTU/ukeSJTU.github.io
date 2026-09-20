---
slug: coderadio-nvim
name: coderadio.nvim
description: A Neovim plugin for streaming freeCodeCamp Code Radio, with live track metadata, volume controls, and statusline integration.
year: 2025
order: 2
source: https://github.com/ukeSJTU/coderadio.nvim
---

`coderadio.nvim` brings [freeCodeCamp Code Radio](https://coderadio.freecodecamp.org/)
into Neovim, so I can start a coding soundtrack without leaving the editor.
It provides commands for playback and volume, a floating window with the current
track, and optional statusline integration.

## How it works

The plugin uses `mpv` for audio playback and follows Code Radio’s live track
updates through Server-Sent Events. When `socat` is available, it talks to
`mpv` over IPC so volume changes stay smooth and do not restart the stream.

Install it with your Neovim plugin manager, then run `:CodeRadioPlay`. The
plugin does not create key mappings unless you explicitly enable them.
