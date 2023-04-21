import {
  BetaSchemaForm,
  ProConfigProvider,
  ProFormInstance,
  ProProvider,
  RouteContextType,
} from '@ant-design/pro-components';
import { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
import { useLocation } from '@umijs/max';
import { Button, Space } from 'antd';
import { ButtonSize, ButtonType } from 'antd/lib/button';
import type { Location } from 'history';
import { merge } from 'lodash';
import { Dispatch, forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { IntlShape } from 'react-intl';
import { waitTime } from '../../helper/wait';
import { FooterToolbar } from '../footer';
import { valueTypeMapStore } from '../valueType/valueTypeMap';
import { Guide } from './guide';

export declare type FormRef = {
  open: () => void;
};

export declare type FormOnSumbit = {
  formRef: React.MutableRefObject<ProFormInstance<any> | undefined>;
  values: any;
  dataObject: any;
  handleClose: () => void;
};

export declare type FormProps = Omit<FormSchema, 'layoutType'> & {
  onMount?: (params: {
    location: Location | undefined;
    form: ProFormInstance<any>;
    setDataObject: Dispatch<any>;
    columns: FormSchema['columns'];
    setColumns: Dispatch<FormSchema['columns']>;
  }) => void;
  trigger?: () => void;
  layoutType?: FormSchema['layoutType'];
  triggerText?: string;
  buttonType?: ButtonType;
  buttonSize?: ButtonSize;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  onSubmit?: (params: FormOnSumbit) => boolean;
  intl?: IntlShape; // 国际化
  routeContext?: RouteContextType;
};

export const Form = forwardRef((props: FormProps, forwardRef) => {
  const {
    onMount,
    columns,
    triggerText,
    buttonType,
    buttonSize,
    submitTimeout,
    onSubmit,
    intl,
    routeContext,
    ...rest
  } = props;

  const location = useLocation();
  const formRef = useRef<ProFormInstance>();
  const [dataObject, setDataObject] = useState({});

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [_columns, setColumns] = useState<FormSchema['columns']>(columns);
  const handleShow = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  useImperativeHandle(forwardRef, () => {
    return {
      open: () => handleShow(),
    };
  });

  switch (props.layoutType) {
    case 'ModalForm':
      // @ts-ignore
      rest['onOpenChange'] = setIsModalOpen;
      // @ts-ignore
      rest['modalprops'] = { destroyOnClose: true };
    case 'DrawerForm':
      // @ts-ignore
      rest['onOpenChange'] = setIsModalOpen;
      // @ts-ignore
      rest['drawerprops'] = { destroyOnClose: true };
    case 'Form':
    default:
      // @ts-ignore
      if (!rest['submitter'].searchConfig?.resetText) {
        rest['submitter'] = merge(rest['submitter'] || {}, {
          searchConfig: { resetText: '重置' },
        });
      }
      // @ts-ignore
      rest['contentRender'] = (dom: React.ReactNode, submitter: React.ReactNode) => {
        return (
          <>
            {dom}
            <Guide
              columns={columns}
              onSelected={
                (item: any) => formRef.current?.scrollToField(item.dataIndex)
              }
            />
            <FooterToolbar routeContext={routeContext || {}}>
              <Space>{submitter}</Space>
            </FooterToolbar>
          </>
        );
      };
  }

  const proProviderValues = useContext(ProProvider);

  console.log('valueTypeMapStore.stores', valueTypeMapStore.stores);
  

  return (
    <>
      <ProConfigProvider
        valueTypeMap={valueTypeMapStore.stores}
        hashed={false}
      >
        <BetaSchemaForm
          onInit={(values, form) => {
            onMount && onMount({ location, form, setDataObject, columns: _columns, setColumns });
          }}
          // @ts-ignore
          columns={_columns}
          // @ts-ignore
          formRef={formRef}
          // @ts-ignore
          trigger={
            <Button size={buttonSize} type={buttonType} block onClick={handleShow}>
              {triggerText}
            </Button>
          }
          open={isModalOpen}
          autoFocusFirstInput
          onFinish={async (values) => {
            if (!onSubmit) return false;
            const b = onSubmit({ formRef, values, dataObject, handleClose });
            await waitTime(submitTimeout);
            return b;
          }}
          isKeyPressSubmit={true}
          {...rest}
        />
      </ProConfigProvider>
    </>
  );
});

Form.defaultProps = {
  title: '新建表单',
  layoutType: 'ModalForm',
  triggerText: '新增',
  buttonType: 'link',
  buttonSize: 'small',
  submitter: {
    searchConfig: {
      submitText: '确认',
    },
  },
  submitTimeout: 1000,
  columns: [],
  style: { padding: '0 14%' },
};

export const useForm = (props: FormProps): React.ReactNode => {
  return <Form {...props} />;
};
