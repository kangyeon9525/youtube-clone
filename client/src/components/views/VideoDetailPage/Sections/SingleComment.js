import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import { useSelector } from "react-redux";
import Axios from "axios";
import LikeDislikes from "./LikeDislikes";

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState("");

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };
  const onHandleChange = (event) => {
    setCommentValue(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
    };

    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        setCommentValue("");
        setOpenReply(false);
        props.refreshFunction(response.data.result);
      } else {
        alert("커멘트를 저장하지 못했습니다.");
      }
    });
  };

  const actions = [
    <LikeDislikes
      userId={localStorage.getItem("userId")}
      commentId={props.comment._id}
    />,
    <span
      onClick={onClickReplyOpen}
      key="comment-basic-reply-to"
      style={{
        marginLeft: "10px",
        color: "#606060",
        fontWeight: "500",
        cursor: "pointer",
      }}
    >
      답글
    </span>,
  ];

  return (
    <div>
      <Comment
        actions={actions}
        author={
          <span style={{ color: "#0f0f0f", fontWeight: "bold" }}>
            {props.comment.writer && props.comment.writer.name}
          </span>
        }
        avatar={
          <Avatar src={props.comment.writer && props.comment.writer.image} />
        }
        content={
          <p style={{ color: "#0f0f0f", fontSize: "14px", marginTop: "4px" }}>
            {props.comment.content}
          </p>
        }
      />

      {OpenReply && (
        <div style={{ display: "flex", marginLeft: "40px", marginTop: "10px" }}>
          <Avatar src={user.userData && user.userData.image} size="small" />
          <form
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              marginLeft: "10px",
            }}
            onSubmit={onSubmit}
          >
            <Input.TextArea
              style={{
                border: "none",
                borderBottom: "1px solid #ccc",
                borderRadius: 0,
                padding: "5px 0",
              }}
              onChange={onHandleChange}
              value={CommentValue}
              placeholder="답글 추가..."
              autoSize={{ minRows: 1 }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "8px",
              }}
            >
              <Button
                size="small"
                style={{ border: "none" }}
                onClick={() => setOpenReply(false)}
              >
                취소
              </Button>
              <Button
                size="small"
                style={{
                  borderRadius: "15px",
                  backgroundColor: CommentValue ? "#065fd4" : "#f2f2f2",
                  color: CommentValue ? "white" : "#909090",
                }}
                onClick={onSubmit}
              >
                답글
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default SingleComment;
