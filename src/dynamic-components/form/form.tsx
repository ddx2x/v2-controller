import {
  BetaSchemaForm, ProFormInstance,
  ProProvider,
  RouteContextType
} from '@ant-design/pro-components';
import { FormSchema } from '@ant-design/pro-form/es/components/SchemaForm';
import { useLocation } from '@umijs/max';
import { Button, Space } from 'antd';
import { ButtonSize, ButtonType } from 'antd/lib/button';
import type { Location } from 'history';
import { Dispatch, forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { IntlShape } from 'react-intl';
import { FooterToolbar } from '../footer';
import { waitTime } from '../helper/wait';
import { valueTypeMapStore } from '../valueType/valueTypeMap';

export declare type FormRef = {
  open: () => void;
};

export declare type FormProps = Omit<FormSchema, 'layoutType'> & {
  onMount?: (location: Location | undefined, form: ProFormInstance<any> | undefined, setDataObject: Dispatch<any>) => void;
  trigger?: () => void;
  layoutType?: FormSchema['layoutType'];
  triggerText?: string;
  buttonType?: ButtonType
  buttonSize?: ButtonSize;
  submitTimeout?: number; // 提交数据时，禁用取消按钮的超时时间（毫秒）。
  onSubmit?: (formRef: React.MutableRefObject<ProFormInstance<any> | undefined>, values: any, dataObject: any, handleClose: () => void) => boolean;
  intl?: IntlShape; // 国际化
  routeContext?: RouteContextType;
}

export const Form = forwardRef((props: FormProps, forwardRef) => {
  const {
    onMount,
    triggerText,
    buttonType,
    buttonSize,
    submitTimeout,
    onSubmit,
    intl,
    routeContext,
    ...rest
  } = props;


  const location = useLocation()
  const formRef = useRef<ProFormInstance>();
  const [dataObject, setDataObject] = useState({})

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
      rest['onOpenChange'] = setIsModalOpen
      // @ts-ignore
      rest['modalprops'] = { destroyOnClose: true };
    case 'DrawerForm':
      // @ts-ignore
      rest['onOpenChange'] = setIsModalOpen
      // @ts-ignore
      rest['drawerprops'] = { destroyOnClose: true };
    case 'Form':
    default:
      rest['submitter'] = {
        searchConfig: { resetText: '重置' }
      }
      // @ts-ignore
      rest['contentRender'] = (dom: React.ReactNode, submitter: React.ReactNode) => {
        return (
          <>
            <div style={{ margin: '1% 20% 0% 20%' }}>
              {dom}
            </div>
            <FooterToolbar routeContext={routeContext || {}}>
              <Space>{submitter}</Space>
            </FooterToolbar>
          </>
        )
      }
  }

  const proProviderValues = useContext(ProProvider);

  return (
    <ProProvider.Provider
      value={{
        ...proProviderValues,
        valueTypeMap: valueTypeMapStore.stores,
      }}
    >
      <BetaSchemaForm
        onInit={(values, form) => onMount && onMount(location, form, setDataObject)}
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
          const b = onSubmit(formRef, values, dataObject, handleClose);
          await waitTime(submitTimeout);
          return b;
        }}
        {...rest}
      />
    </ProProvider.Provider>
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
      resetText: '取消',
    },
  },
  submitTimeout: 1000,
  columns: [],
};

export const useForm = (props: FormProps): React.ReactNode => {
  return <Form {...props} />;
};
