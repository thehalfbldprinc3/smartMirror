#!/bin/bash

# Tuple of packages to install
packages=(
    "SpeechRecognition"
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
    "gtts"
    "pydub"
)

# Install each package using pip
for package in "${packages[@]}"; do
    pip3 install "$package"
done
