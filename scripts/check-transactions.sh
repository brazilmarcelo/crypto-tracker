#!/bin/bash
# Check transactions every 20 minutes
# Add to crontab: */20 * * * * cd /path/to/crypto-tracker && npm run check:transactions

cd /Users/marcelobrazil/dev/blockchain

export DATABASE_URL="postgresql://postgres:gQb0wmwwH4bADIX1yNuDZXTZCpImXWAq@65.21.48.61:5432/crypto"
export WUZAPI_URL="http://localhost:8080"
export WUZAPI_TOKEN="wuzapi-1776460065050-o2z3uch84"
export ETHERSCAN_API_KEY="T76YNMFN1VE15G6Y5BVBCFM1DDB7DPJJ81"
export NEXTAUTH_URL="http://localhost:3000"

npx tsx scripts/check-transactions.ts