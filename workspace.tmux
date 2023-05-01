#!/bin/bash
tmux new -sSvelteHelloWorldTodos 'nvim' \; \
    rename-window 'editor' \; \
    \
    new-window 'npm run dev --host' \; \
    rename-window 'server' \; \
    \
    select-window -t "editor"

