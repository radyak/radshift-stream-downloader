from __future__ import unicode_literals
import youtube_dl
import argparse, sys
import json


def my_hook(d):
    print(json.dumps(d))
    sys.stdout.flush()

parser = argparse.ArgumentParser()
parser.add_argument('--url', help='The video URL')
parser.add_argument('--dir', help='The directory to store the downloaded file(s)')
parser.add_argument('--audio-only', help='Flag, indicates if only the audio data should be downloaded')

args=parser.parse_args()

url = args.url
targetDir = args.dir
audioOnly = args.audio_only

# For options see:
# https://github.com/ytdl-org/youtube-dl/blob/3e4cedf9e8cd3157df2457df7274d0c842421945/youtube_dl/YoutubeDL.py#L137-L312

ydl_opts = {}

if audioOnly == 'True':
    ydl_opts = {
        'writethumbnail': 'True',
        'progress_hooks': [my_hook],
        'format': 'bestaudio',
        'postprocessors': [
            {
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            },
            {
                # Must be AFTER postprocessor with key 'FFmpegExtractAudio'!
                'key': 'EmbedThumbnail'
            }
        ],
        'outtmpl': targetDir + '/%(title)s.%(ext)s'
    }
else:
    ydl_opts = {
        'progress_hooks': [my_hook],
        'format': 'mp4/best',
        'outtmpl': targetDir + '/%(title)s.%(ext)s'
    }



with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download([url])