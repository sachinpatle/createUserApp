const jwt = require("jsonwebtoken");

const axios = require("axios");

const { ZoomAPI } = require("zoom-api-client");

const Config = require("./config.json");

const { sendMails } = require("./mailer_model");

const {
  meetingObject,
  overrideMeetingObject,
} = require("./meeting_object");

/**
 * create new zoom meeting
 * @param {Object} body - meeting details object.
 */
exports.createNewMeeting = async (body) => {
  //   const base_url = "https://api.zoom.us/v2";
  //   const endpoint = "/users/me/meetings";

  const payload = {
    iss: Config.Zoom.apiKey,
    exp: new Date().getTime() + 5000,
  };

  try {
    const token = jwt.sign(payload, Config.Zoom.apiSecret);

    const Zoom = new ZoomAPI({
      APIKey: Config.Zoom.apiKey,
      APISecret: Config.Zoom.apiSecret,
    });
    // var User = {
    //     email: email,
    //     type: 1
    //    }
    const userRes = await Zoom.listUsers();
    console.log("USERSS:::", userRes);

    const __body = overrideMeetingObject(body);

    const __header = {
      Authorization: "Bearer " + token,
      "User-Agent": "Zoom-api-Jwt-Request",
      "Content-Type": "application/json",
    };

    const _createMeetingEndpoint =
      "https://api.zoom.us/v2/users/" + userRes.users[0].id + "/meetings";

    const result = await axios.post(
      _createMeetingEndpoint,
      JSON.stringify(__body),
      {
        headers: __header,
      }
    );
    // sendResponse.setSuccess(200, 'Success', result.data);
    console.log("Result::", result);
    const meetResponse = result.data;
    const mailReqData = { mails: body.emails, startDate: body.start_time, test: body.test, ...meetResponse };
    try {

      const _mailRes = await sendMails(mailReqData);
      console.log("Mail::RES:::", _mailRes);
      return meetResponse;
    } catch (err) {
      throw err;
    }

  } catch (error) {
    console.log("ERR::", error);
    throw error;
  }
};
