#!/bin/bash

# --- CONFIGURATION ---
MAX_LOOPS=5
COUNT=1
TEST_COMMAND="npm test"  # <--- UPDATE THIS (e.g., "pytest" or "npm test")
MISSION_FILE="coding_mission.md"

echo "------------------------------------------------"
echo "Ralph is Coding: TidalPowerFitness (5 Iterations)"
echo "------------------------------------------------"

while [ $COUNT -le $MAX_LOOPS ]; do
  echo "🚀 ITERATION $COUNT of $MAX_LOOPS"

  # 1. Ask Gemini to code. Redirect errors to keep terminal clean.
  # Gemini reads the files and the mission, then makes edits.
  RESPONSE=$(gemini --yolo < $MISSION_FILE 2>/dev/null)

  # 2. Run the actual tests to see if Ralph's code works
  echo "🧪 Testing Ralph's work..."
  TEST_OUTPUT=$($TEST_COMMAND 2>&1)
  TEST_RESULT=$?

  # 3. Check if tests passed AND Ralph said he's done
  if [ $TEST_RESULT -eq 0 ] && [[ "$RESPONSE" == *"MISSION_ACCOMPLISHED"* ]]; then
    echo "------------------------------------------------"
    echo "✅ SUCCESS: Tests pass and Mission is Complete!"
    exit 0
  fi

  # 4. If it failed, we append the error to a temporary log so Gemini sees it
  echo "❌ Tests failed. Sending error report to Ralph for next iteration..."
  echo -e "\n\n# ERROR FROM PREVIOUS RUN:\n$TEST_OUTPUT" > last_error.log
  
  # We make sure Gemini sees the error log in the next loop by mentioning it
  # (Ralph will automatically see the 'last_error.log' file in the folder)
  
  ((COUNT++))
  sleep 2
done

echo "------------------------------------------------"
echo "🛑 STOPPED: Reached 5 loops. Ralph is stuck."
echo "Check 'last_error.log' to see why the tests failed."
echo "------------------------------------------------"
