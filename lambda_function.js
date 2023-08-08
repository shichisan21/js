exports.lambda_handler = (event, context, callback) => {
  const message = "Hello from Lambda using JavaScript!";
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "GET,OPTIONS,POST,PUT",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    },
    body: message,
  };
  callback(null, response);
};
