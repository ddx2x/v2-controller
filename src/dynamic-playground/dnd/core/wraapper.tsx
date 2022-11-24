import { CopyOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { dndType, isObject, useStore } from '../utils';
import './wrapper.less';

export const DndWrapper = (props: any) => {

  const { $id, item, inside = false, children } = props
  const [position, setPosition] = useState();

  const { userProps } = useStore();
  const { schema } = item;
  const {
    controlButtons,
    canDrag = true,
    canDelete = true,
    hideId,
    getId,
  } = userProps;

  let isSelected = true

  const dragObject = {}
  const boxRef = useRef(null);

  const handleClick = () => { }

  const [{ isDragging }, dragRef, dragPreview] = useDrag({
    type: dndType,
    item: dragObject,
    canDrag: canDrag,
    collect: monitor => ({ isDragging: monitor.isDragging() })
  })

  const [{ isOver }, dropRef,] = useDrop({
    accept: dndType,
    drop: async (item, monitor) => {
      const didDrop = monitor.didDrop();
    },
    hover: async (item, monitor) => {
      const didHover = monitor.isOver({ shallow: true });
      if (didHover) { }
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  })

  const deleteItem = async (e: React.MouseEvent) => {
    e.stopPropagation();
   }

  const handleItemCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  const _controlButtons = Array.isArray(controlButtons)
    ? controlButtons
    : [true, true];
  const _showDefaultBtns = _controlButtons
    .filter(item => ['boolean', 'function'].includes(typeof item))
    .map(item => {
      if (typeof item === 'boolean') return item;
      return item(schema);
    });
  const _extraBtns = _controlButtons.filter(
    item => isObject(item) && (item.text || item.children)
  );

  const { length: _numOfBtns } = _showDefaultBtns
    .concat(_extraBtns)
    .filter(Boolean);

  return (
    <div
      ref={boxRef}
      className={`field-wrapper ${$id !== '#' && isSelected ? 'selected-field-wrapper' : ''} relative w-100`}
      onClick={handleClick}>
      {children}

      {!inside && $id !== '#' && isSelected && (
        <div className="pointer-move" ref={dragRef}>
          <DragOutlined />
        </div>
      )}
      {!inside && $id !== '#' && isSelected && _numOfBtns > 0 && (
        <div className="pointer-wrapper">
          {_showDefaultBtns[0] !== false && (
            <div className="pointer" onClick={deleteItem}>
              <DeleteOutlined />
            </div>
          )}
          {_showDefaultBtns[1] !== false && (
            <div className="pointer" onClick={handleItemCopy}>
              <CopyOutlined />
            </div>
          )}
        </div>
      )}
    </div>
  )
}