import { Table } from '@/dynamic-components/table';
import { Form, FormProps } from '../../form';
import { valueTypeMapStore } from '../valueTypeMap';
import { BaiduMapProps, BMapRender, BMapRenderFormItem } from './baiduMap';
import { Card, CardProps } from './card';
import { ImageUploadRenderFormItem, ImageUploadRender, ImageUploadProps } from './imageUpload';
import { MonacoEditorRenderFormItem, MonacoEditorRender, MonacoEditorProps } from './monacoEditor';
import { TagProps, TagRender, TagRenderFormItem } from './tag';
import { VideoUploadRender, VideoUploadRenderFormItem, VideoUploadProps } from './videoUpload';

declare module '@ant-design/pro-utils' {
  interface ProFieldValueTypeWithFieldProps {
    tag: TagProps;
    map: BaiduMapProps;
    imageUpload: ImageUploadProps;
    videoUpload: VideoUploadProps;
    monacoEditor: MonacoEditorProps;
    card: CardProps;
    form: FormProps;
  }
}

// 注册两种主件 第一项为只读渲染 Render  第二项为编辑渲染组件RenderFormItem
const valueTypeMap = {
  tag: [TagRender, TagRenderFormItem],
  map: [BMapRender, BMapRenderFormItem],
  imageUpload: [ImageUploadRender, ImageUploadRenderFormItem],
  videoUpload: [VideoUploadRender, VideoUploadRenderFormItem],
  monacoEditor: [MonacoEditorRender, MonacoEditorRenderFormItem],
  card: [Card, Card],
  table: [Table, Table],
  form: [Form, Form],
};

valueTypeMapStore.registerValueType(valueTypeMap);
