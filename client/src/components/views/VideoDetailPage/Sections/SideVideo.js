import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";

function SideVideo() {
  const [sideVideos, setSideVideos] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const userId = user.userData ? user.userData._id : null;
    const variables = { userId: userId };

    Axios.post("/api/video/getVideos", variables).then((response) => {
      if (response.data.success) {
        setSideVideos(response.data.videos);
      } else {
        alert("비디오 가져오기를 실패 했습니다.");
      }
    });
  }, [user.userData]);

  const renderSideVideo = sideVideos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={index}
        style={{
          display: "flex",
          marginBottom: "12px", // 간격을 유튜브와 비슷하게 조정
          cursor: "pointer",
          width: "100%", // 전체 너비 사용
        }}
      >
        {/* 썸네일 크기를 200px로 확대 */}
        <div
          style={{
            width: "200px",
            height: "112px", // 16:9 비율 유지
            marginRight: "12px",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <a href={`/video/post/${video._id}`}>
            <img
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "8px",
                objectFit: "cover",
              }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
            <div
              style={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                backgroundColor: "rgba(0,0,0,0.8)",
                color: "#fff",
                padding: "2px 4px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
          </a>
        </div>

        {/* 텍스트 영역 - 이제 빈 공간 없이 꽉 참 */}
        <div style={{ flex: 1 }}>
          <a href={`/video/post/${video._id}`} style={{ color: "#030303" }}>
            <span
              style={{
                fontSize: "14px", // 사이드바는 14px이 가장 깔끔합니다
                fontWeight: "600",
                lineHeight: "1.4",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                color: "#0f0f0f",
                marginBottom: "4px",
              }}
            >
              {video.title}
            </span>
            <div style={{ color: "#606060", fontSize: "12px" }}>
              <div style={{ marginBottom: "2px" }}>{video.writer.name}</div>
              <span>{video.views.toLocaleString()} views</span>
            </div>
          </a>
        </div>
      </div>
    );
  });

  return <div style={{ marginTop: "0" }}>{renderSideVideo}</div>;
}

export default SideVideo;
