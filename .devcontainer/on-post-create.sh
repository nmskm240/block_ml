# !/bin/sh

npm install -g @google/gemini-cli

set -e

# tailscaled をバックグラウンドで起動
nohup tailscaled --state=/var/lib/tailscale/tailscaled.state \
  --socket=/var/run/tailscale/tailscaled.sock >/var/log/tailscaled.log 2>&1 &

# デーモンが立ち上がるまでちょっと待つ
sleep 3

# Tailscale 接続
tailscale up --ssh --hostname=${TAILSCALE_DEVICE_NAME}
