import { LogModel } from "../../schemas/index.js";


// Function to log user actions
const logAction = async (userId, action, actionMessage, req) => {
  const logDetails = {
    user: userId,
    action: action,
    actionMessage: actionMessage,
    details: {
      params: req.params,
      body: req.body,
      query: req.query,
    },
    // ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  };

  await LogModel.create(logDetails);
};

export default logAction;
