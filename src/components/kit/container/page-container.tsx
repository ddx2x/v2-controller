import { RouteContext } from '@ant-design/pro-components';
import { useContext } from 'react';
import { Container, ContainerProps } from './container';
import { KeepAlive, KeepAliveProps } from './keep-alive';

interface PageContainerProps extends KeepAliveProps, ContainerProps {
  keepAlive?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = (props) => {
  const { keepAlive, path, ...rest } = props;

  const container = () => {
    // 获取 layout 上下文
    const context = useContext(RouteContext);
    return (
      <Container context={context} {...rest}>
        {props.children}
      </Container>
    );
  };

  if (!props.keepAlive) return container();
  return <KeepAlive path={path}>{container()}</KeepAlive>;
};

PageContainer.defaultProps = {
  keepAlive: true,
};

export default PageContainer;
