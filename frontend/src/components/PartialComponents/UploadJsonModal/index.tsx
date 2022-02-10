import React, { useState, useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Modal, Upload, message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { InboxOutlined } from '@ant-design/icons';
import { Stores } from '../../../stores/storeIdentifier';
import TapiraApiStore from '../../../stores/tapiraApiStore';

const { Dragger } = Upload;

const UploadJsonModal = ({
  serviceName,
  tapiraApiStore,
}: {
  serviceName: string;
  [Stores.TapiraApiStore]?: TapiraApiStore;
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [uploadFormData, setUploadFormData] = useState<FormData | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onUploadFile = useCallback(
    async (formData: FormData) => {
      const newVersion = await tapiraApiStore?.uploadExistingAPISpecifications(
        serviceName,
        formData
      );
      message.success(
        `The new version for ${serviceName} was successfully updated. The new version is ${newVersion}`
      );
    },
    [serviceName, tapiraApiStore]
  );

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setFileList([]);
    setIsModalVisible(false);
  };

  const handleOk = () => {
    if (uploadFormData !== null) {
      onUploadFile(uploadFormData);
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
      const blob = new Blob([item.file], {
        type: 'application/json',
      });
      const formData = new FormData();
      formData.append('file', blob);
      setUploadFormData(formData);
    },
  };

  return (
    <React.Fragment>
      <Button type="primary" onClick={showModal}>
        Upload
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

export default inject(Stores.TapiraApiStore)(observer(UploadJsonModal));
