#!/usr/bin/bash

pipx install poetry --force
poetry completions bash >> ~/.bash_completion
pipx ensurepath
