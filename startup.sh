#!/bin/bash

SRC=$HOME'/smartMirrorV2'
/usr/bin/firefox --new-window --kiosk $SRC/display/index.html
sleep 3
$SRC/voice-assistant/va/bin/python3 $SRC/voice-assistant/main.py  
