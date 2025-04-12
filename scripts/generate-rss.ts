import { generateRssFile } from '../src/utils/rss';

async function main() {
  console.log('Generating RSS files...');
  try {
    await generateRssFile();
    console.log('RSS files generated successfully!');
  } catch (error) {
    console.error('Error generating RSS files:', error);
    process.exit(1);
  }
}

main();
