const { path } = require('path');
class VideosTask
{
    constructor(videoPath, subtitlePath) {
        this.inputFullPath = filePath;
        this.inputSubtitlePath = subtitlePath;
        this.videoFileName = path.basename(videoPath);
        this.videoDirName = path.dirname(videoPath);

        
    }
}