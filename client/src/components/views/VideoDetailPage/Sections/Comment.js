import Axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Input, Button, Divider } from "antd";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

function Comment(props) {
  const videoId = props.postId;
  const user = useSelector((state) => state.user);
  const [commentValue, setCommentValue] = useState("");

  const handleClick = (event) => {
    setCommentValue(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: videoId,
    };

    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        setCommentValue("");
        props.refreshFunction(response.data.result);
      } else {
        alert("커멘트를 저장하지 못했습니다.");
      }
    });
  };

  return (
    <div>
      <br />
      {/* 댓글 개수 표시 */}
      <p style={{ fontSize: "16px", fontWeight: "bold" }}>
        댓글 {props.commentLists && props.commentLists.length}개
      </p>

      {/* 루트 댓글 입력창 - 유튜브 스타일 */}
      <div style={{ display: "flex", marginTop: "20px", marginBottom: "40px" }}>
        <Avatar
          src={user.userData && user.userData.image}
          style={{ width: "40px", height: "40px" }}
        />
        <form
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            marginLeft: "15px",
          }}
          onSubmit={onSubmit}
        >
          <Input.TextArea
            style={{
              width: "100%",
              borderRadius: "0",
              border: "none",
              borderBottom: "1px solid #ccc",
              padding: "5px 0",
            }}
            onChange={handleClick}
            value={commentValue}
            placeholder="댓글 추가..."
            autoSize={{ minRows: 1 }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <Button
              style={{ border: "none", background: "none" }}
              onClick={() => setCommentValue("")}
            >
              취소
            </Button>
            <Button
              style={{
                borderRadius: "20px",
                backgroundColor: commentValue ? "#065fd4" : "#f2f2f2",
                color: commentValue ? "white" : "#909090",
              }}
              disabled={!commentValue}
              onClick={onSubmit}
            >
              댓글
            </Button>
          </div>
        </form>
      </div>

      {/* 댓글 목록 */}
      {props.commentLists &&
        props.commentLists.map(
          (comment, idx) =>
            !comment.responseTo && (
              <React.Fragment key={idx}>
                <SingleComment
                  refreshFunction={props.refreshFunction}
                  comment={comment}
                  postId={videoId}
                />
                <ReplyComment
                  refreshFunction={props.refreshFunction}
                  parentCommentId={comment._id}
                  postId={videoId}
                  commentLists={props.commentLists}
                />
              </React.Fragment>
            ),
        )}
    </div>
  );
}

export default Comment;
