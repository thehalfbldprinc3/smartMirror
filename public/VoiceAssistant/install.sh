#!/bin/bash

# List of packages to install
packages=(
    "speech_recognition"
    "wolframalpha"
    "pyttsx3"
    "wikipedia"
    "SpeechRecognition"
    "ecapture"
    "pyjokes"
    "twilio"
    "requests"
    "beautifulsoup4"
    "pyaudio"
    "clint"
    "pywin32"
    "datetime"
    "random"
)

# Install each package using pip
for package in "${packages[@]}"; do
    pip install "$package"
done