import { useIntl, useLocation } from '@umijs/max';
import { observer } from 'mobx-react';
import { PageContainer } from '../container';
import { Table } from '../table';
import { Template, templateManager } from './manager';

export default observer(() => {
  
  const key = useLocation()
    .pathname.split('/')
    .filter((item) => item)
    .join('.');

  const templates = templateManager.getLayoutTemplate(key); // 注册配置项

  if (!templates) return null;

  const intl = useIntl(); // 国际化组件

  // useEffect(() => {
  //   templateManager.init(key); // 挂载 stores
  //   return () => templateManager.clear(key); // 清除stores
  // });

  const page = (() => {
    return (
      <>
        {templates.map((template: Template) => {
          const { ...rest } = template;
          return <Table {...rest} intl={intl} />;

          // switch () {
          //   case 'Table':
          //     return <Table {...rest} intl={intl} />;
          //   case 'List':
          //     return <List {...rest} intl={intl} />;
          //   // case 'Form':
          //   //   return <Form {...rest} layoutType="Form" intl={intl} />;
          //   // case 'StepForm':
          //   //   return <StepForm {...rest} modal="Form" intl={intl} />;
          //   case 'Descriptions':
          //     return <Descriptions modal="Page" {...rest} intl={intl} />;
          // }
          return <></>;
        })}
      </>
    );
  })();

  return <PageContainer>{page}</PageContainer>;
});
