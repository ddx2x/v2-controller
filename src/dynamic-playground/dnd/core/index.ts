import { useStore } from '../utils';
import { RenderField } from './render-field';
import { DndWrapper } from './wrapper';

export * from './wrapper';

export const FR = (props: any) => {
  const { id = '#', item } = props
  const { flatten } = useStore();
  const { schema } = item;

  const isObj = schema.type === 'object';
  const isList =
    schema.type === 'array' && schema.enum === undefined && !!schema.items;
  const isComplex = isObj || isList;

  let containerClass = `fr-field w-100 ${isComplex ? 'fr-field-complex' : ''} ${schema.className || ''
    }`;

  const childrenElement =
    item.children && item.children.length > 0 ? (
      <ul className={`flex flex-wrap pl0`}>
      </ul>
    ) : null;

  const isEmpty = Object.keys(flatten).length < 2; // 只有一个根元素 # 的情况
  if (isEmpty) {
    return (
      <DndWrapper $id={id} item={item}>
        <div
          className={`${containerClass} h-100 f4 black-40 flex items-center justify-center`}
        >
          {'点击/拖拽左侧栏的组件进行添加'}
        </div>
      </DndWrapper>
    );
  }

  const fieldProps = {
    $id: id,
    item,
    isComplex,
  };

  return (
    <DndWrapper $id={id} item={item}>
      <div className={containerClass}>
        <RenderField {...fieldProps}>
          {(isObj || isList) && (
            <DndWrapper $id={id} item={item} inside>
              {childrenElement || <div className="h2" />}
            </DndWrapper>
          )}
        </RenderField>
      </div>
    </DndWrapper>
  )
}