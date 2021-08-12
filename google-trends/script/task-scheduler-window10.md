# Task scheduler on Window 10

1. Open Task Scheduler

2. Create a new task

3. In the "General" tab - ensure the following settings are entered:

    * "When running the task, use the following user account": Admin
    * "Run whether user is logged on or not"
    * "Run with highest privileges"
    * "Configure For" (your operating system)

4. In the "Triggers" tab, when adding a trigger
    * Begin the task: At startup
    * Ensure that the "Enabled" checkbox is checked

5. In the "Actions" tab
    * Create new action link to file "pm2-crawl.bat"
    * "Program/script" :
        * Eg: "..\google-trends\script\pm2-start.bat"
    * "Add arguments (optional)"
        * Eg: **space here** >> "..\etc\.pm2\logs\logs-taskscheduler.txt" 2>&1