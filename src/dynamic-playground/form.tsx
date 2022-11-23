import { Space } from 'antd';
import { CSSProperties, useCallback, useMemo, useState } from 'react';
import { DndProvider, DragSourceMonitor, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCard } from '../dynamic-components/#';
import { ProFieldValueTypeKeys, useForm, valueTypeMapStore } from '../dynamic-components/form';

export const Colors = {
  YELLOW: 'yellow',
  BLUE: 'blue',
}


const style: CSSProperties = {
  // border: '1px dashed gray',
  padding: '0.5rem',
  margin: '0.5rem',
}

const drapRender = ({ listDom, action }: any) => {

  const [forbidDrag, setForbidDrag] = useState(false)
  const color = 'yellow'

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: color,
      canDrag: !forbidDrag,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [forbidDrag, color],
  )

  const onToggleForbidDrag = useCallback(() => {
    setForbidDrag(!forbidDrag)
  }, [forbidDrag, setForbidDrag])

  const backgroundColor = useMemo(() => {
    switch (color) {
      case Colors.YELLOW:
        return 'lightgoldenrodyellow'
      case Colors.BLUE:
        return 'lightblue'
      default:
        return 'lightgoldenrodyellow'
    }
  }, [color])

  const containerStyle = useMemo(
    () => ({
      ...style,
      // backgroundColor,
      opacity: isDragging ? 0.4 : 1,
      cursor: forbidDrag ? 'default' : 'move',
    }),
    [isDragging, forbidDrag, backgroundColor],
  )

  return <div ref={drag} style={containerStyle}><Space align="baseline">{listDom} {action}</Space></div>
}

export const formPlayGround = () => {

  const [form,] = useForm({
    submitter: false,
    onValuesChange: (_: any, values: any) => {
      console.log('changedValues, values', _, values);
    },
    layoutType: 'Form',
    colProps: {
      xs: 24,
      sm: 12,
    },
    layout: 'inline',
    columns: [
      {
        dataIndex: 'columns',
        valueType: 'formList',
        fieldProps: {
          itemRender: drapRender
        },
        columns: [
          {
            dataIndex: 'group',
            valueType: 'group',
            columns: [
              {
                dataIndex: 'title',
                title: '标题',
              },
              {
                dataIndex: 'dataIndex',
                title: '组件id',
                fieldProps: {
                  required: true
                }
              },
              {
                dataIndex: 'valueType',
                title: '组件类型',
                width: '150px',
                valueType: 'select',
                valueEnum:
                  ProFieldValueTypeKeys
                    .concat(Object.keys(valueTypeMapStore.stores))
                    .reduce((a, v) => ({ ...a, [v]: v }), {}),
                fieldProps: { showSearch: true, }
              },
              {
                dataIndex: 'props',
                valueType: 'form'
              }
            ]
          }
        ]
      }
    ],
  })

  const dragForm = () => {
    return <DndProvider backend={HTML5Backend} context={window}>{form}</DndProvider>
  }

  const [configCard,] = useCard({
    // style: {
    //   height: '100vh',
    //   overflow: 'auto',
    //   boxShadow: '2px 0 6px rgba(0, 21, 41, 0.35)',
    //   top: 0,
    //   right: 0,
    //   width: '50%',
    // },
    children: dragForm()
  })

  return (
    <>{configCard}</>
  )
}