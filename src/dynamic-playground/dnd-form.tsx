import { ProFieldValueTypeKeys, valueTypeMapStore } from '../dynamic-components/form';
import { DndBoard } from './dnd';
import { Canvas } from './dnd/canvas';
import { Settings } from './dnd/settings';
import { SiderBar } from './dnd/sidebar';
import './styles/index.less';

export const valueTypeKeys =
  ProFieldValueTypeKeys
    .concat(
      Object.keys(valueTypeMapStore.stores)
    )

export const valueTypeEnum =
  valueTypeKeys.reduce(
    (a, v) => ({ ...a, [v]: v }), {}
  )


export const DnDFormPlayGround: React.FC = () => {
  return (
    <DndBoard>
      <div className="fr-generator-container">
        <SiderBar />
        <Canvas />
        <Settings />
      </div>
    </DndBoard>
  )
}