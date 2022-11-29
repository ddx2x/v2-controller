import { FR } from '../core';
import { useStore } from '../utils/hook';

export const Canvas: React.FC = () => {
  const {
    displaySchema,
    userProps,
    preview,
  } = useStore();

  return (
    <div className="mid-layout pr2">
      <div className={`dnd-container ${preview ? 'preview' : 'edit'}`}>
        <div style={{ height: preview ? 33 : 0 }}>
          <FR preview={preview} displaySchema={displaySchema} />
        </div>
      </div>
    </div>
  )
}