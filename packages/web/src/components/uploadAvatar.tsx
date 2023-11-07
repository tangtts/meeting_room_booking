import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";
import { useEffect, useState } from "react";

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export default function UploadAvatar({image,onSuccess}:{
  image:string,
  onSuccess:(s:string)=>void
}) {
  const [loading, setLoading] = useState(false);
  const [imageUrl,setImageUrl] = useState<string>(image)

  useEffect(()=>{
    setImageUrl(image)
  },[image])

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      if(info.file.response.code == 201){
        let path =  info.file.response.data.url
        setImageUrl(path)
        onSuccess(path)
      }
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const [messageApi, contextHolder] = message.useMessage();
  return (<>
    {contextHolder}
    <Upload
      name="file"
      listType="picture-card"
      showUploadList={false}
      action="http://localhost:4396/upload/upload"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  </>)
}