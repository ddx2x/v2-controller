import { useParams } from '@umijs/max';
import { List, Table } from './pattern';

export default () => {
  console.log('app......');

  let pattern = null;

  const params = useParams();
  pattern = params['pattern'];

  switch (pattern) {
    case 'table':
      return <Table />;
    case 'list':
      return <List />;
    default:
      return <>.......</>;
  }
};
