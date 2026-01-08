@echo off
if "%1"=="session" (
    node scripts/conclude_session.js
) else (
    echo Usage: end session
)
