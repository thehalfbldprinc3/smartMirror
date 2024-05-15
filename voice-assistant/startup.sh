#!/bin/bash

SRC=$HOME'/smartMirrorV2'
/usr/bin/chromium-browser --kiosk $SRC/public/index.html &
$SRC/voice-assistant/va/bin/python3 $SRC/voice-assistant/main.py

