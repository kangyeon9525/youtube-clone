import React, { useState } from "react";
import Axios from "axios";
import { Typography, Button, Form, message, Input, Icon, Select } from "antd";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const CategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user);
  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState(0); // value 기반으로 변경
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");

  const onTitleChange = (e) => setVideoTitle(e.currentTarget.value);
  const onDescriptionChange = (e) => setDescription(e.currentTarget.value);
  const onPrivateChange = (value) => setPrivate(value);
  const onCategoryChange = (value) => setCategory(value);

  const onDrop = (files) => {
    let formData = new FormData();
    const config = { header: { "content-type": "multipart/form-data" } };
    formData.append("file", files[0]);

    message.loading("비디오를 업로드 중입니다...", 0);

    Axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      message.destroy();
      if (response.data.success) {
        let variable = {
          url: response.data.url,
          fileName: response.data.fileName,
        };
        setFilePath(response.data.url);

        Axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.url);
            message.success("파일 업로드 및 썸네일 생성 완료!");
          } else {
            alert("썸네일 생성에 실패 했습니다.");
          }
        });
      } else {
        alert("비디오 업로드를 실패했습니다.");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!VideoTitle || !Description || !FilePath || !ThumbnailPath) {
      return message.error("모든 항목을 입력해주세요.");
    }

    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: CategoryOptions[Category].label,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };

    Axios.post("/api/video/uploadVideo", variables).then((response) => {
      if (response.data.success) {
        message.success("성공적으로 업로드를 했습니다.");
        setTimeout(() => props.history.push("/"), 2000);
      } else {
        message.error("비디오 업로드에 실패 했습니다.");
      }
    });
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "3rem auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          textAlign: "left",
          marginBottom: "2rem",
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: "10px",
        }}
      >
        <Title level={3}>비디오 업로드</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Drop Zone */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  border: "2px dashed #e8e8e8",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backgroundColor: "#fafafa",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon
                  type="upload"
                  style={{
                    fontSize: "40px",
                    color: "#606060",
                    marginBottom: "10px",
                  }}
                />
                <Text strong>파일을 선택하거나 드래그 앤 드롭하세요.</Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  MP4, MOV 등 지원
                </Text>
              </div>
            )}
          </Dropzone>

          {/* Thumbnail Zone */}
          <div
            style={{
              width: "100%",
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #f0f0f0",
              borderRadius: "12px",
              backgroundColor: "#fdfdfd",
              overflow: "hidden",
            }}
          >
            {ThumbnailPath ? (
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="thumbnail"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Text type="secondary">업로드 시 썸네일이 생성됩니다.</Text>
            )}
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}
          >
            제목
          </label>
          <Input
            placeholder="동영상을 설명하는 제목을 추가하세요"
            size="large"
            onChange={onTitleChange}
            value={VideoTitle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}
          >
            설명
          </label>
          <TextArea
            rows={4}
            placeholder="시청자에게 동영상에 대해 알려주세요"
            onChange={onDescriptionChange}
            value={Description}
          />
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontWeight: "600",
                display: "block",
                marginBottom: "8px",
              }}
            >
              공개 여부
            </label>
            <Select
              style={{ width: "100%" }}
              size="large"
              defaultValue={0}
              onChange={onPrivateChange}
            >
              {PrivateOptions.map((item, index) => (
                <Option key={index} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ flex: 1 }}>
            <label
              style={{
                fontWeight: "600",
                display: "block",
                marginBottom: "8px",
              }}
            >
              카테고리
            </label>
            <Select
              style={{ width: "100%" }}
              size="large"
              defaultValue={0}
              onChange={onCategoryChange}
            >
              {CategoryOptions.map((item, index) => (
                <Option key={index} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <div
          style={{
            textAlign: "right",
            borderTop: "1px solid #f0f0f0",
            paddingTop: "20px",
          }}
        >
          <Button
            type="primary"
            size="large"
            style={{
              padding: "0 40px",
              borderRadius: "4px",
              fontWeight: "600",
            }}
            onClick={onSubmit}
          >
            동영상 업로드
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
