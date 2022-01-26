export const getArrFromObj = (obj, keyName) => {
  const arrayRes = [];
  for (const key in obj) {
    const objData = obj[key];
    arrayRes.push({ ...objData, [keyName]: key });
  }
  return arrayRes;
};
