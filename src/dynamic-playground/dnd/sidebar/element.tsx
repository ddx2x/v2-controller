import { useDrag } from 'react-dnd';
import { addItem, dndType } from '../utils';
import { useGlobal, useStore } from '../utils/hook';

export const Element = ({ text, name, schema, icon, fixedName }: any) => {
  const setGlobal = useGlobal();
  const { flatten, selected, errorFields, userProps } = useStore();
  const { getId } = userProps;

  const [{ isDragging }, dragRef] = useDrag({
    type: dndType,
    item: {
      dragItem: {
        parent: '#',
        children: [],
      },
      $id: '',
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleElementClick = async () => {
    if (errorFields?.length) return;
    if (selected && !flatten[selected]) {
      setGlobal({ selected: '#' });
      return;
    }
    const { newId, newFlatten } = addItem({
      selected,
      name,
      schema,
      flatten,
      fixedName,
      getId,
    });
    onFlattenChange(newFlatten);
    setGlobal({ selected: newId });
  };

  const widgetProps = {
    text,
    icon,
    onClick: handleElementClick,
  };

  const originNode = <WidgetUI {...widgetProps} />;

  return (
    <div ref={dragRef}>
      {elementRender ? elementRender(schema, widgetProps, originNode) : originNode}
    </div>
  );
};

// 目前没有用icon，但是可以补上
const WidgetUI = ({ onClick, text, icon }) => {
  return (
    <li className="left-item" onClick={onClick}>
      {icon}
      {text}
    </li>
  );
};
