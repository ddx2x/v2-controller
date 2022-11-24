import { FR } from '../core';
import { useStore } from '../utils';

export const Canvas: React.FC = () => {
  const {
    userProps,
    preview,
  } = useStore();

  return (
    <div className="mid-layout pr2">
      <div className={`dnd-container ${preview ? 'preview' : 'edit'}`}>
        <div style={{ height: preview ? 33 : 0 }}>
          {/* <FR preview={preview} displaySchema={null} /> */}
        </div>
      </div>
    </div>
  )
}