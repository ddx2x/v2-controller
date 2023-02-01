import { Table } from '@/dynamic-components/table';
import { Form, FormProps } from '../../form';
import { valueTypeMapStore } from '../valueTypeMap';
import { BMapRender, BMapRenderFormItem, BaiduMapProps } from './baiduMap';
import { cardField, CardFieldProps } from './card';
import { imageUploadField, ImageUploadFieldProps } from './imageUpload';
import { monacoEditorField, MonacoEditorFieldProps } from './monacoEditor';
import { TagProps, TagRender, TagRenderFormItem } from './tag';
import { videoUploadField, VideoUploadFieldProps } from './videoUpload';

declare module '@ant-design/pro-utils' {
  interface ProFieldValueTypeWithFieldProps {
    tag: TagProps;
    map: BaiduMapProps;
    card: CardFieldProps;
    imageUpload: ImageUploadFieldProps;
    videoUpload: VideoUploadFieldProps;
    monacoEditor: MonacoEditorFieldProps;
    form: FormProps;
  }
}

// 注册两种主件 第一项为只读渲染 Render  第二项为编辑渲染组件RenderFormItem
const valueTypeMap = {
  tag: [TagRender, TagRenderFormItem],
  map: [BMapRender, BMapRenderFormItem],
  card: [cardField, cardField],
  imageUpload: [imageUploadField, imageUploadField],
  videoUpload: [videoUploadField, videoUploadField],
  monacoEditor: [monacoEditorField, monacoEditorField],
  table: [Table, Table],
  form: [Form, Form],
};

valueTypeMapStore.registerValueType(valueTypeMap);
