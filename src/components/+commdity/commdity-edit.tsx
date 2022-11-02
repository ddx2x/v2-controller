import { StepFormTemplate, templateManager } from '@/dynamic-components';
import { Columns } from '@/dynamic-components/form/tools';

const columns: Columns = [
  [
    {
      title: '商品类型',
      dataIndex: 'types',
      valueType: 'radio',
      initialValue: 'a',
      valueEnum: {
        a: '实物商品（物流发货）',
        b: '实物商品（跨境海淘）',
        c: '虚拟商品 （通用）',
        d: '虚拟商品 （付费券）',
      },
    },
    {
      title: '销售渠道',
      dataIndex: 'salesChannels',
      valueType: 'checkbox',
      initialValue: ['online'],
      valueEnum: {
        online: '线上销售',
        offline: '线下销售',
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '销售模式',
      dataIndex: 'salesModel',
      valueType: 'radio',
      valueEnum: {
        a: '现货销售',
        b: '预售模式（商家设置商品预售数量，各门店需自行修改预售数量）',
        c: '抽签模式',
      },
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      valueType: 'text',
      width: '50%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      valueType: 'divider',
      width: '50%',
    },
  ],
  [
    {
      title: '配送方式',
      dataIndex: 'deliveryMethod',
      initialValue: ['a', 'b'],
      valueType: 'checkbox',
      valueEnum: {
        a: '商家配送',
        b: '到店自提',
      },
    },
  ],
  [],
  [],
];

export const commdityEdit: StepFormTemplate = {
  pageContainer: {
    header: {
      title: '商品信息 编辑',
    },
  },
  stepsProps: {},
  steps: [
    { title: '基本信息' },
    { title: '交付设置' },
    { title: '扩展信息' },
    { title: '图文详情' },
  ],
  columns: columns,
};

templateManager.register('commdity-edit', { stepForm: commdityEdit });
