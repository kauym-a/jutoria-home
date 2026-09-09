import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import axios from 'axios';

// NOTE: This script reads the Excel master and the PRODUCT-MASTER image folders
// and generates src/data/products.json and src/data/products-image-manifest.json.
// It is written in TypeScript to match the project. Run with ts-node or compile before running.

// Configuration - adjust if your workspace differs
const PROJECT_ROOT = path.resolve(process.cwd());
const PRODUCT_MASTER_DIR = path.resolve(PROJECT_ROOT, 'PRODUCT-MASTER');
const EXCEL_PATH = path.resolve(PRODUCT_MASTER_DIR, 'PRODUCT-DATA', 'FOR LISTING JUTORIA_Product_Data_Collection (2).xlsx');
const OUTPUT_DATA_DIR = path.resolve(PROJECT_ROOT, 'src', 'data');

// Utility helpers
const normalizeToken = (s: string | undefined) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '');

async function httpHeadExists(url: string) {
  try {
    const resp = await axios.head(url, { timeout: 5000 });
    return resp.status >= 200 && resp.status < 400;
  } catch (e) {
    return false;
  }
}

async function main() {
  console.log('Generator: starting product JSON generation.');

  if (!fs.existsSync(EXCEL_PATH)) {
    console.error('Excel file not found at', EXCEL_PATH);
    process.exit(1);
  }

  // Lazy-load excel reading using slow but reliable xlsx library
  const xlsxMod = await import('xlsx');
  const xlsx = xlsxMod.default || xlsxMod;
  const workbook = xlsx.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  // Read image folders under PRODUCT-MASTER
  const folders = fs.readdirSync(PRODUCT_MASTER_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  // Build quick folder->files map
  const folderFiles: Record<string, string[]> = {};
  for (const f of folders) {
    const folderPath = path.join(PRODUCT_MASTER_DIR, f);
    try {
      const files = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(x => x.isFile())
        .map(x => x.name);
      folderFiles[f] = files;
    } catch (e) {
      folderFiles[f] = [];
    }
  }

  const products: any[] = [];
  const manifest: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const sku = (row['SKU'] || row['Sku'] || row['sku'] || '').toString().trim();
    const productName = (row['Product Name'] || row['ProductName'] || row['product name'] || '').toString();

    const tokens = new Set<string>();
    [sku, productName, row['Material Composition'], row['Color']].forEach(v => {
      if (!v) return;
      const parts = v.toString().split(/[^a-zA-Z0-9]+/).filter(Boolean);
      parts.forEach(p => tokens.add(normalizeToken(p)));
    });

    // Manual overrides (authoritative mappings approved by user)
    const OVERRIDES: Record<string,string> = {
      // SKU => exact on-disk folder name
      'JTR-SPM-NAT-RND-14-S6': 'sea-grass-natura',
      'JTR-JPM-NAT-RND-14-S6': 'jute-cotton-natural'
    };

    // Find best matching folder by token overlap
    let bestFolder: string | null = null;
    let bestScore = 0;

    // If an override exists for this SKU, use it (do not rename or move folders)
    if (sku && OVERRIDES[sku]) {
      const overrideFolder = OVERRIDES[sku];
      if (Object.prototype.hasOwnProperty.call(folderFiles, overrideFolder)) {
        bestFolder = overrideFolder;
        // mark as very high confidence
        bestScore = Number.MAX_SAFE_INTEGER;
      } else {
        // fallback to token-based if override folder not present on disk
        console.warn(`Override folder ${overrideFolder} for SKU ${sku} not found on disk; falling back to token matching.`);
      }
    }

    if (!bestFolder) {
      for (const folder of Object.keys(folderFiles)) {
        const fnorm = normalizeToken(folder);
        let score = 0;
        for (const t of tokens) {
          if (fnorm.includes(t)) score++;
        }
        if (score > bestScore) { bestScore = score; bestFolder = folder; }
      }
    }

    const images: any[] = [];
    let image_matching_confidence = 'UNVERIFIED';
    if (bestFolder && folderFiles[bestFolder] && folderFiles[bestFolder].length > 0) {
      image_matching_confidence = bestScore > 0 ? 'high' : 'medium';
      for (const fn of folderFiles[bestFolder]) {
        const fnameNorm = fn.toLowerCase();
        let role = 'gallery';
        const explicitPrimaryOverride = sku === 'JTR-SPM-NAT-RND-14-S6' && bestFolder === 'sea-grass-natura' && fn === 'sea-grass-natural.png';
        if (explicitPrimaryOverride) {
          role = 'primary';
        } else if (fnameNorm.includes('single') || fnameNorm.includes('product')) role = 'primary';
        else if (fnameNorm.includes('lifestyle')) role = 'lifestyle';
        else if (fnameNorm.includes('closeup')) role = 'closeup';
        else if (fnameNorm.includes('set')) role = 'set';
        else if (fnameNorm.includes('pk') || fnameNorm.includes('pack')) role = 'packaging';
        else if (fnameNorm.includes('dm')) role = 'dm';

        const urlPath = '/product-master/' + encodeURIComponent(bestFolder) + '/' + encodeURIComponent(fn);
        images.push({ filename: fn, role, url: urlPath, confidence: 'high' });
        manifest.push({ sku, folder: bestFolder, filename: fn, url: urlPath, role, confidence: 'high' });
      }
    } else {
      image_matching_confidence = 'UNVERIFIED';
    }

    const product = {
      sku: sku || `UNVERIFIED-${i}`,
      name: productName || '',
      image_folder: bestFolder || null,
      images,
      excel_fields: row,
      sku_row_index: i + 2,
      notes: {
        image_matching_confidence,
        unverified: [] as string[],
      }
    };

    if (!sku) product.notes.unverified.push('SKU missing');
    products.push(product);
  }

  // Ensure output dir exists
  if (!fs.existsSync(OUTPUT_DATA_DIR)) fs.mkdirSync(OUTPUT_DATA_DIR, { recursive: true });

  const productsPath = path.join(OUTPUT_DATA_DIR, 'products.json');
  const manifestPath = path.join(OUTPUT_DATA_DIR, 'products-image-manifest.json');

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log('Written products to', productsPath);
  console.log('Written manifest to', manifestPath);

  // Optional HTTP HEAD checks for image accessibility
  console.log('Performing HTTP HEAD checks (development server must be serving /product-master/)...');
  for (const m of manifest) {
    const accessible = await httpHeadExists('http://localhost:5173' + m.url);
    m.accessible = accessible;
    if (!accessible) {
      m.note = 'inaccessible — check dev server static mount or production hosting mapping';
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Updated manifest with accessibility flags at', manifestPath);

  console.log('Generator: done.');
}

main().catch(err => { console.error(err); process.exit(1); });
