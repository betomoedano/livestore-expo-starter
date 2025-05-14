#!/usr/bin/env bash

for UDID in $(xcrun simctl list devices | grep Booted | grep -oE '[0-9A-F-]{36}'); do
  # get the app’s data container
  APP_DATA=$(xcrun simctl get_app_container "$UDID" host.exp.Exponent data 2>/dev/null)
  # if it exists, find and open the livestore SQLite folder
  if [[ -d "$APP_DATA" ]]; then
    LIVESTORE_DIR=$(find "$APP_DATA" \
      -path "*/Documents/ExponentExperienceData/*livestore-expo*" \
      -print -quit)
    if [[ -d "$LIVESTORE_DIR/SQLite" ]]; then
      open "$LIVESTORE_DIR/SQLite"
    else
      echo "No livestore-expo folder on $UDID"
    fi
  else
    echo "host.exp.Exponent not installed on $UDID"
  fi
done

# make it executable
# chmod +x ./open-LiveStore-folder.bash

# run it
# ./open-LiveStore-folder.bash
