#!/bin/sh

echo "Installing gemini-cli"
npm install -g @google/gemini-cli

set -e

echo "Start up tailscaled"
nohup tailscaled --state=/var/lib/tailscale/tailscaled.state \
  --socket=/var/run/tailscale/tailscaled.sock >/var/log/tailscaled.log 2>&1 &

# デーモンが立ち上がるまでちょっと待つ
sleep 3

echo "Regist tailnet"
tailscale up --ssh --hostname=${TAILSCALE_DEVICE_NAME}

# Setup Python Virtual Environment
echo "Creating python virtual environment..."
python3 -m venv .venv
echo "Installing python dependencies..."
.venv/bin/pip install -r .devcontainer/requirements.txt
