function meetingObject() {
  const email = "khursheed.gaddi@e-zest.in";

  const _meetObject = {
    agenda: "My Meeting",
    default_password: false,
    duration: 60,
    password: "123456",
    pre_schedule: false,
    recurrence: {
      end_date_time: "2023-04-02T15:59:00Z",
      end_times: 7,
      monthly_day: 1,
      monthly_week: 1,
      monthly_week_day: 1,
      repeat_interval: 1,
      type: 1,
      weekly_days: "1",
    },
    schedule_for: email,
    settings: {
      additional_data_center_regions: ["TY"],
      allow_multiple_devices: true,
      // alternative_hosts: "harsha.wani@e-zest.in",
      alternative_hosts_email_notification: true,
      approval_type: 2,
      approved_or_denied_countries_or_regions: {
        approved_list: [],
        denied_list: [],
        enable: true,
        method: "approve",
      },
      audio: "telephony",
      authentication_exception: [
        {
          email: "gaddi33khursheed@gmail.com",
          name: "Khursheed",
        },
        
      ],
     
      breakout_room: {
        enable: true,
        rooms: [
          {
            name: "room1",
            participants: [
              email,
              "harsha.wani@e-zest.in",
            ],
          },
        ],
      },
      calendar_type: 1,
      close_registration: false,
      contact_email: email,
      contact_name: "Jill Chill",
      email_notification: true,
      encryption_type: "enhanced_encryption",
      focus_mode: true,
      global_dial_in_countries: [
       
      ],
      host_video: true,
      jbh_time: 0,
      join_before_host: false,
      language_interpretation: {
        enable: true,
        interpreters: [
            
        ],
      },
      meeting_authentication: true,
      meeting_invitees: [
       
      ],
      mute_upon_entry: false,
      participant_video: false,
      private_meeting: false,
      registrants_confirmation_email: true,
      registrants_email_notification: true,
      registration_type: 1,
      show_share_button: true,
      use_pmi: false,
      waiting_room: false,
      watermark: false,
      host_save_video_order: true,
      alternative_host_update_polls: true,
    },
    start_time: "2022-11-10T07:32:55Z",
    template_id: "Dv4YdINdTk+Z5RToadh5ug==",
    timezone: "India Standard Time",
    topic: "My Meeting",
    tracking_fields: [
      {
        field: "field1",
        value: "value1",
      },
    ],
    type: 2,
  };
  return _meetObject;
}

exports.meetingObject = meetingObject;

exports.overrideMeetingObject = (data) => {
  let newMeet = meetingObject();

  // newMeet.agenda = data.agenda;
  // newMeet.duration = data.duration;
  // newMeet.password = data.password;
  // newMeet.host_email = data.host_email;
  // newMeet.start_time = data.start_time;
  // newMeet.recurrence.end_date_time = data.recurrence.end_date_time;
  // newMeet.contact_email = data.contact_email;
  // newMeet.contact_name = data.contact_name;
  // newMeet.meeting_invitees = data.meeting_invitees;
  // newMeet.timezone = data.timezone;
  // newMeet.topic = data.topic;

  for (let [key, value] of Object.entries(data)) {
    if (newMeet[key]) {
      newMeet[key] = value;
    } else {
      console.log(":::::::::::::Does not exists::::::::::::::", key);
    }
  }

  return newMeet;
};
