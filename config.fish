# lives in ~/.config/fish/config.fish
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
if test -f /opt/anaconda3/bin/conda
    eval /opt/anaconda3/bin/conda "shell.fish" "hook" $argv | source
else
    if test -f "/opt/anaconda3/etc/fish/conf.d/conda.fish"
        . "/opt/anaconda3/etc/fish/conf.d/conda.fish"
    else
        set -x PATH "/opt/anaconda3/bin" $PATH
    end
end
# <<< conda initialize <<<

# source ~/.config/fish/functions/nvm.fish
fish_add_path /opt/homebrew/bin
function fish_prompt
    set_color green
    echo -n (prompt_pwd)
    set_color normal
    echo -n "🐟> "
end

direnv hook fish | source

# add this to each dir that has need to 'venv' 
# echo 'layout python3' > .envrc
# direnv allow
