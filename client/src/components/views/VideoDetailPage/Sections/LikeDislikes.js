import React, { useEffect, useState } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);

  let variable = {};
  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    Axios.post("/api/like/getLikes", variable).then((response) => {
      if (response.data.success) {
        setLikes(response.data.likes.length);
        response.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction("liked");
          }
        });
      }
    });

    Axios.post("/api/like/getDislikes", variable).then((response) => {
      if (response.data.success) {
        setDislikes(response.data.dislikes.length);
        response.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDislikeAction("disliked");
          }
        });
      }
    });
  }, []); // 의존성 배열 추가 (무한 루프 방지)

  const onLike = () => {
    if (LikeAction === null) {
      Axios.post("/api/like/upLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked");
          if (DislikeAction !== null) {
            setDislikes(Dislikes - 1);
            setDislikeAction(null);
          }
        }
      });
    } else {
      Axios.post("/api/like/unLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        }
      });
    }
  };

  const onDislike = () => {
    if (DislikeAction !== null) {
      Axios.post("/api/like/unDislike", variable).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes - 1);
          setDislikeAction(null);
        }
      });
    } else {
      Axios.post("/api/like/upDislike", variable).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction("disliked");
          if (LikeAction !== null) {
            setLikes(Likes - 1);
            setLikeAction(null);
          }
        }
      });
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span
        key="comment-basic-like"
        style={{ marginRight: "16px", display: "flex", alignItems: "center" }}
      >
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={LikeAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
            /* 아이콘 크기 확대 */
            style={{
              fontSize: "22px",
              cursor: "pointer",
              color: LikeAction === "liked" ? "#065fd4" : "inherit",
            }}
          />
        </Tooltip>
        <span
          style={{
            paddingLeft: "8px",
            cursor: "auto",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {Likes}
        </span>
      </span>

      <span
        key="comment-basic-dislike"
        style={{ display: "flex", alignItems: "center" }}
      >
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={DislikeAction === "disliked" ? "filled" : "outlined"}
            onClick={onDislike}
            /* 아이콘 크기 확대 */
            style={{
              fontSize: "22px",
              cursor: "pointer",
              color: DislikeAction === "disliked" ? "#065fd4" : "inherit",
            }}
          />
        </Tooltip>
        <span
          style={{
            paddingLeft: "8px",
            cursor: "auto",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {Dislikes}
        </span>
      </span>
    </div>
  );
}

export default LikeDislikes;
