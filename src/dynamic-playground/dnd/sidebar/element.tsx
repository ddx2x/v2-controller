import { useDrag } from 'react-dnd';
import { dndType, useStore } from '../utils';

export const Element = (props: any) => {
  const { } = useStore();

  const [{ isDragging }, dragRef] = useDrag({
    type: dndType,
    item: {
      dragItem: {
        parent: '#',
        children: [],
      },
      $id: '',
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return <div ref={dragRef}></div>
}