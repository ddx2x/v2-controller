import { Line } from '@ant-design/plots';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { QRCode, Segmented, Table } from 'antd';
import RcResizeObserver from 'rc-resize-observer';
import { useState } from 'react';
const { Divider } = StatisticCard;

const LineData = [
  {
    '日期': '02/16',
    '数量': 3,
  },
  {
    '日期': '02/17',
    '数量': 4,
  },
  {
    '日期': '02/18',
    '数量': 3.5,
  },
  {
    '日期': '02/19',
    '数量': 5,
  },
  {
    '日期': '02/20',
    '数量': 4.9,
  },
  {
    '日期': '02/21',
    '数量': 6,
  },
  {
    '日期': '02/22',
    '数量': 7,
  },

];
const LineConfig = {
  data: LineData,
  xField: '日期',
  yField: '数量',
  stepType: 'vh',
};

const tableColumns = [
  {
    title: '排名',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '销量',
    dataIndex: 'sales',
    key: 'sales',
  },
];

const dataSource = [
  { index: 1, name: '曙光车灯', sales: '80' },
  { index: 2, name: '新加坡“星狮”密封胶', sales: '73' },
  { index: 3, name: '新加坡“星狮”DOT-4刹车油', sales: '65' },
  { index: 4, name: '新加坡“星狮”润滑黄油系列', sales: '49' },
  { index: 5, name: '新加坡“星狮”自动变速箱油ATF-6速系列', sales: '42' },
  { index: 6, name: '联名品牌培训师工具包体验装', sales: '30' },
  { index: 7, name: '智能AI除碳套装', sales: '29' },
]

export default () => {
  const [responsive, setResponsive] = useState(false);

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  console.log(formattedDate);

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard
        title="数据概览"
        extra={formattedDate}
        headerBordered
        bordered
        split={responsive ? 'horizontal' : 'vertical'}
      >
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <ProCard split="vertical">
              <StatisticCard title='今日订单统计' >
                <StatisticCard
                  statistic={{
                    title: '待支付订单',
                    tip: '待支付订单',
                    value: 79,
                  }}
                />
                <Divider />
                <StatisticCard
                  statistic={{
                    title: '待发货订单',
                    value: 8396,
                    status: 'default',
                  }}
                />
                <Divider />
                <StatisticCard
                  statistic={{
                    title: '待处理售后订单',
                    value: 2,
                    status: 'processing',
                  }}
                />

              </StatisticCard>
            </ProCard>
            <ProCard split="vertical">
              <StatisticCard title='销售统计' extra={<Segmented options={['今日', '本周', '本月', '今年']} onResize={undefined} onResizeCapture={undefined} />}>
                <StatisticCard
                  statistic={{
                    title: '交易总额（元）',
                    tip: '交易总额（元）',
                    value: 394774,
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '退款总额（元）',
                    tip: '退款总额（元）',
                    value: 394274,
                  }}
                />
                <StatisticCard
                  statistic={{
                    title: '充值总额（元）',
                    value: 39274,
                  }}
                />
              </StatisticCard>
            </ProCard>
          </ProCard>
          <StatisticCard
            title="订单统计"
            extra={<Segmented options={['今日', '本周', '本月']} onResize={undefined} onResizeCapture={undefined} />}
          >
            <Line {...LineConfig} />
          </StatisticCard>
        </ProCard>
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <ProCard split="vertical">
              <StatisticCard
                title="小程序二维码"
              >
                <StatisticCard>
                  <QRCode value="https://ant.design/" />
                </StatisticCard>
                <StatisticCard>
                  <QRCode value="https://ant.design/" />
                </StatisticCard>
              </StatisticCard>
            </ProCard>
          </ProCard>
          <ProCard split="vertical" extra={<Segmented options={['今日', '本周', '本月']} onResize={undefined} onResizeCapture={undefined} />}>
            <StatisticCard
              title="商品排名"
            >
              <Table dataSource={dataSource} columns={tableColumns} pagination={false} />
            </StatisticCard>
          </ProCard>
        </ProCard>
      </ProCard>
    </RcResizeObserver>
  )

}