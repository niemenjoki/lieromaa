import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(testDir, '..');
const supportedExtensions = ['', '.js', '.mjs', '.json'];

function resolveAliasSpecifier(specifier) {
  if (!specifier.startsWith('@/')) {
    return null;
  }

  const relativePath = specifier.slice(2);
  return path.resolve(rootDir, relativePath);
}

function resolveFilePath(candidatePath) {
  for (const extension of supportedExtensions) {
    const nextPath = `${candidatePath}${extension}`;
    if (fs.existsSync(nextPath) && fs.statSync(nextPath).isFile()) {
      return nextPath;
    }
  }

  if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isDirectory()) {
    for (const extension of supportedExtensions.slice(1)) {
      const indexPath = path.join(candidatePath, `index${extension}`);
      if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
        return indexPath;
      }
    }
  }

  return null;
}

export async function resolve(specifier, context, nextResolve) {
  const aliasPath = resolveAliasSpecifier(specifier);
  if (!aliasPath) {
    return nextResolve(specifier, context);
  }

  const resolvedPath = resolveFilePath(aliasPath);
  if (!resolvedPath) {
    throw new Error(`Unable to resolve aliased specifier "${specifier}"`);
  }

  return {
    shortCircuit: true,
    url: pathToFileURL(resolvedPath).href,
  };
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.json')) {
    const filePath = fileURLToPath(url);
    const source = fs.readFileSync(filePath, 'utf8');

    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${source.trim()};\n`,
    };
  }

  if (url.startsWith(pathToFileURL(rootDir).href) && url.endsWith('.js')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: fs.readFileSync(fileURLToPath(url), 'utf8'),
    };
  }

  return nextLoad(url, context);
}
