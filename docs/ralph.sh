#!/bin/bash

MAX_LOOPS=5
COUNT=1

echo "------------------------------------------------"
echo "Ralph Wiggum: Starting 5-Pass Subfolder Review"
echo "Target: TidalPowerFitness Docs Tree"
echo "------------------------------------------------"

while [ $COUNT -le $MAX_LOOPS ]; do
  echo "🚀 PASS $COUNT of $MAX_LOOPS"

  # Run gemini with --yolo to allow file edits.
  # 2>/dev/null hides the known Windows 'Assertion failed' crash.
  RESPONSE=$(gemini --yolo < ralph_mission.md 2>/dev/null)

  # Check if Ralph is finished
  if [[ "$RESPONSE" == *"MISSION_ACCOMPLISHED"* ]]; then
    echo "------------------------------------------------"
    echo "✅ SUCCESS: Ralph finished all subfolders!"
    exit 0
  fi

  echo "✔ Pass $COUNT complete. Moving to next pass..."
  
  ((COUNT++))
  # Brief pause to let Windows release file handles
  sleep 2
done

echo "------------------------------------------------"
echo "🛑 STOPPED: Reached 5-pass limit."
echo "Check 'git status' to see which subfolders were updated."
echo "------------------------------------------------"
