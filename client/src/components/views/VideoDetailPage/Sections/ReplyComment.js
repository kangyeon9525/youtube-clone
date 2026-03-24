import React, { useEffect, useState } from "react";
import SingleComment from "./SingleComment";
import { Icon } from "antd";

function ReplyComment(props) {
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.commentLists.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [props.commentLists, props.parentCommentId]);

  const renderReplyComment = (parentCommentId) =>
    props.commentLists.map((comment, index) => (
      <React.Fragment key={index}>
        {comment.responseTo === parentCommentId && (
          <div style={{ marginLeft: "40px" }}>
            <SingleComment
              refreshFunction={props.refreshFunction}
              comment={comment}
              postId={props.postId}
            />
            <ReplyComment
              refreshFunction={props.refreshFunction}
              parentCommentId={comment._id}
              postId={props.postId}
              commentLists={props.commentLists}
            />
          </div>
        )}
      </React.Fragment>
    ));

  return (
    <div>
      {ChildCommentNumber > 0 && (
        <div
          style={{
            fontSize: "14px",
            color: "#065fd4",
            fontWeight: "bold",
            cursor: "pointer",
            marginLeft: "40px",
            marginBottom: "10px",
          }}
          onClick={() => setOpenReplyComments(!OpenReplyComments)}
        >
          <Icon
            type={OpenReplyComments ? "caret-up" : "caret-down"}
            style={{ marginRight: "8px" }}
          />
          답글 {ChildCommentNumber}개 보기
        </div>
      )}
      {OpenReplyComments && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
