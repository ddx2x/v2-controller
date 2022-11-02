import { ProCard, ProFormColumnsType } from '@ant-design/pro-components';
import { ProSchemaRenderValueTypeFunction } from '@ant-design/pro-form/es/components/SchemaForm/typing';

export interface CardFormField extends ProFormColumnsType<'card'> {}

export const card: ProSchemaRenderValueTypeFunction = (item: any, { genItems }) => {
  if (item.valueType === 'card' && item.dataIndex) {
    if (!item.columns || !Array.isArray(item.columns)) return null;
    return (
      <ProCard
        {...item.getFormItemProps?.()}
        bordered
        headerBordered
        collapsible
        title={item.title}
        key={item.key}
        name={item.dataIndex}
        label={item.label}
        initialValue={item.initialValue}
        colProps={item.colProps}
        rowProps={item.rowProps}
      >
        {genItems(item.columns)}
      </ProCard>
    );
  }
  return true;
};
