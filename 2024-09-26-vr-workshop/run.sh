#!/bin/bash

# Try to get the Python version using `python3` first, then fall back to `python`
if command -v python3 &>/dev/null; then
    PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
    PYTHON_CMD="python"
else
    echo "Python is not installed. Please install Python 3."
    exit 1
fi

# Get the Python version and extract the major version number
PYTHON_VERSION=$($PYTHON_CMD --version 2>&1)
PYTHON_MAJOR_VERSION=$(echo $PYTHON_VERSION | awk '{print $2}' | cut -d'.' -f1)

if [ "$PYTHON_MAJOR_VERSION" -eq 3 ]; then
    # If the Python version is 3, run `serve.py`
    $PYTHON_CMD serve.py
elif [ "$PYTHON_MAJOR_VERSION" -eq 2 ]; then
    # If the Python version is 2, run `serve-python2.py`
    $PYTHON_CMD serve-python2.py
else
    echo "Unsupported Python version: $PYTHON_MAJOR_VERSION"
    exit 1
fi