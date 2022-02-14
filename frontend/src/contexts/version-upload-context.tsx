import React from 'react';

const VersionUploadContext = React.createContext({
  onNewVersionUpload: () => {},
});

export default VersionUploadContext;
