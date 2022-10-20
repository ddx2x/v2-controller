import { ProListMetas } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Container } from '../../kit/container';
import { ScrollList } from '../../kit/list';

export const List = (props: { metas?: ProListMetas<any> | undefined; dataSource?: any }) => {
  const intl = useIntl();

  return (
    <Container>
      <ScrollList metas={props.metas || {}} dataSource={props.dataSource} intl={intl} />
    </Container>
  );
};
