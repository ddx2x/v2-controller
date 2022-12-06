export const dndType = 'playground';

function stringContains(str: string, text: string) {
  return str.indexOf(text) > -1;
}
export const isObject = (a: any) => stringContains(Object.prototype.toString.call(a), 'Object');

export const getKeyFromUniqueId = (uniqueId = '#') => {
  const arr = uniqueId.split('/');
  return arr[arr.length - 1];
};

// Left 点击添加 item
export const addItem = ({ selected, name, schema, flatten, fixedName, getId }: any) => {
  let _selected = selected || '#';
  let newId;
  // string第一个是0，说明点击了object、list的里侧
  if ((_selected && _selected[0] === '0') || _selected === '#') {
    const newFlatten = { ...flatten };
    try {
      let oldId = _selected.substring(1);
      newId = _selected === '#' ? `#/` : `${oldId}/`;
      if (!fixedName) {
        newId += getId(name);
      } else {
        newId += name;
      }
      if (_selected === '#') {
        oldId = '#';
      }
      const siblings = newFlatten[oldId].children;
      siblings.push(newId);
      const newItem = {
        parent: oldId,
        schema: { ...schema, $id: newId },
        data: undefined,
        children: [],
      };
      newFlatten[newId] = newItem;
    } catch (error) {
      console.error(error, 'catch');
    }
    return { newId, newFlatten };
  }
  const _name = fixedName ? name : getId(name);
  const idArr = selected.split('/');
  idArr.pop();
  idArr.push(_name);
  newId = idArr.join('/');
  const newFlatten = { ...flatten };
  try {
    const item = newFlatten[selected];
    const siblings = newFlatten[item.parent].children;
    const idx = siblings.findIndex((x: number | string) => x === selected);
    siblings.splice(idx + 1, 0, newId);
    const newItem = {
      parent: item.parent,
      schema: { ...schema, $id: newId },
      data: undefined,
      children: [],
    };
    newFlatten[newId] = newItem;
  } catch (error) {
    console.error(error);
  }
  return { newId, newFlatten };
};
