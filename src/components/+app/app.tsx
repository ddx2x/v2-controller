import { useIntl, useMatch } from '@umijs/max';
import { useEffect } from 'react';
import {
  Descriptions,
  DescriptionsProps,
  Form,
  FormProps,
  List,
  ListProps,
  PageContainer,
  StepForm,
  StepFormProps,
  Table,
  TableProps,
} from '../kit';
import { appManager, LayoutType } from './manager';

export default () => {
  const match = useMatch('/app/:route/:layout');
  const route = match?.params['route'] as string;
  const layout = match?.params['layout'] as LayoutType; // 布局类型
  const config = appManager.getLayout(route, layout) || null; // 注册配置项

  if (!config) return null;

  const intl = useIntl(); // 国际化组件
  const { containerProps, ...layoutProps } = config;

  useEffect(() => {
    appManager.initStores(route); // 挂载 stores
    return () => appManager.clearStores(route); // 清除stores
  });

  const children = () => {
    switch (layout) {
      case 'table':
        return <Table {...(layoutProps as TableProps)} intl={intl} />;
      case 'list':
        return <List {...(layoutProps as ListProps)} intl={intl} />;
      case 'form':
        return <Form {...(layoutProps as FormProps)} modal="Form" intl={intl} />;
      case 'step-form':
        return <StepForm {...(layoutProps as StepFormProps)} modal="Form" intl={intl} />;
      case 'descriptions':
        return <Descriptions modal="page" {...(layoutProps as DescriptionsProps)} intl={intl} />;
      default:
        return null;
    }
  };

  return (
    <PageContainer fixedHeader {...containerProps}>
      {children()}
    </PageContainer>
  );
};
