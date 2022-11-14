import { RouteContext } from '@ant-design/pro-components';
import { useContext } from 'react';
import { Container, ContainerProps } from './container';
import { KeepAlive, KeepAliveProps } from './keep-alive';

export interface PageContainerProps extends KeepAliveProps, ContainerProps {
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

export default PageContainer;
