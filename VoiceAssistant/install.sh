#!/bin/bash

sudo apt install portaudio19-dev

# Tuple of packages to install
packages=(
    "wheel"
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
    "datetime"
    "gtts"
    "pydub"
)

# Install each package using pip
for package in "${packages[@]}"; do
    pip3 install "$package"
done


