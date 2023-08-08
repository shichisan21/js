exports.lambda_handler = (event, context, callback) => {
  let isCorrect = false;
  if (
    event.request.privateChallengeParameters.answer ===
    event.request.challengeAnswer
  ) {
    isCorrect = true;
  }
  event.response.answerCorrect = isCorrect;
  callback(null, event);
};
