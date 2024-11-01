import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.resolve(__dirname, 'components');
const outputFile = path.join(dir, 'index.ts');

// Helper function to automatically generate exports from components directory
function generateImports() {
  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.tsx') && file !== 'index.tsx');
  console.log(files);

  const exports = files
    .map((file) => {
      const componentName = path.basename(file, '.tsx');
      return `export {default as ${componentName}} from './${componentName}'`;
    })
    .join('\n');

  fs.writeFileSync(outputFile, exports);
  console.log(`Generated ${outputFile} with exports for ${files.length} components.`);
}
generateImports();
