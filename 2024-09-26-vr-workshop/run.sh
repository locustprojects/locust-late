#!/bin/bash

# Get the Python version using --version and extract the major version number
PYTHON_VERSION=$(python --version 2>&1)
PYTHON_MAJOR_VERSION=$(echo $PYTHON_VERSION | awk '{print $2}' | cut -d'.' -f1)

if [ "$PYTHON_MAJOR_VERSION" -eq 3 ]; then
    # If 'python' is Python 3, run 'serve.py'
    python serve.py
elif [ "$PYTHON_MAJOR_VERSION" -eq 2 ]; then
    # If 'python' is Python 2, run 'serve-python2.py'
    python serve-python2.py
else
    echo "Unsupported Python version: $PYTHON_MAJOR_VERSION"
fi


