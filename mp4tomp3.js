const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

// converts all MP4 files in the same folder to MP3
ffmpeg.setFfmpegPath(ffmpegPath);
function convertMp4ToMp3(mp4FilePath, mp3FilePath) {
    return new Promise((resolve, reject) => {
        ffmpeg(mp4FilePath)
            .output(mp3FilePath)
            .on('end', () => {
                console.log(`Conversion Finished: ${mp4FilePath} -> ${mp3FilePath}`);
                resolve();
            })
            .on('error', (err) => {
                console.error(`Error during conversion of ${mp4FilePath}:`, err);
                reject(err);
            })
            .run();
    });
}

async function convertAllMp4ToMp3InFolder(folderPath) {
    fs.readdir(folderPath, async (err, files) => {
        if (err) {
            return console.error('Unable to scan directory:', err);
        }

        const mp4Files = files.filter(file => path.extname(file).toLowerCase() === '.mp4');

        for (const mp4File of mp4Files) {
            const mp4FilePath = path.join(folderPath, mp4File);
            const mp3FilePath = path.join(folderPath, path.basename(mp4File, '.mp4') + '.mp3');
            try {
                await convertMp4ToMp3(mp4FilePath, mp3FilePath);
            } catch (error) {
                console.error(`Failed to convert ${mp4File}:`, error);
            }
        }

        console.log('All conversions finished.');
    });
}

// Example usage
const folderPath = path.join(__dirname);
convertAllMp4ToMp3InFolder(folderPath);
