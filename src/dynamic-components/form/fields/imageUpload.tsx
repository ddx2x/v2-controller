import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useState } from 'react';
import { getBase64, handleBeforeUpload } from './utils';

export declare type ImageUploadFieldProps = UploadProps & {
  maxNumber?: number;
  buttonText?: string;
  value?: any;
  onChange?: ((...rest: any[]) => void) | undefined;
};

export const imageUploadField: React.FC<ImageUploadFieldProps> = (props) => {
  const { buttonText, name, listType, maxNumber, value, onChange, ...rest } = props;

  const fileList = value?.fileList || [];

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
      .filter((item) => item.uid == info.file.uid)
      .map((item) => (item.url = '/media/file/' + item.name));
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

  return (
    <>
      <ImgCrop rotate>
        <Upload
          name={name || 'file'}
          listType={listType || 'picture-card'}
          fileList={fileList}
          beforeUpload={handleBeforeUpload}
          onPreview={onImagePreview}
          onChange={handleChange}
          {...rest}
        >
          {typeof maxNumber == 'number' && fileList.length >= maxNumber ? null : button}
        </Upload>
      </ImgCrop>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewCancel}>
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};
