const handler = async (event: any) => {
  // ユーザーが提供した答え（この場合はOTP）が正しいかどうかを検証します。
  if (
    event.request.privateChallengeParameters.answer ===
    event.request.challengeAnswer
  ) {
    event.response.answerCorrect = true;
  } else {
    event.response.answerCorrect = false;
  }

  return event;
};

export { handler };
