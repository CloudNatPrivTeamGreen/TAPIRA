import React, { useState } from 'react';
import { Button, Modal, Upload } from 'antd';
import { ButtonType } from 'antd/lib/button/button';
import { UploadFile } from 'antd/lib/upload/interface';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const UploadJsonModal = ({
  serviceName,
  onHandleOk,
  buttonText,
  buttonType,
}: {
  serviceName: string;
  onHandleOk: (file: File) => void;
  buttonText: string;
  buttonType?: ButtonType;
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setFileList([]);
    setIsModalVisible(false);
  };

  const handleOk = () => {
    if (file !== null) {
      onHandleOk(file);
    }
    setFileList([]);
    setIsModalVisible(false);
  };

  const draggerProps = {
    accept: '.json,application/json',
    maxCount: 1,
    fileList,
    onChange(info: any) {},
    beforeUpload(file: UploadFile) {
      setFileList((prevlist) => prevlist.concat(file));
      return Promise.resolve();
    },
    customRequest(item: any) {
      if (!item.file) return;

      item.file.status = 'done';
      setFile(item.file);
    },
  };

  return (
    <React.Fragment>
      <Button type={buttonType ?? 'default'} onClick={showModal}>
        {buttonText}
      </Button>
      <Modal
        title={`Upload new version for ${serviceName}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Dragger {...draggerProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support only for a single upload. Strictly prohibit from uploading
            company data or other band files
          </p>
        </Dragger>
      </Modal>
    </React.Fragment>
  );
};

export default UploadJsonModal;
