from __future__ import unicode_literals
import youtube_dl
import sys
import json


def my_hook(d):
    print(json.dumps(d))
    sys.stdout.flush()


url = sys.argv[1]
targetDir = sys.argv[2]
audioOnly = sys.argv[3]


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

try:
    ydl_opts.proxy = sys.argv[4]
except IndexError:
    print('!!! no proxy defined !!!')

with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download([url])