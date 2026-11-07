#!/usr/bin/env node

/**
 * Case Collection Script for Micro-UI Illustration Skill
 *
 * Copies verified SVG and PNG previews into assets/examples/ and updates
 * references/example-guide.md with metadata.
 *
 * Rules:
 * - Never overwrite existing examples.
 * - Requires both SVG and PNG.
 * - Updates the markdown table in references/example-guide.md.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const help = `
Usage:
  node scripts/collect-example.mjs --name <slug> --svg <path.svg> --png <path.png> --title <title> --features <features> --scenarios <scenarios>

Options:
  --name       Case slug name (e.g., task-complete)
  --svg        Path to editable source SVG file
  --png        Path to rendered preview PNG file
  --title      Human-readable title (e.g., "任务完成")
  --features   Core construction features (e.g., "双层折角卡片、绿色单焦点强调")
  --scenarios  Applicable scenarios (e.g., "任务结算、空状态提示")
`;

async function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const val = args[i + 1];
    if (!key.startsWith('--') || !val) {
      throw new Error(`Invalid arguments.\n${help}`);
    }
    options[key.slice(2)] = val;
  }
  return options;
}

async function main() {
  const opts = await parseArgs(process.argv);
  const { name, svg, png, title, features, scenarios } = opts;

  if (!name || !svg || !png || !title || !features || !scenarios) {
    console.error('Error: Missing required arguments.');
    console.error(help);
    process.exit(1);
  }

  // 1. Validate slug name
  if (!/^[a-z0-9_-]+$/i.test(name)) {
    throw new Error(`Invalid --name: "${name}". Must be alphanumeric with dashes/underscores.`);
  }

  // 2. Validate source files
  const svgPath = path.resolve(svg);
  const pngPath = path.resolve(png);

  try {
    const svgStat = await fs.stat(svgPath);
    if (!svgStat.isFile() || svgStat.size === 0) throw new Error('SVG file is empty or not a regular file');
  } catch (err) {
    throw new Error(`Cannot read SVG source file at: ${svgPath} (${err.message})`);
  }

  try {
    const pngStat = await fs.stat(pngPath);
    if (!pngStat.isFile() || pngStat.size === 0) throw new Error('PNG file is empty or not a regular file');
  } catch (err) {
    throw new Error(`Cannot read PNG preview file at: ${pngPath} (${err.message})`);
  }

  const svgContent = await fs.readFile(svgPath, 'utf8');
  if (!svgContent.includes('<svg')) {
    throw new Error(`File at ${svgPath} does not appear to be a valid SVG document.`);
  }

  // 3. Destination paths
  const targetDir = path.join(ROOT_DIR, 'assets', 'examples');
  await fs.mkdir(targetDir, { recursive: true });

  const destSvg = path.join(targetDir, `${name}.svg`);
  const destPng = path.join(targetDir, `${name}.png`);

  // Check collision (strictly prevent overwrite!)
  try {
    await fs.access(destSvg);
    throw new Error(`Case "${name}.svg" already exists in assets/examples/. Overwrite is not allowed. Choose a new name.`);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  try {
    await fs.access(destPng);
    throw new Error(`Case "${name}.png" already exists in assets/examples/. Overwrite is not allowed. Choose a new name.`);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  // 4. Copy files
  await fs.copyFile(svgPath, destSvg);
  await fs.copyFile(pngPath, destPng);
  console.log(`[OK] Saved SVG to assets/examples/${name}.svg`);
  console.log(`[OK] Saved PNG to assets/examples/${name}.png`);

  // 5. Update references/example-guide.md
  const guidePath = path.join(ROOT_DIR, 'references', 'example-guide.md');
  const guideContent = await fs.readFile(guidePath, 'utf8');

  const newRow = `| **${title}** | [PNG](../assets/examples/${name}.png) | [SVG](../assets/examples/${name}.svg) | ${features} | ${scenarios} |`;

  // Look for table insertion point (after the header row)
  const tableHeaderIndex = guideContent.indexOf('|---|---|---|---|---|');
  if (tableHeaderIndex === -1) {
    throw new Error('Could not find table header in references/example-guide.md');
  }

  const insertPos = tableHeaderIndex + '|---|---|---|---|---|'.length;
  const updatedContent =
    guideContent.slice(0, insertPos) +
    '\n' +
    newRow +
    guideContent.slice(insertPos);

  await fs.writeFile(guidePath, updatedContent, 'utf8');
  console.log(`[OK] Updated references/example-guide.md with new case: "${title}"`);
  console.log('Collection completed successfully!');
}

main().catch(err => {
  console.error(`[Error] ${err.message}`);
  process.exit(1);
});
