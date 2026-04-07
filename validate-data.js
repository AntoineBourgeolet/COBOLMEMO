import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, 'src', 'data', 'data.json');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

const requiredCategoryFields = {
  id: 'string',
  title: 'string',
  description: 'string',
};

const requiredItemFields = {
  id: 'string',
  title: 'string',
  content: 'string',
  snippetTitle: 'string',
  language: 'string',
  codeSnippet: 'string',
};

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateStringFields(entry, fieldMap, entryPath, issues) {
  for (const [fieldName, expectedType] of Object.entries(fieldMap)) {
    if (typeof entry[fieldName] !== expectedType) {
      issues.push(`${entryPath}.${fieldName} doit être un ${expectedType}`);
    }
  }
}

async function main() {
  let raw;

  try {
    raw = await readFile(dataPath, 'utf8');
  } catch (error) {
    console.error(`${RED}Impossible de lire ${dataPath}${RESET}`);
    console.error(error.message);
    process.exit(1);
  }

  let data;

  try {
    data = JSON.parse(raw);
  } catch (error) {
    console.error(`${RED}Le fichier data.json contient un JSON invalide.${RESET}`);
    console.error(error.message);
    process.exit(1);
  }

  const issues = [];

  if (!isPlainObject(data)) {
    issues.push('La racine du fichier doit être un objet JSON.');
  }

  if (!Array.isArray(data.categories)) {
    issues.push('`categories` doit être un tableau.');
  }

  if (Array.isArray(data.categories)) {
    data.categories.forEach((category, categoryIndex) => {
      const categoryPath = `categories[${categoryIndex}]`;

      if (!isPlainObject(category)) {
        issues.push(`${categoryPath} doit être un objet.`);
        return;
      }

      validateStringFields(category, requiredCategoryFields, categoryPath, issues);

      if (!Array.isArray(category.items)) {
        issues.push(`${categoryPath}.items doit être un tableau.`);
        return;
      }

      category.items.forEach((item, itemIndex) => {
        const itemPath = `${categoryPath}.items[${itemIndex}]`;

        if (!isPlainObject(item)) {
          issues.push(`${itemPath} doit être un objet.`);
          return;
        }

        validateStringFields(item, requiredItemFields, itemPath, issues);

        if (!Array.isArray(item.tags)) {
          issues.push(`${itemPath}.tags doit être un tableau de strings.`);
          return;
        }

        const invalidTagIndex = item.tags.findIndex((tag) => typeof tag !== 'string');
        if (invalidTagIndex !== -1) {
          issues.push(`${itemPath}.tags[${invalidTagIndex}] doit être une string.`);
        }
      });
    });
  }

  if (issues.length > 0) {
    console.error(`${RED}Validation échouée pour src/data/data.json :${RESET}`);
    issues.forEach((issue) => console.error(` - ${issue}`));
    process.exit(1);
  }

  const itemCount = data.categories.reduce((total, category) => total + category.items.length, 0);
  console.log(
    `${GREEN}✅ Validation réussie : ${data.categories.length} catégories et ${itemCount} items conformes.${RESET}`,
  );
}

await main();
