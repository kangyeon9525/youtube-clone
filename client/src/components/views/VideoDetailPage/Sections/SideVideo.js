import React, { useEffect, useState } from "react";
import Axios from "axios";

function SideVideo() {
  const [sideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    Axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        setSideVideos(response.data.videos);
      } else {
        alert("비디오 가져오기를 실패 했습니다.");
      }
    });
  }, []);

  const renderSideVideo = sideVideos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={index}
        style={{ display: "flex", marginBottom: "12px", cursor: "pointer" }}
      >
        {/* 썸네일 왼쪽 */}
        <div
          style={{
            width: "160px",
            height: "94px",
            marginRight: "12px",
            position: "relative",
          }}
        >
          <a href={`/video/${video._id}`}>
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
            {/* 재생시간 표시 */}
            <div
              style={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                backgroundColor: "rgba(0,0,0,0.8)",
                color: "#fff",
                padding: "2px 4px",
                borderRadius: "4px",
                fontSize: "11px",
              }}
            >
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
          </a>
        </div>

        {/* 텍스트 정보 오른쪽 */}
        <div style={{ flex: 1 }}>
          <a href={`/video/${video._id}`} style={{ color: "#030303" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {video.title}
            </span>
            <div
              style={{ marginTop: "4px", color: "#606060", fontSize: "12px" }}
            >
              <span>{video.writer.name}</span>
              <br />
              <span>{video.views} views</span>
            </div>
          </a>
        </div>
      </div>
    );
  });

  return <div style={{ marginTop: "0" }}>{renderSideVideo}</div>;
}

export default SideVideo;
