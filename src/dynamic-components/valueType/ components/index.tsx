import { Table } from '@/dynamic-components/table';
import { Form, FormProps } from '../../form';
import { valueTypeMapStore } from '../valueTypeMap';
import { BMapRender, BMapRenderFormItem, BaiduMapProps } from './baiduMap';
import { Card, CardProps } from './card';
import { ImageUploadProps, ImageUploadRender, ImageUploadRenderFormItem } from './imageUpload';
import { MonacoEditorProps, MonacoEditorRender, MonacoEditorRenderFormItem } from './monacoEditor';
import { QuillProps, QuillRender, QuillRenderFormItem } from './quill';
import { TagProps, TagRender, TagRenderFormItem } from './tag';
import { VideoUploadProps, VideoUploadRender, VideoUploadRenderFormItem } from './videoUpload';

declare module '@ant-design/pro-utils' {
  interface ProFieldValueTypeWithFieldProps {
    tag: TagProps;
    map: BaiduMapProps;
    imageUpload: ImageUploadProps;
    videoUpload: VideoUploadProps;
    monacoEditor: MonacoEditorProps;
    card: CardProps;
    form: FormProps;
    quill: QuillProps;
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
  quill: [QuillRender, QuillRenderFormItem]
};

valueTypeMapStore.registerValueType(valueTypeMap);
