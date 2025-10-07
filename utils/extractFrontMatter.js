const extractFrontMatter = (entireFile) => {
  const parts = entireFile.split(/^---\s*$/m);
  if (parts.length < 3) return { data: {}, content: entireFile };

  const dataString = parts[1];
  const content = parts.slice(2).join('---').trim();
  const lines = dataString.split('\n').filter((line) => line.trim() !== '');

  const clean = (s) => s.replace(/^'|'$/g, ''); // trim outer single quotes

  const parseBlock = (startIndex = 0, baseIndent = 0) => {
    const result = {};
    let i = startIndex;

    while (i < lines.length) {
      const line = lines[i];
      const indent = line.match(/^ */)[0].length;
      if (indent < baseIndent) break;

      const trimmed = line.trim();

      // list item (- ...)
      if (trimmed.startsWith('- ')) {
        const arrKey = '_list';
        const valuePart = trimmed.slice(2).trim();

        if (!Array.isArray(result[arrKey])) result[arrKey] = [];

        // inline object in list
        if (valuePart.includes(': ')) {
          const [k, v] = valuePart.split(/:(.+)/).map((s) => s.trim());
          const obj = { [clean(k)]: clean(v) };
          const { value: nested, nextIndex } = parseBlock(i + 1, indent + 2);
          Object.assign(obj, nested);
          result[arrKey].push(obj);
          i = nextIndex;
        } else if (i + 1 < lines.length && lines[i + 1].match(/^ {2,}/)) {
          const { value: nested, nextIndex } = parseBlock(i + 1, indent + 2);
          result[arrKey].push(nested);
          i = nextIndex;
        } else {
          result[arrKey].push(clean(valuePart));
          i++;
        }
        continue;
      }

      // normal key: value
      const match = trimmed.match(/^([^:]+):(.*)$/);
      if (!match) {
        i++;
        continue;
      }

      const key = clean(match[1].trim());
      const value = match[2].trim();

      if (value === '') {
        const { value: nested, nextIndex } = parseBlock(i + 1, indent + 2);
        result[key] = nested._list ?? nested;
        i = nextIndex;
      } else {
        result[key] = clean(value);
        i++;
      }
    }

    return { value: result, nextIndex: i };
  };

  const { value: data } = parseBlock(0, 0);
  return { data, content };
};

module.exports = extractFrontMatter;
