import { useIntl, useMatch } from '@umijs/max';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import PageContainer from '../container';
import Descriptions from '../descriptions';
import List from '../list';
import Table from '../table';
import type { LayoutType } from '../typing';
import { templateManager } from './manager';

export default observer(() => {
  const match = useMatch('/:route/:layout');

  const route = match?.params.route as string;
  const layoutKind = match?.params.layout as LayoutType; // 布局类型

  const templates = templateManager.getLayoutTemplate(route + '.' + layoutKind); // 注册配置项

  if (!templates) return null;

  const intl = useIntl(); // 国际化组件


  useEffect(() => {
    templateManager.init(route); // 挂载 stores
    return () => templateManager.clear(route); // 清除stores
  });

  const page = (() => {
    return (<>
      {
        templates.map(
          (template) => {
            const { kind, ...rest } = template;
            switch (kind) {
              case 'Table':
                return <Table {...rest} intl={intl} />;
              case 'List':
                return <List {...rest} intl={intl} />;
              // case 'Form':
              //   return <Form {...rest} layoutType="Form" intl={intl} />;
              // case 'StepForm':
              //   return <StepForm {...rest} modal="Form" intl={intl} />;
              case 'Descriptions':
                return <Descriptions modal="Page" {...rest} intl={intl} />;
            }
            return <></>
          })
      }
    </>)
  })();

  return (
    <PageContainer >
      {page}
    </PageContainer>
  );
});
