import { PlusOutlined } from '@ant-design/icons';
import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useState } from 'react';
import { getBase64, handleBeforeUpload } from '../../helper/utils';

export declare type ImageUploadProps = UploadProps & ProFieldFCRenderProps & {
  newMode?: boolean
  maxNumber?: number;
  buttonText?: string;
};

export const ImageUpload: React.FC<ImageUploadProps> = (props) => {
  const { name, mode, listType, buttonText, maxNumber, value, onChange, ...rest } = props;
  const fileList = value ? value?.fileList || [] : [];

  // 图片预览
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreviewCancel = () => setPreviewOpen(false);

  const onImagePreview = async (file: UploadFile) => {
    if (file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage((file.preview as string) || file.url || '');
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/')));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    let fileList = info.fileList;
    fileList
      .filter((item) => item.uid === info.file.uid)
      .map((item) => (item.url = '/media-t/file/' + item.name));
    onChange && onChange({ fileList: fileList });
  };

  // 按钮
  const button = (
    <div>
      <PlusOutlined />
      <div id={'ant-form-uploader'} style={{ marginTop: 8 }}>
        {buttonText || '上传图片'}
      </div>
    </div>
  );


  console.log('fileList', fileList)

  const uploader = () => {
    return (
      <Upload
        disabled={mode === 'read'}
        name={name || 'file'}
        listType={listType || 'picture-card'}
        fileList={fileList}
        onPreview={onImagePreview}
        beforeUpload={mode === 'read' ? undefined : handleBeforeUpload}
        onChange={mode === 'read' ? undefined : handleChange}
        {...rest}
      >
        {(typeof maxNumber == 'number' && fileList?.length >= maxNumber || mode == 'read') ? null : button}
      </Upload>
    )
  }

  const modal = () => {
    return (
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewCancel}>
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    )
  }

  if (mode == 'read') {
    return (
      <div style={{ margin: 'auto', height: 'auto', width: 'auto' }}>
        {uploader()}
        {modal()}
      </div>
    )
  }

  return (
    <>
      <ImgCrop rotate>
        {uploader()}
      </ImgCrop>
      {modal()}
    </>
  );

};


export const ImageUploadRender: React.FC<ImageUploadProps> = (props) => {
  return <ImageUpload {...props} />
}

export const ImageUploadRenderFormItem: React.FC<ImageUploadProps> = (props) => {
  return <ImageUpload {...props} />
}