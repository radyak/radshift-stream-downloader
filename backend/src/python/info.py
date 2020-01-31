from __future__ import unicode_literals
import youtube_dl
import sys
import json


url = sys.argv[1]


def my_hook(d):
    print(d)
    sys.stdout.flush()


ydl_opts = {
    'progress_hooks': [my_hook],
}


with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    info = ydl.extract_info(url, False)
    print(json.dumps(info))