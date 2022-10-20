import { ProColumns } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Container } from '../../kit/container';
import { ScrollTable } from '../../kit/table';

export const Table = (props: { columns?: ProColumns<any, 'text'>[] }) => {
  const intl = useIntl();

  return (
    <Container>
      <ScrollTable columns={props.columns || []} dataSource={[]} intl={intl} />
    </Container>
  );
};
