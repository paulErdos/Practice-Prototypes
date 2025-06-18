#!/usr/bin/env python3
"""
YouTube Playlist URL Extractor

This script takes a YouTube playlist URL and prints all video URLs in the playlist,
one per line to stdout.

Usage:
    python playlist_extractor.py <playlist_url>

Requirements:
    pip install yt-dlp
"""

import sys
import yt_dlp
import re

def is_valid_youtube_playlist_url(url):
    """Check if the URL is a valid YouTube playlist URL."""
    patterns = [
        r'https?://(?:www\.)?youtube\.com/playlist\?.*list=[\w-]+',
        r'https?://(?:www\.)?youtube\.com/watch\?.*list=[\w-]+',
        r'https?://youtu\.be/.*\?.*list=[\w-]+'
    ]
    return any(re.search(pattern, url) for pattern in patterns)

def extract_playlist_videos(playlist_url):
    """Extract video URLs from a YouTube playlist."""
    if not is_valid_youtube_playlist_url(playlist_url):
        print(f"Error: Invalid YouTube playlist URL: {playlist_url}", file=sys.stderr)
        sys.exit(1)
    
    # Configure yt-dlp options
    ydl_opts = {
        'quiet': True,  # Suppress yt-dlp output
        'no_warnings': True,
        'extract_flat': True,  # Don't download, just extract metadata
        'playlist_items': '1-1000',  # Limit to first 1000 videos (adjust as needed)
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extract playlist information
            playlist_info = ydl.extract_info(playlist_url, download=False)
            
            if 'entries' not in playlist_info:
                print("Error: No videos found in playlist or playlist is private", file=sys.stderr)
                sys.exit(1)
            
            # Extract and print video URLs
            for entry in playlist_info['entries']:
                if entry is not None and 'url' in entry:
                    print(f"https://www.youtube.com/watch?v={entry['id']}")
                elif entry is not None and 'id' in entry:
                    print(f"https://www.youtube.com/watch?v={entry['id']}")
    
    except yt_dlp.utils.DownloadError as e:
        print(f"Error downloading playlist info: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)

def main():
    """Main function to handle command line arguments."""
    if len(sys.argv) != 2:
        print("Usage: python playlist-to-urls.py <youtube_playlist_url>", file=sys.stderr)
        print("\nExample:", file=sys.stderr)
        print("  python playl-to-urlss.py 'https://www.youtube.com/playlist?list=PLxxxxxxxxxxxxxx'", file=sys.stderr)
        sys.exit(1)
    
    playlist_url = sys.argv[1]
    extract_playlist_videos(playlist_url)

if __name__ == "__main__":
    main()
