import { randomKey } from '@/helper';
import { PlusOutlined } from '@ant-design/icons';
import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { Image, Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useState } from 'react';
import { getBase64, handleBeforeUpload } from '../../../helper/utils';

export declare type ImageUploadProps = UploadProps & ProFieldFCRenderProps & {
  prefix?: string
  maxNumber?: number;
  buttonText?: string;
};

export const ImageUpload: React.FC<ImageUploadProps> = (props) => {
  const { name, listType, prefix, maxNumber, buttonText, mode, value, onChange, ...rest } = props;
  let fileList: any = []
  if (value?.fileList && Array.isArray(value.fileList)) {
    fileList = value.fileList
  }

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
      .map((item) => (item.url = prefix + item.name));
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


  if (mode == 'read') {
    return (
      <Image.PreviewGroup>
        {fileList?.map((item: any) => <Image key={randomKey(5)} width={60} src={item.url} />)}
      </Image.PreviewGroup>
    )
  }

  return (
    <>
      <ImgCrop rotationSlider aspectSlider showGrid zoomSlider quality={1} modalTitle='图标编辑'>
        <Upload
          name={name || 'file'}
          listType={listType || 'picture-card'}
          fileList={fileList}
          onPreview={onImagePreview}
          beforeUpload={handleBeforeUpload}
          onChange={handleChange}
          {...rest}
        >
          {(typeof maxNumber == 'number' && fileList?.length >= maxNumber) ? null : button}
        </Upload>
      </ImgCrop>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewCancel}>
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );

};


export const ImageUploadRender: React.FC<ImageUploadProps> = (props) => {
  return <ImageUpload {...props} />
}

export const ImageUploadRenderFormItem: React.FC<ImageUploadProps> = (props) => {
  return <ImageUpload {...props} />
}