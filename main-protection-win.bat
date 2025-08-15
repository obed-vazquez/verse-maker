@echo off
setlocal enabledelayedexpansion

set HOOKS_FOLDER=.git\hooks
set HOOK_FILE=%HOOKS_FOLDER%\pre-push

echo #^^!/bin/bash > %HOOK_FILE%
echo. >> %HOOK_FILE%
echo protected_branches=("main" "master" "development") >> %HOOK_FILE%
echo. >> %HOOK_FILE%
echo while read -r local_ref local_sha remote_ref remote_sha >> %HOOK_FILE%
echo do >> %HOOK_FILE%
echo   for branch in "${protected_branches[@]}" >> %HOOK_FILE%
echo   do >> %HOOK_FILE%
echo       if ^[^[ ^$remote_ref == refs/heads/^$branch ^]^] >> %HOOK_FILE%
echo       then >> %HOOK_FILE%
echo.         echo ^>^&2 "Pushing to branch $branch is not allowed. To push to this branch:" >> %HOOK_FILE%
echo.         echo ^>^&2 "1) Create a new branch with the commits you already have: 'git branch new-branch'" >> %HOOK_FILE%
echo.         echo ^>^&2 "2) Make sure you know how many commits you need to go back and the number of commits will be called 'n'" >> %HOOK_FILE%
echo.         echo ^>^&2 "3) Move master back by n commits (this will delete the commits from master but not from your new branch): 'git reset --hard HEAD~n'" >> %HOOK_FILE%
echo.         echo ^>^&2 "4) Checkout from the new branch and then push from there and generate a Pull Request to this branch: 'git checkout new-branch'" >> %HOOK_FILE%
echo          exit 1 >> %HOOK_FILE%
echo       fi >> %HOOK_FILE%
echo     done >> %HOOK_FILE%
echo done >> %HOOK_FILE%
echo exit 0 >> %HOOK_FILE%

echo Created pre-push hook successfully, now `push`es are blocked on the main branches.
pause
exit
REM endlocal
