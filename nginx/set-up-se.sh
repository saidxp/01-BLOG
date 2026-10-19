#!/bin/bash
set -euo pipefail

IP="${1:-10.1.13.3}"
CERT_DIR="$(dirname "$0")/certs"

mkdir -p "$CERT_DIR"

openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout "$CERT_DIR/localhost.key" \
    -out "$CERT_DIR/localhost.crt" \
    -subj "/CN=$IP" \
    -addext "subjectAltName=IP:$IP"

chmod 600 "$CERT_DIR/localhost.key"

echo "Certificate generated successfully for IP: $IP"
echo "Certificate: $CERT_DIR/localhost.crt"
echo "Private key: $CERT_DIR/localhost.key"
