@echo off
if "%1"=="status" (
    node scripts/project_status.js
) else if "%1"=="conclude" (
    node scripts/conclude_session.js
) else (
    echo Usage: project [status^|conclude]
)
