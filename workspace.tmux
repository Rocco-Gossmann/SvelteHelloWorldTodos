#!/bin/bash

tmux-workspace "SvelteKitHelloWorld" "editor" \
    -w "Server" -c "pnpm run dev --host --open"

