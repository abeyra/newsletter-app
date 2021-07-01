const bodyParser = require("body-parser");
const request = require("request");
const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})

// Mailchimp Parameters
mailchimp.setConfig({
  apiKey: "aa97e21b0c6379bc4083bb9af0e86737",
  server: "us6",
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

// API KEY
// aa97e21b0c6379bc4083bb9af0e86737-us6

// Server
// -us6

// Audience ID
// 8aae4d855d.
