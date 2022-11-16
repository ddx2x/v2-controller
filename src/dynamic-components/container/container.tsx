import type {
  PageContainerProps,
  RouteContextType
} from '@ant-design/pro-components';
import {
  PageContainer as AntdPageContainer
} from '@ant-design/pro-components';
import type { BreadcrumbProps } from 'antd';

export interface ContainerProps extends PageContainerProps {
  useBreadcrumb?: boolean;
  context?: RouteContextType | null;
}

export const Container: React.FC<ContainerProps> = (props) => {
  const { useBreadcrumb, context, breadcrumb, header, ...rest } = props;

  const headerBreadcrumb = (): BreadcrumbProps | undefined => {
    // 面包屑🍞
    // 开启 useBreadcrumb 后如果不传值, 可根据 layout context 动态获取到自动根据路由计算的面包屑
    if (!useBreadcrumb) return undefined;
    if (!context) {
      console.warn(
        'Did not get the context of pro layout. / 没有获取到 layout context : ',
        context,
      );
      return undefined;
    }
    if (breadcrumb) return breadcrumb;
    return context.breadcrumb;
  };

  return (
    <AntdPageContainer header={{ breadcrumb: headerBreadcrumb(), ...header }} {...rest}>
      {props.children}
    </AntdPageContainer>
  );
};

Container.defaultProps = {
  useBreadcrumb: true,
  context: null,
  fixedHeader: false,
};
