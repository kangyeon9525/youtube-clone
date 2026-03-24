import React, { useEffect, useState } from "react";
import { Row, Col, Avatar, Typography, Divider } from "antd";
import Axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";
import LikeDislikes from "./Sections/LikeDislikes";

const { Title, Text } = Typography;

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const variable = { videoId: videoId };

  const [VideoDetail, setVideoDetail] = useState([]);
  const [Comments, setComments] = useState([]);

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        setVideoDetail(response.data.videoDetail);
      } else {
        alert("비디오 정보를 가져오길 실패했습니다.");
      }
    });

    Axios.post("/api/comment/getComments", variable).then((response) => {
      if (response.data.success) {
        setComments(response.data.comments);
      } else {
        alert("코멘트 정보를 가져오길 실패했습니다.");
      }
    });
  }, []);

  const refreshFunction = (newComment) => {
    setComments(Comments.concat(newComment));
  };

  if (VideoDetail.writer) {
    const subscribeButton = VideoDetail.writer._id !==
      localStorage.getItem("userId") && (
      <Subscribe
        userTo={VideoDetail.writer._id}
        userFrom={localStorage.getItem("userId")}
      />
    );

    return (
      <Row gutter={[24, 24]} style={{ padding: "20px 5%" }}>
        <Col lg={17} xs={24}>
          <div style={{ width: "100%" }}>
            {/* 비디오 플레이어 */}
            <video
              style={{
                width: "100%",
                borderRadius: "12px",
                backgroundColor: "#000",
              }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            />

            {/* 제목 영역 */}
            <Title
              level={3}
              style={{ marginTop: "15px", marginBottom: "10px" }}
            >
              {VideoDetail.title}
            </Title>

            {/* 채널정보 및 버튼 영역 (유튜브 스타일 핵심) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* 채널정보 영역 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Avatar size={44} src={VideoDetail.writer.image} />
                <div
                  style={{
                    marginLeft: "12px",
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "16px",
                  }}
                >
                  <Text strong style={{ fontSize: "16px", color: "#0f0f0f" }}>
                    {VideoDetail.writer.name}
                  </Text>
                </div>

                {/* 구독 버튼 및 집계 숫자 */}
                <div>{subscribeButton}</div>
              </div>

              {/* 좋아요 버튼 영역 (이미 수정된 알약 스타일) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#f2f2f2",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  marginBottom: "10px",
                }}
              >
                <LikeDislikes
                  video
                  userId={localStorage.getItem("userId")}
                  videoId={videoId}
                />
              </div>
            </div>

            {/* 설명란 상자 */}
            <div
              style={{
                backgroundColor: "#f2f2f2",
                padding: "12px",
                borderRadius: "12px",
                marginTop: "15px",
                fontSize: "14px",
              }}
            >
              <Text strong>{VideoDetail.views} views</Text>
              <br />
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  border: "none",
                  background: "none",
                  padding: 0,
                }}
              >
                {VideoDetail.description}
              </pre>
            </div>

            <Divider />

            {/* 댓글 영역 */}
            <Comment
              refreshFunction={refreshFunction}
              commentLists={Comments}
              postId={videoId}
            />
          </div>
        </Col>

        {/* 우측 추천 영상 */}
        <Col lg={7} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>...loading </div>
    );
  }
}

export default VideoDetailPage;
