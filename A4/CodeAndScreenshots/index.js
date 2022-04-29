exports.handler = async (event) => {
  //https://docs.aws.amazon.com/step-functions/latest/dg/tutorial-creating-lambda-state-machine.html
  //Used this a reference to create step function and lambda
  let response = {};
  if (event.email.includes("rhawkey@dal.ca")) {
    response = {
      statusCode: 200,
      body: "Tier 3",
      message: event,
    };
  } else if (
    event.message.includes("computer") ||
    event.message.includes("laptop") ||
    event.message.includes("printer")
  ) {
    response = {
      statusCode: 200,
      body: "Tier 2",
      message: event,
    };
  } else if (
    event.message.includes("account") ||
    event.message.includes("password")
  ) {
    response = {
      statusCode: 200,
      body: "Tier 1",
      message: event,
    };
  } else {
    response = {
      statusCode: 200,
      body: "Unknown",
      message: event,
    };
  }
  return response;
};
