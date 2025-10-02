Give this a port, and it will watch that port.
If it sees the port as up, it will write down in a file, 1, for up.
If it sees the port as down, it will replace the file with a 0, for down.

A process will watch the file for changes.
It will log changes it notices. E.g.,

Process on <port> went down at <time>
Process on <port> went   up at <time>

It will include a script to set itself up as a cron job.
And also will include a script to remove the cron job.

