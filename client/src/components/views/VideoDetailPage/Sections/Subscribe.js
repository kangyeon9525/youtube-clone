import Axios from "axios";
import React, { useEffect, useState } from "react";

function Subscribe(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0); // 실제 구독자 수 상태
  const [Subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const variable = { userTo: props.userTo };

    // 1. 해당 사용자의 전체 구독자 수 가져오기
    Axios.post("/api/subscribe/subscribeNumber", variable).then((response) => {
      if (response.data.success) {
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert("구독자 수 정보를 받아오지 못했습니다.");
      }
    });

    // 2. 현재 로그인한 내가 이 사용자를 구독 중인지 확인
    const subscribeVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem("userId"),
    };

    Axios.post("/api/subscribe/subscribed", subscribeVariable).then(
      (response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        }
      },
    );
  }, [props.userTo]); // 영상이 바뀌면 구독자 수도 새로 고침

  const onSubscribe = () => {
    const subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    if (Subscribed) {
      // 구독 취소 로직
      Axios.post("/api/subscribe/unSubscribe", subscribedVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber - 1); // 숫자 즉시 감소
            setSubscribed(false);
          } else {
            alert("구독 취소 실패");
          }
        },
      );
    } else {
      // 구독 하기 로직
      Axios.post("/api/subscribe/subscribe", subscribedVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber + 1); // 숫자 즉시 증가
            setSubscribed(true);
          } else {
            alert("구독 실패");
          }
        },
      );
    }
  };

  const buttonStyle = {
    backgroundColor: Subscribed ? "#f2f2f2" : "#0f0f0f",
    borderRadius: "20px",
    color: Subscribed ? "#0f0f0f" : "#ffffff",
    padding: "8px 16px",
    fontWeight: "600",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* 구독자 수 표시 (스타일 상관없이 버튼 옆에 배치) */}
      <span style={{ marginRight: "12px", color: "#606060", fontSize: "14px" }}>
        구독자 {SubscribeNumber}명
      </span>
      <button style={buttonStyle} onClick={onSubscribe}>
        {Subscribed ? "구독중" : "구독"}
      </button>
    </div>
  );
}

export default Subscribe;
