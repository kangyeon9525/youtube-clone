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

  const onVideoEnded = () => {
    Axios.post("/api/video/updateViews", variable).then((response) => {
      if (response.data.success) {
        // UI상에서도 조회수가 즉시 반영되도록 상태 업데이트 (선택 사항)
        setVideoDetail({ ...VideoDetail, views: response.data.views });
      } else {
        console.error("조회수 업데이트에 실패했습니다.");
      }
    });
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
      <div style={{ width: "100%", backgroundColor: "#fff" }}>
        <Row
          gutter={[24, 24]}
          style={{
            padding: "20px 2%", // 패딩을 살짝 줄임
            maxWidth: "1400px", // 너무 퍼지지 않게 최대 너비 설정
            margin: "0 auto", // 중앙 정렬
          }}
        >
          {/* 본문 영역 (비디오 + 댓글) */}
          <Col lg={16} xl={17} xs={24}>
            <div style={{ width: "100%" }}>
              <video
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  backgroundColor: "#000",
                }}
                src={`http://localhost:5000/${VideoDetail.filePath}`}
                controls
                onEnded={onVideoEnded}
              />

              <Title
                level={3}
                style={{ marginTop: "15px", marginBottom: "10px" }}
              >
                {VideoDetail.title}
              </Title>

              {/* 채널 정보 및 버튼 영역 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginBottom: "15px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                  <div>{subscribeButton}</div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f2f2f2",
                    padding: "6px 16px",
                    borderRadius: "20px",
                  }}
                >
                  <LikeDislikes
                    video
                    userId={localStorage.getItem("userId")}
                    videoId={videoId}
                  />
                </div>
              </div>

              {/* 설명란 */}
              <div
                style={{
                  backgroundColor: "#f2f2f2",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "14px",
                }}
              >
                <Text strong>{VideoDetail.views.toLocaleString()} views</Text>
                <br />
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    border: "none",
                    background: "none",
                    padding: 0,
                    marginTop: "5px",
                  }}
                >
                  {VideoDetail.description}
                </pre>
              </div>

              <Divider />
              <Comment
                refreshFunction={refreshFunction}
                commentLists={Comments}
                postId={videoId}
              />
            </div>
          </Col>

          {/* 우측 추천 영상 (사이드바) - 여백을 없애서 꽉 차게 함 */}
          <Col lg={8} xl={7} xs={24} style={{ paddingLeft: "10px" }}>
            <SideVideo />
          </Col>
        </Row>
      </div>
    );
  } else {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>...loading </div>
    );
  }
}

export default VideoDetailPage;
