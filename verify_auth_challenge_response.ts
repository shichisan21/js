import * as AWS from "aws-sdk";
const ses = new AWS.SES({ region: "ap-northeast-1" });

export const lambda_handler = async (event: any) => {
  console.log("Received event:", JSON.stringify(event, null, 2)); // イベントの内容をログに出力
  if (!event || !event.request || !event.request.userAttributes) {
    throw new Error("Invalid event structure");
  }
  const otp = generateOtp();
  await sendOtpToUser(event.request.userAttributes.email, otp);
  event.response.publicChallengeParameters = {
    EMAIL: event.request.userAttributes.email,
  };
  event.response.privateChallengeParameters = { answer: otp };
  event.response.challengeMetadata = "CUSTOM_CHALLENGE";
  return event;
};

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOtpToUser(email: string, otp: string) {
  const senderEmail = process.env.SENDER_EMAIL;
  if (!senderEmail) {
    throw new Error("SENDER_EMAIL environment variable is not set");
  }
  const params = {
    Source: senderEmail,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Your OTP" },
      Body: { Text: { Data: "Your OTP is " + otp } },
    },
  };

  return ses.sendEmail(params).promise();
}
