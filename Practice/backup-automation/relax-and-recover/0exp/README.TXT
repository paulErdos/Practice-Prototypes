DRY RUN: ReaR backup and restore (full walkthrough)

PART A: ON THE LAPTOP (BACKUP)

1. Put all seven scripts in one directory and cd into it. Run
   everything from there, since the config uses $PWD paths.

2. Install ReaR:
       ./install-relax-and-recover.sh

3. Create the backup and ISO (as root; the argument is the
   destination directory, e.g. your desktop):
       sudo ./create.sh /home/<user>/Desktop

   This writes /etc/rear/local.conf, then runs "rear -v mkbackup".
   When it finishes, the output is in:
       /home/<user>/Desktop/<hostname>/
   containing the ISO (rear-<hostname>.iso) and backup.tar.gz.

4. Note the full path of the directory you ran create.sh from.
   The helper scripts are copied into the ISO at that same path.


PART B: MAKE THE BOOT STICK

5. Plug in the USB stick and identify it:
       lsblk
   Write the ISO to it (this erases the stick; double-check sdX):
       sudo dd if=/home/<user>/Desktop/<hostname>/rear-<hostname>.iso \
               of=/dev/sdX bs=4M status=progress conv=fsync
   (Etcher or any "write ISO to USB" tool also works.)


PART C: BOOT THE RESCUE SYSTEM

6. Plug in the blank SSD next to the stick. Reboot the laptop and
   open the boot menu (usually F12, F10, Esc, or F2). Boot the stick.

7. At the ReaR menu, pick the "Recover <hostname>" entry.
   Log in as root (no password).


PART D: LOCATE THE ARCHIVE

8. Identify the drives:
       <dir from step 4>/list-drives.sh
   The laptop drive holds the Desktop folder; the SSD is the blank
   one.

9. Mount the laptop partition that contains /home:
       <dir from step 4>/mount-drive.sh /dev/<laptop-partition>
   It mounts at /mnt/<partition>, e.g. /mnt/sda2.

10. Confirm the archive is visible:
       ls /mnt/<partition>/home/<user>/Desktop/<hostname>/
    You should see backup.tar.gz.

11. Point ReaR at it. Edit /etc/rear/local.conf and change both the
    BACKUP_URL line to:
       BACKUP_URL=file:///mnt/<partition>/home/<user>/Desktop/
    (The URL is the folder that CONTAINS <hostname>/, not
    <hostname>/ itself.)

    Alternative to editing: bind-mount it to the original path:
       mkdir -p /home/<user>/Desktop
       mount --bind /mnt/<partition>/home/<user>/Desktop \
                    /home/<user>/Desktop


PART E: RESTORE TO THE SSD

12. Run the recovery:
       <dir from step 4>/recover-to-disk.sh

13. When ReaR asks about disk mapping, map the original laptop disk
    to the SSD. Never map onto the drive holding the archive.

14. Review the proposed layout, confirm, and let it restore.

15. When it finishes, shut down, remove the USB stick, and boot from
    the SSD (boot menu again) to verify it came up.

---

DRY RUN: ReaR backup and restore

1. Run create.sh on the laptop with a destination on the laptop's own
   drive (e.g. the desktop path). This produces the ISO and the archive.

2. Put the ISO on a USB stick, plug in the blank SSD, and boot the
   laptop from the stick.

3. In the rescue environment, run list-drives.sh to identify the
   laptop drive and the SSD.

4. Run mount-drive.sh /dev/<laptop-partition> so the archive is
   reachable.

5. Run recover-to-disk.sh, and when ReaR asks for the disk mapping,
   map the original disk to the SSD.