#!/usr/bin/env bash

# ======
# Install Poetry
# ======

curl -sSL https://install.python-poetry.org | python3 -

# ======
# Install Node
# ======

# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash

# Point to the actual installation directory
export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# in lieu of restarting the shell
\. "$HOME/.config/nvm/nvm.sh"

# Download and install Node.js:
nvm install 24

# Verify the Node.js version:
node -v # Should print "v24.15.0".

# Verify npm version:
npm -v # Should print "11.12.1".

echo 'export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 24' >> ~/.zshrc
echo 'export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 24' >> ~/.bashrc

