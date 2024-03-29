import { randomKey } from '@/helper';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { Badge, Button, Image, Modal, Popconfirm, Spin, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { getFileItem, updateFileList } from 'antd/es/upload/utils';
import { useEffect, useState } from 'react';
import { getBase64, handleBeforeUpload } from '../../../helper/utils';

export const Img = (props: any) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetch(props.src, {
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2ODE4NzAzMDcsImV4cCI6MTY4MTg5MTkwN30._4HM456beULOZAMyGeHOjggI1DlqWr8PVYOLIw_43co',
      },
    })
      .then((response) => {
        if (response.status == 500) {
          throw new Error('500');
        }

        return response.blob();
      })
      .then((blob) => URL.createObjectURL(blob))
      // @ts-ignore
      .then((url) => setImageUrl(url as any))
      .catch((error) => console.error(error));
  }, [props.src]);

  return (
    <div>
      {imageUrl ? (
        <Image src={imageUrl} width={props.width || 60} />
      ) : (
        <Spin tip="Loading" size="small" />
      )}
    </div>
  );
};

export declare type ImageUploadProps = UploadProps &
  ProFieldFCRenderProps & {
    prefix?: string;
    maxNumber?: number;
    buttonText?: string;
  };

export const ImageUpload: React.FC<ImageUploadProps> = (props) => {
  const { name, listType, prefix, maxNumber, buttonText, mode, value, onChange, ...rest } = props;

  let fileList: any = [];
  if (value?.fileList && Array.isArray(value.fileList)) {
    fileList = value.fileList;
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
      .map((item) => {
        item.url = prefix + item.name;
      });
    onChange && onChange({ fileList: fileList });
  };

  const onSuccess = (response: any[], file: RcFile, xhr: any) => {
    let _file = getFileItem(file, fileList);
    let _name = response ? response[0] : _file.name;
    let _ = {
      uid: _file.uid,
      name: _name,
      url: prefix ? prefix + _name : _name,
    };
    let _fileList = updateFileList(_, fileList);
    onChange && onChange({ fileList: _fileList });
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
        {fileList?.map((item: any) => {
          let _id = randomKey(5);
          return <Img key={_id} src={item.url} />;
        })}
      </Image.PreviewGroup>
    );
  }

  return (
    <>
      <ImgCrop rotationSlider aspectSlider showGrid zoomSlider quality={1} modalTitle="图标编辑">
        <Upload
          name={name || 'file'}
          listType={listType || 'picture-card'}
          fileList={fileList}
          onPreview={onImagePreview}
          beforeUpload={handleBeforeUpload}
          // @ts-ignore
          onSuccess={onSuccess}
          onChange={handleChange}
          itemRender={(originNode, file, fileList, { download, preview, remove }) => {
            console.log('file', file, fileList);

            return (
              <Badge
                count={
                  <Popconfirm title="确认删除" okText="确认" cancelText="取消" onConfirm={remove}>
                    <Button type="primary" shape="circle" icon={<DeleteOutlined />} size="small" />
                  </Popconfirm>
                }
              >
                <div style={{ padding: '8px', border: '1px solid #d9d9d9', borderRadius: '8px' }}>
                  <Img src={file.url} width={'100%'} />
                </div>
              </Badge>
            );
          }}
          {...rest}
        >
          {typeof maxNumber == 'number' && fileList?.length >= maxNumber ? null : button}
        </Upload>
      </ImgCrop>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewCancel}>
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export const ImageUploadRender: React.FC<ImageUploadProps> = (props) => {
  return <ImageUpload {...props} />;
};

export const ImageUploadRenderFormItem: React.FC<ImageUploadProps> = (props) => {
  return <ImageUpload {...props} />;
};
