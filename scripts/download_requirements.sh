#!/usr/bin/env bash
set -euo pipefail

# Directory where downloaded packages will be stored
OUTDIR=offline_packages
mkdir -p "$OUTDIR"

# Download all packages (including dependencies) listed in requirements.txt
python -m pip download -r requirements.txt -d "$OUTDIR"

echo "Downloaded packages to $OUTDIR"
