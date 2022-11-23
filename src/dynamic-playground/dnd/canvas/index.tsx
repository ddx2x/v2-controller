import { useStore } from '../utils';


export const Canvas = () => {

  const {
    userProps,
    preview,
  } = useStore();

  return (
    <div>
      <div className={`dnd-container ${preview ? 'preview' : 'edit'}`}>
        <div style={{ height: preview ? 33 : 0 }}></div>
      </div>
    </div>
  )
}