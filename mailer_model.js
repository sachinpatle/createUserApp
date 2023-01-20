var nodemailer = require("nodemailer");

const Config = require("./config.json");
const {
    timestampToDate,
    timestampToTime,
} = require("./timestamp_to_date");

exports.sendMails = async (meetingDetails) => {
    console.log("meetingDetails", meetingDetails);
    try {
        var transporter = nodemailer.createTransport({      
            host: Config.Mailer.host,
            port: Config.Mailer.port, // have tried 465
            secureConnection: true,
            requireTLS: true, // don't turn off STARTTLS support
            auth: {
                user: Config.Mailer.user,
                pass: Config.Mailer.pass,
            },
        });

        const hiringForPosition = meetingDetails.test;

        const mailOptions = {
            from: Config.Mailer.user,
            to: meetingDetails.mails,
            subject: meetingDetails.topic,
            text: meetingDetails.agenda,
            html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <title>Mail Templete</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        .banner {
            height: 280px;
            height: 576px;
            background-size: 100% 100%;
            background-repeat: no-repeat;

          
        }


        .widget {
            display: flex;
            padding: 5px;
            color: white;

        }

        .widget .title {

            font-size: 12px;
            padding: 0px;
            margin-left: 11px;
            margin-top: 3px;
        }

        .widget img {
            width: 35px;
        }

        .jumbotron {
            margin-bottom: 0px;
            border-radius: 0px !important;
        }

        .list {
            margin-bottom: 5px;
            background-color: white;
            font-size: 16px;
            text-align: left;
            padding: 20px;
        }


        .banner .banner-btn {
            text-align: left;
            padding: 10px 10px 10px 75px;
        }

        .banner-btn button {
            border: 0;
            background: none;
            background-color: #f37430;
            padding: 10px 30px 10px 30px;
            color: white;
            font-size: 26px;
            width: 30%;
        }


       

        .banner .heading {
            text-align: left;
            padding: 65px 10px 65px 75px;
            font-size: 32px;
            font-weight: bold;
            line-height: 1.6;
          
            width: 42%;
            color: #030e53
        }



        .banner-img {
            width: 112px;
            padding-bottom: 53px;
        }


        .list img {
            width: 45px;
            height: 45px;
            background-color: #efe7e7;
            border-radius: 50%;
        }

        .maincontainer {
            text-align: left;
            padding: 80px 20px 20px 70px;
            font-size: 18x;
        }

        .maincontainer p {
            padding: 4px 4px 4px 5px;

        }

        

        .maincontainer .banner-btn {
            text-align: center;
            margin-top: 35px;
    padding-bottom: 35px;
        }

        .maincontainer .banner-btn button {


            width: 30%;


        }


        .glist{
            margin-left: 50px;
        }
        .glist li{
            padding-bottom: 8px;
                        font-weight: bold;
        }

        /* 992 */
        @media screen and (max-width: 992px) {
            .centertext-mob {
                justify-content: center;
            }
        }

        .cust-container {
            padding-left: 0;
            padding-right: 0;
            box-shadow: rgb(0 0 0 / 2%) 0px 1px 3px 0px, rgb(27 31 35 / 15%) 0px 0px 0px 1px;
        }

        .highlight-p{
            font-weight: bold;
    font-size: 20px;
    color: #052948;
        }
    </style>

</head>

<body>
    <div class="text-center container cust-container">
            <div>
            <div class="maincontainer">
                <p style="font-weight: bold; font-size: 20px">

                    Dear recievers,
                    We are going to blocking your time for the ${hiringForPosition} Interview .
                </p>
                <p>
                    Your application for the ${hiringForPosition} position stood out to us and we would like to invite you
                    for an interview
                </p>
                <p class="highlight-p">Data &nbsp; &nbsp; : &nbsp; &nbsp; ${timestampToDate(
                meetingDetails.startDate
            )}</p>
                <p  class="highlight-p">Time &nbsp; &nbsp; : &nbsp; &nbsp; ${timestampToTime(
                meetingDetails.startDate
            )}</p>
                <p  class="highlight-p">Duration &nbsp; &nbsp; : &nbsp; &nbsp; ${meetingDetails.duration
                }</p>
                <p  class="highlight-p">Meeting URL: </p> <a>${meetingDetails.start_url
                }</a>
                <br><br>
                <p>
                    For attending the interview you need to following the guide line which mentioned as below for a
                    better impression of interview
                <ul class="glist">
                    <li>Join interview link before 5 minutes</li>
                    <li>Make sure you have a strong internet connectivity</li>
                    <li>Silence in background and not making and intrupting noise</li>
                </ul>
                </p>

                <div class="banner-btn">
                    <a href='${meetingDetails.start_url
                }'><button>Join Now</button></a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `,
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Cannot send mail: Error: ", error);
            } else {
                console.log("Mail sent:");
                console.log(info);
                return info;
            }
        });
    } catch (err) {
        throw err;
    }
};
