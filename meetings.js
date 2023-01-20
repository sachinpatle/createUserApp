const express = require("express");

const router = express.Router();

const { authenticate } = require("../models/auth_session");

const { createNewMeeting } = require("./meetings_model");

const _ = require("underscore");


router.post("/meeting/new", async (req, res) => {
  if (_.isEmpty(req.body)) {
    res.status(500).send({
      error: 500,
      message: "Invalid request body!",
    });
  }
  else if(!req.body.start_time){
    res.status(500).send({
      error: 500,
      message: "Must provide a valid meeting start datetime (timestamp)!",
    });
  }
  else if(!req.body.recurrence.end_date_time){
    res.status(500).send({
      error: 500,
      message: "Must provide a valid meeting end datetime (timestamp)!",
    });
  }
  else if(!req.body.emails){
    res.status(500).send({
      error: 500,
      message: "Must provide emails for which meeting to be scheduled."
    });
  }
  else {
    try{

      const _res = await createNewMeeting(req.body);
      
      res.status(200).send(_res);
    } catch (err){
      res.status(500).send({
        error: 500,
        message: err.toString(),
      });
    }
  }
});

module.exports = router;
