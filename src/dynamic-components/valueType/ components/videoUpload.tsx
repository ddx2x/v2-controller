import { UploadOutlined } from '@ant-design/icons';
import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { Button, Modal, Upload, UploadFile, UploadProps } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useState } from 'react';
import { BigPlayButton, ControlBar, PlaybackRateMenuButton, Player } from 'video-react';
import { getBase64, handleBeforeUpload } from '../../helper/utils';

export declare type VideoUploadProps = UploadProps & ProFieldFCRenderProps & {
  newMode?: boolean;
  maxNumber?: number;
  buttonText?: string;
};

export const VideoUpload: React.FC<VideoUploadProps> = (props) => {
  const { name, listType, newMode, maxNumber, buttonText, action, value, onChange, ...rest } = props;
  const fileList = value?.fileList || [];

  // 图片预览
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreviewCancel = () => setPreviewOpen(false);

  const onVideoPreview = async (file: UploadFile) => {
    if (file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewVideo((file.preview as string) || file.url || '');
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

  const button = <Button icon={<UploadOutlined />}>{buttonText || '上传视频'}</Button>;

  return (
    <>
      <Upload
        name={name || 'file'}
        action={action}
        listType={listType || 'text'}
        fileList={fileList}
        onPreview={onVideoPreview}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
        {...rest}
      >
        {newMode && typeof maxNumber == 'number' && fileList.length >= maxNumber ? null : button}
      </Upload>
      <Modal
        destroyOnClose
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handlePreviewCancel}
      >
        <Player src={previewVideo}>
          <BigPlayButton position="center" />
          <ControlBar>
            <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.25]} />
          </ControlBar>
        </Player>
      </Modal>
    </>
  );
};



export const VideoUploadRender: React.FC<VideoUploadProps> = (props) => {
  return <VideoUpload {...props} />
}

export const VideoUploadRenderFormItem: React.FC<VideoUploadProps> = (props) => {
  return <VideoUpload {...props} newMode />
}