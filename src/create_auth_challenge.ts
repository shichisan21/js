import AWS from "aws-sdk";
import * as dotenv from "dotenv";
dotenv.config();

const ses = new AWS.SES({ region: "ap-northeast-1" });

const handler = async (event: any) => {
  console.log("incoming event", event);

  // カスタムチャレンジが必要でない場合、そのままイベントを返す
  if (event.request.challengeName !== "CUSTOM_CHALLENGE") {
    return event;
  }

  // OTPを生成
  const otp = generateOtp();

  // ユーザーにOTPをメールで送信
  await sendOtpToUser(event.request.userAttributes.email, otp);

  // レスポンスを設定
  event.response.publicChallengeParameters = {
    EMAIL: event.request.userAttributes.email, // 公開パラメーターにはEメールを含める
  };
  console.log("event check", event);

  event.response.privateChallengeParameters = { answer: otp }; // 私有パラメーターには正しいOTPを含める
  event.response.challengeMetadata = "CUSTOM_CHALLENGE";

  return event;
};

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpToUser(email: string, otp: string) {
  const senderEmail = process.env.SENDER_EMAIL;
  if (!senderEmail) {
    throw new Error("Sender email is undefined");
  }

  const params = {
    Source: senderEmail,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Your OTP" },
      Body: { Text: { Data: "Your OTP is " + otp } },
    },
  };

  if (!params.Source) {
    throw new Error("Sender email is undefined");
  }

  return ses.sendEmail(params).promise();
}

export { handler };
