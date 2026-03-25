const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path"); // 1. path 모듈 추가 확인!

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// 파일 필터 부분에 path 정의 확인
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(new Error("only mp4 is allowed"), false);
    }
    cb(null, true);
  },
}).single("file");

//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
  // 비디오를 서버에 저장한다.
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/getVideoDetail", (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail });
    });
});

router.post("/uploadVideo", (req, res) => {
  // 비디오를 정보들을 저장한다.
  const video = new Video(req.body);

  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post("/getVideos", (req, res) => {
  // 프론트엔드에서 보낸 현재 로그인 유저의 ID
  const currentUserId = req.body.userId;

  // 조건: (공개상태가 1(Public)인 것) OR (작성자가 현재 유저 ID와 일치하는 것)
  Video.find({
    $or: [{ privacy: 1 }, { writer: currentUserId }],
  })
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post("/getSubscriptionVideos", (req, res) => {
  Subscriber.find({ userFrom: req.body.userFrom }).exec(
    (err, subscriberInfo) => {
      if (err) return res.status(400).send(err);

      let subscribedUser = [];
      subscriberInfo.map((subscriber, i) => {
        subscribedUser.push(subscriber.userTo);
      });

      // 구독한 작가들의 영상 중 privacy가 1(Public)인 것만 필터링
      Video.find({
        writer: { $in: subscribedUser },
        privacy: 1, // 이 조건 추가
      })
        .populate("writer")
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, videos });
        });
    },
  );
});

router.post("/thumbnail", (req, res) => {
  let fileDuration = "";
  let thumbnailFileName = "";

  // 2. 비디오 정보 가져오기 (ffprobe)
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    if (err) {
      console.error(err);
      return res.json({ success: false, err });
    }

    fileDuration = metadata.format.duration;

    // 3. ffprobe 콜백 내부에서 썸네일 생성 실행 (순서 보장)
    ffmpeg(req.body.url)
      .on("filenames", function (filenames) {
        console.log("Will generate " + filenames.join(", "));
        // 첫 번째 썸네일 경로 저장
        thumbnailFileName = "uploads/thumbnails/" + filenames[0];
      })
      .on("end", function () {
        console.log("Screenshots taken");
        return res.json({
          success: true,
          url: thumbnailFileName,
          fileDuration: fileDuration,
        });
      })
      .on("error", function (err) {
        console.error(err);
        return res.json({ success: false, err });
      })
      .screenshot({
        // 4. 고유한 파일명을 위해 비디오 파일명(%b)을 활용
        // count: 3은 3장을 찍지만, filenames[0]을 응답으로 보냄
        count: 3,
        folder: "uploads/thumbnails",
        size: "320x240",
        // %b: 입력 파일의 확장자를 제외한 이름 (이미 유니크한 Date.now() 포함됨)
        filename: "thumbnail-%b.png",
      });
  });
});

router.post("/updateViews", (req, res) => {
  // $inc 연산자를 사용하여 views 필드를 1 증가시킵니다.
  Video.findOneAndUpdate(
    { _id: req.body.videoId },
    { $inc: { views: 1 } },
    { new: true }, // 업데이트된 후의 도큐먼트를 반환받음
  ).exec((err, video) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true, views: video.views });
  });
});

module.exports = router;
