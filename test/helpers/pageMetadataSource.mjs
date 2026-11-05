import { parse } from 'espree';
import fs from 'node:fs';
import path from 'node:path';

// Some Finnish pages declare their metadata inside page.jsx, which Node cannot
// import. The metadata object is read from the parsed source instead, so tests
// check the real title and description rather than a copy of them.

function getPropertyName(property) {
  if (property.type !== 'Property' || property.computed) {
    return null;
  }

  return property.key.type === 'Identifier' ? property.key.name : property.key.value;
}

function evaluateStatic(node) {
  switch (node?.type) {
    case 'Literal':
      return node.value;
    case 'TemplateLiteral':
      return node.expressions.length === 0 ? node.quasis[0].value.cooked : undefined;
    case 'BinaryExpression': {
      if (node.operator !== '+') {
        return undefined;
      }
      const left = evaluateStatic(node.left);
      const right = evaluateStatic(node.right);
      return typeof left === 'string' && typeof right === 'string'
        ? left + right
        : undefined;
    }
    case 'ObjectExpression':
      return Object.fromEntries(
        node.properties
          .map((property) => [getPropertyName(property), evaluateStatic(property.value)])
          .filter(([name, value]) => name !== null && value !== undefined)
      );
    default:
      return undefined;
  }
}

function findMetadataObject(node) {
  if (!node || typeof node !== 'object') {
    return null;
  }

  if (
    node.type === 'ObjectExpression' &&
    node.properties.some(
      (property) =>
        getPropertyName(property) === 'title' &&
        typeof evaluateStatic(property.value) === 'string'
    )
  ) {
    return node;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === 'parent') {
      continue;
    }

    const children = Array.isArray(value) ? value : [value];
    for (const child of children) {
      if (child && typeof child.type === 'string') {
        const found = findMetadataObject(child);
        if (found) {
          return found;
        }
      }
    }
  }

  return null;
}

export function readFinnishPageMetadata(routeDirectory) {
  const filePath = path.join(process.cwd(), 'app', '(fi)', routeDirectory, 'page.jsx');
  const program = parse(fs.readFileSync(filePath, 'utf8'), {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  });
  const metadataObject = findMetadataObject(program);

  if (!metadataObject) {
    throw new Error(`No static metadata object with a title in ${filePath}`);
  }

  return evaluateStatic(metadataObject);
}
