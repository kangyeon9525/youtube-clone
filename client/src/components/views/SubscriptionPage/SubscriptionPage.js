import React, { useEffect, useState } from "react";
import { Card, Col, Typography, Row, Avatar } from "antd";
import Axios from "axios";
import moment from "moment";

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
  const [Video, setVideo] = useState([]);

  useEffect(() => {
    const subscriptionVariable = {
      userFrom: localStorage.getItem("userId"),
    };

    Axios.post("/api/video/getSubscriptionVideos", subscriptionVariable).then(
      (response) => {
        if (response.data.success) {
          setVideo(response.data.videos);
        } else {
          alert("비디오 가져오기를 실패 했습니다.");
        }
      },
    );
  }, []);

  const renderCards = Video.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <a href={`/video/post/${video._id}`}>
            <img
              style={{ width: "100%", borderRadius: "12px" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
            <div
              className="duration"
              style={{
                bottom: 0,
                right: 0,
                position: "absolute",
                margin: "4px",
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.8)",
                padding: "2px 4px",
                borderRadius: "2px",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              <span>
                {minutes} : {seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </div>
          </a>
        </div>

        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={
            <span style={{ color: "#030303", fontWeight: "bold" }}>
              {video.title}
            </span>
          }
        />

        <div style={{ marginLeft: "48px", marginTop: "4px" }}>
          <span style={{ color: "#606060", fontSize: "14px" }}>
            {video.writer.name}
          </span>
          <br />
          <span style={{ color: "#606060", fontSize: "14px" }}>
            {video.views} views • {moment(video.createdAt).fromNow()}
          </span>
        </div>
      </Col>
    );
  });

  return (
    // LandingPage와 동일하게 width 90%, margin auto 설정
    <div style={{ width: "90%", margin: "3rem auto" }}>
      <Title level={3}>Subscriptions</Title>
      {/* 마진을 제거하여 LandingPage의 구분선과 높이를 일치시킴 */}
      <hr style={{ border: "0.5px solid #f0f0f0" }} />
      <Row gutter={[16, 16]}>{renderCards}</Row>
    </div>
  );
}

export default SubscriptionPage;
