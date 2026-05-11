const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ffmpeg = require('ffmpeg-static');
const videosDir = path.join(__dirname, 'Projects Vids School');

for (const fileName of fs.readdirSync(videosDir)) {
  if (!/\.(mov|MOV)$/.test(fileName)) {
    continue;
  }

  const inputPath = path.join(videosDir, fileName);
  const outputPath = path.join(videosDir, `${path.basename(fileName, path.extname(fileName))}.mp4`);

  const result = spawnSync(
    ffmpeg,
    [
      '-y',
      '-i', inputPath,
      '-vf', "scale='min(1280,iw)':-2",
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '28',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      outputPath,
    ],
    { stdio: 'inherit' }
  );

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}