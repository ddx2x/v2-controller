export * from './descriptions';
export { default } from './descriptions';
export * from './items';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { DescriptionsItem } from './items';

// https://next-procomponents.ant.design/components/descriptions

export const itemsExample: DescriptionsItem[] = [
  {
    valueType: 'option',
    value: (
      <Button key="primary" type="primary">
        提交
      </Button>
    ),
  },
  {
    valueType: 'text',
    contentStyle: {
      maxWidth: '80%',
    },
    ellipsis: true,
    span: 2,
    label: '文本',
    value:
      '这是一段很长很长超级超级长的无意义说明文本并且重复了很多没有意义的词语，就是为了让它变得很长很长超级超级长',
  },
  {
    valueType: 'money',
    label: '金额',
    tooltip: '仅供参考，以实际为准',
    value: 100,
  },
  {
    valueType: 'percent',
    label: '百分比',
    value: 100,
  },
  {
    label: '选择框',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
      processing: {
        text: '解决中',
        status: 'Processing',
      },
    },
    value: 'open',
  },
  {
    label: '远程选择框',
    request: async () => [
      { label: '全部', value: 'all' },
      { label: '未解决', value: 'open' },
      { label: '已解决', value: 'closed' },
      { label: '解决中', value: 'processing' },
    ],
    value: 'closed',
  },
  {
    valueType: 'progress',
    label: '进度条',
    value: 40,
  },
  {
    valueType: 'dateTime',
    label: '日期时间',
    value: dayjs().valueOf(),
  },
  {
    valueType: 'date',
    label: '日期',
    value: dayjs().valueOf(),
  },
  {
    valueType: 'dateTimeRange',
    label: '日期区间',
    value: [dayjs().add(-1, 'd').valueOf(), dayjs().valueOf()],
  },
  {
    valueType: 'time',
    label: '时间',
    value: dayjs().valueOf(),
  },
  {
    valueType: 'code',
    label: '代码块',
    value: `
yarn run v1.22.0
$ eslint --format=pretty ./packages
Done in 9.70s.
          `,
  },
  {
    valueType: 'jsonCode',
    label: 'JSON 代码块',
    value: `{
  "compilerOptions": {
    "target": "esnext",
    "moduleResolution": "node",
    "jsx": "preserve",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "suppressImplicitAnyIndexErrors": true,
    "declaration": true,
    "skipLibCheck": true
  },
  "include": ["**/src", "**/docs", "scripts", "**/demo", ".eslintrc.js"]
}
`,
  },
];
