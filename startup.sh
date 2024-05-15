#!/bin/bash

SRC=$HOME'/smartMirrorV2'
/usr/bin/chromium-browser --kiosk $SRC/display/index.html &
sleep 1
$SRC/voice-assistant/va/bin/python3 $SRC/voice-assistant/main.py 1>/dev/null 2>&1 &

