import { ProListMetas } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Container } from '../../kit/container';
import { ScrollList } from '../../kit/list';

export const List = (props: { metas?: ProListMetas<any> | undefined }) => {
  const intl = useIntl();

  return (
    <Container keepAlive={false}>
      <ScrollList metas={props.metas || {}} dataSource={[]} intl={intl} />
    </Container>
  );
};
