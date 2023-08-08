import { Context, Callback } from "aws-lambda";

export const lambda_handler = (
  event: any,
  context: Context,
  callback: Callback
) => {
  if ("session" in event && event.session) {
    for (const session of event.session) {
      if (
        session.challengeName === "CUSTOM_CHALLENGE" &&
        session.challengeResult
      ) {
        event.response.issueTokens = true;
        event.response.failAuthentication = false;
      } else if (
        session.challengeName === "CUSTOM_CHALLENGE" &&
        !session.challengeResult
      ) {
        event.response.issueTokens = false;
        event.response.failAuthentication = true;
      }
    }
  } else {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  }
  callback(null, event);
};
