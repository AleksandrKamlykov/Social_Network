export function toLowerFirsLetterInObj(obj: Record<string, any>) {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    newObj[key[0].toLowerCase() + key.slice(1)] = obj[key];
  }

  return newObj;
}
