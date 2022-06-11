const bodyParser = require("body-parser");
const request = require("request");
const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})

// Mailchimp Parameters
mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER,
});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  console.log(req.body);

// Object prepared for Mailchimp
  const listId = "8aae4d855d";
   const subscribingUser = {
     firstName: firstName,
     lastName: lastName,
     email: email,
   }

  const run = async () => {

  try {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });

  console.log(response);
  res.sendFile(__dirname + "/success.html");
  }

  catch (err){

    console.log(err.status);
    res.sendFile(__dirname + "/failure.html");
  }
}
run();

});

app.post("/failure.html", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Port 3000 online");
});

