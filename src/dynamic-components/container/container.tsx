import type {
  PageContainerProps as ProPageContainerProps,
  RouteContextType
} from '@ant-design/pro-components';
import { PageContainer as ProPageContainer, RouteContext } from '@ant-design/pro-components';
import type { BreadcrumbProps } from 'antd';
import { useContext } from 'react';
import type { KeepAliveProps } from './keepAlive';
import { KeepAlive } from './keepAlive';

export declare type ContainerProps = ProPageContainerProps & {
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
    <ProPageContainer header={{ breadcrumb: headerBreadcrumb(), ...header }} {...rest}>
      {props.children}
    </ProPageContainer>
  );
};

Container.defaultProps = {
  useBreadcrumb: true,
  context: null,
  fixedHeader: false,
};


export type PageContainerProps = KeepAliveProps & ContainerProps & {
  keepAlive?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = (props) => {
  const { keepAlive, path, children, ...rest } = props;

  const container = () => {
    // 获取 layout 上下文
    const context = useContext(RouteContext);
    return (
      <Container context={context} {...rest}>
        {children}
      </Container>
    );
  };

  if (!keepAlive) return container();
  return <KeepAlive path={path}>{container()}</KeepAlive>;
};

PageContainer.defaultProps = {
  keepAlive: true,
};
