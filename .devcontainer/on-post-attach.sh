# !/bin/sh

# tailscaled をバックグラウンドで起動
nohup tailscaled --state=/var/lib/tailscale/tailscaled.state \
  --socket=/var/run/tailscale/tailscaled.sock >/var/log/tailscaled.log 2>&1 &
