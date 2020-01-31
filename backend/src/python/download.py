from __future__ import unicode_literals
import youtube_dl
import sys
import json


def my_hook(d):
    print(json.dumps(d))
    sys.stdout.flush()


class MyLogger(object):
    def debug(self, msg):
        pass

    def warning(self, msg):
        pass

    def error(self, msg):
        print(msg)


url = sys.argv[1]
audioOnly = sys.argv[2]


audioPostProcessor = {
    'key': 'FFmpegExtractAudio',
    'preferredcodec': 'mp3',
    'preferredquality': '192',
}

postProcessors = [audioPostProcessor] if audioOnly == 'True' else []

ydl_opts = {
    # 'logger': MyLogger(),
    'progress_hooks': [my_hook],
    'format': 'bestaudio/best',
    'postprocessors': postProcessors,
}



with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download([url])