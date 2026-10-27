#!/bin/bash
set -euo pipefail

IP="${1:-192.168.11.235}"
CERT_DIR="$(dirname "$0")/certs"

mkdir -p "$CERT_DIR"

openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout "$CERT_DIR/localhost.key" \
    -out "$CERT_DIR/localhost.crt" \
    -subj "/CN=$IP" \
    -addext "subjectAltName=IP:$IP,DNS:localhost,IP:127.0.0.1" \
    -addext "basicConstraints=critical,CA:TRUE" \
    -addext "keyUsage=critical,digitalSignature,keyCertSign" \
    -addext "extendedKeyUsage=serverAuth"
    
chmod 644 "$CERT_DIR/localhost.crt"
chmod 600 "$CERT_DIR/localhost.key"

echo "Certificate generated for IP: $IP" 