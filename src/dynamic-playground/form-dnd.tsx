import { ProFieldValueTypeKeys, valueTypeMapStore } from '../dynamic-components/form';
import { DndBoard } from './dnd';

export const valueTypeKeys =
  ProFieldValueTypeKeys
    .concat(
      Object.keys(valueTypeMapStore.stores)
    )

export const valueTypeEnum =
  valueTypeKeys.reduce(
    (a, v) => ({ ...a, [v]: v }), {}
  )


export const FormDndPlayGround = () => {
  return (
    <DndBoard>

    </DndBoard>
  )
}