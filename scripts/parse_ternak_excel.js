import fs from 'fs';
import path from 'path';

function parseWorksheetXml(xmlContent) {
  const rows = [];
  const rowMatches = xmlContent.match(/<row r="(\d+)"[^>]*>(.*?)<\/row>/gs) || [];

  for (const rowXml of rowMatches) {
    const rowMatch = rowXml.match(/^<row r="(\d+)"/);
    const rowNum = parseInt(rowMatch[1], 10);
    const cells = {};

    const cellRegex = /<c r="([A-Z]+)\d+"([^>]*)>(.*?)<\/c>/gs;
    let match;
    while ((match = cellRegex.exec(rowXml)) !== null) {
      const col = match[1];
      const attrs = match[2];
      const body = match[3];

      let val = null;
      if (attrs.includes('t="inlineStr"')) {
        const tMatch = body.match(/<is><t>([\s\S]*?)<\/t><\/is>/);
        val = tMatch ? tMatch[1] : '';
      } else {
        const vMatch = body.match(/<v>([\s\S]*?)<\/v>/);
        if (vMatch) {
          const raw = vMatch[1];
          val = !isNaN(raw) && raw.trim() !== '' ? Number(raw) : raw;
        } else {
          val = '';
        }
      }
      cells[col] = val;
    }
    rows.push({ rowNum, cells });
  }

  if (rows.length === 0) return [];

  const headerRow = rows.find(r => r.rowNum === 1);
  if (!headerRow) return [];

  const headers = headerRow.cells;
  const colKeys = Object.keys(headers).sort();

  const data = [];
  for (const r of rows) {
    if (r.rowNum === 1) continue;
    const obj = {};
    for (const col of colKeys) {
      const headerName = headers[col];
      if (headerName) {
        obj[headerName] = r.cells[col] !== undefined ? r.cells[col] : null;
      }
    }
    data.push(obj);
  }
  return data;
}

function parseWorkbook(dir) {
  const wbXmlPath = path.join(dir, 'xl', 'workbook.xml');
  if (!fs.existsSync(wbXmlPath)) {
    throw new Error(`Workbook not found at ${wbXmlPath}`);
  }
  const wbXml = fs.readFileSync(wbXmlPath, 'utf8');
  
  const sheetRegex = /<sheet[^>]*name="([^"]+)"[^>]*sheetId="(\d+)"/g;
  const sheets = [];
  let sMatch;
  while ((sMatch = sheetRegex.exec(wbXml)) !== null) {
    sheets.push({ name: sMatch[1], id: sMatch[2] });
  }

  const result = {};
  for (const s of sheets) {
    const sheetFile = path.join(dir, 'xl', 'worksheets', `sheet${s.id}.xml`);
    if (fs.existsSync(sheetFile)) {
      const xml = fs.readFileSync(sheetFile, 'utf8');
      result[s.name] = parseWorksheetXml(xml);
    } else {
      console.warn(`Worksheet file missing: ${sheetFile}`);
      result[s.name] = [];
    }
  }
  return result;
}

const rootDir = process.cwd();
const ternakDir = path.join(rootDir, 'data', '_tmp_ternak');

console.log('Parsing Petung Ternak Loro Geblak...');
const ternakData = parseWorkbook(ternakDir);
fs.writeFileSync(path.join(rootDir, 'data', 'ternak_parsed.json'), JSON.stringify(ternakData, null, 2), 'utf8');
console.log('Ternak parsed successfully, sheets:', Object.keys(ternakData));
