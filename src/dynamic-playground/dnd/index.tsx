import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


export const DndBoard = (props: any) => {
  const { children } = props
  return (
    <DndProvider backend={HTML5Backend}>
      {children}
    </DndProvider>
  )
}

