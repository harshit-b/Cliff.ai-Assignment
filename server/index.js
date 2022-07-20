//Dependencies
require("dotenv").config();
const {google} = require('googleapis');
const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const User = require('./models/user')
const Sheet = require('./models/sheet')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const opn = require('open');
const path = require('path');
const fs = require('fs');

const session = require("express-session");

const keyfile = path.join(__dirname, 'credentials.json');
const keys = JSON.parse(fs.readFileSync(keyfile));
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/userinfo.email'];

//Variable to store the name of user of the subscribed googleID
var Username=""

// Create an oAuth2 client to authorize the API call
const client = new google.auth.OAuth2(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);

// Generate the url that will be used for authorization
this.authorizeUrl = client.generateAuthUrl({
  scope: scopes,
});

//Must do because in development using two different servers for React and Node.
app.use(cors())

//Parse everything into json
app.use(express.json())

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
  }));

//connect to database
mongoose.connect('mongodb://127.0.0.1:27017/googleSheetsColumns');

//Retrieve google spreadsheet data of the subscribed googleID and their column count and store it in database
async function listMajors(auth, name) {
  const drive = google.drive('v3');
  const sheets = google.sheets('v4')
  const oauth2 = google.oauth2({
    auth: auth,
    version: 'v2'
  })

  var googleSheetIDs = []

  google.options({auth})
  
  const gmailID = (await oauth2.userinfo.get()).data.email

  const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet'",
      fields: 'nextPageToken, files(id, name)'
  })

  googleSheetIDs = response.data.files
  googleSheetIDs = googleSheetIDs.map((sheet) => sheet.id)
  
  googleSheetIDs.map(async (id) => {

    const columnCount = (await sheets.spreadsheets.get(
      {
        auth: auth,
        spreadsheetId: id,
        ranges: [],
        includeGridData: true
      }
    )).data.sheets[0].properties.gridProperties.columnCount

    Sheet.findOneAndUpdate(
      {
        sheetID : id
      },
      { 
        columnCount : columnCount,
        googleID : gmailID
      }, { upsert: true, new: true, setDefaultsOnInsert: true }, function(err, result) {
        if (err) throw err
    })
  })

  User.findOneAndUpdate({name : name}, {googleID : gmailID, sheetIDs : googleSheetIDs}, { upsert: true, new: true, setDefaultsOnInsert: true }, function(err, result) {
    if (err) throw err
  })
}

//API to call authorization URL to get consent to retrieve dat of the subscribed googleID
app.get("/auth/google", async (req, res) => {
  console.log("Clicked")
  // open the browser to the authorize url to start the workflow
  const token = req.headers['x-access-token']
    //decode token to retrieve name of the logged user
    try{
        const decoded = jwt.verify(token, 'secret123')
        Username = decoded.name
    } catch(error) {
        console.log(error)
        res.json({status: 'error', error: "invalid"})
    }
  opn(this.authorizeUrl, {wait: false});
}
);

//API to retrieve access token to be used to retrieve data of the subscribed googleID
app.get('/oauth2callback', (req, res) => {
  const code = req.query.code;
  client.getToken(code, (err, tokens) => {
    if (err) {
      console.error('Error getting oAuth tokens:');
      throw err;
    }
    client.credentials = tokens;
    const columnCountt = listMajors(client, Username);
    res.redirect('http://localhost:3000/dashboard');
  });
});

//API to register user
app.post('/api/register', async (req, res) => {
    try{
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
            quote: "No quote yet",
        })
        res.json({status: 'ok'})
    } catch (err) {
        console.log(err)
        res.json({status: 'error'})
    }
    
})

//API to login user
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ 
            name: req.body.name,
    })
    
    if (!user) {
		return { status: 'error', error: 'Invalid login' }
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			'secret123'
		)

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
    
})

//API to retrieve email address of the subscribed googleID
app.get('/api/googleID', async (req, res) => {
  const token = req.headers['x-access-token']

  try{
      const decoded = jwt.verify(token, 'secret123')
      const name = decoded.name
      const user = await User.findOne({name: name})
      return res.json({status : "ok", googleID:user.googleID})
  } catch(error) {
      console.log(error)
      res.json({status: 'error', error: "invalid"})
  }
})

//API to retrieve data of selected spreadsheet
app.get('/api/sheetIDs', async (req, res) => {
  const token = req.headers['x-access-token']

  try{
      const decoded = jwt.verify(token, 'secret123')
      const name = decoded.name
      const user = await User.findOne({name: name})
      return res.json({status : "ok", sheetIDs:user.sheetIDs})
  } catch(error) {
      console.log(error)
      res.json({status: 'error', error: "invalid"})
  }
})

//API to get columnCount of selected spreadsheet
app.post('/api/columnCount', async (req, res) => {

    const token = req.headers['x-access-token']

    try{
        const decoded = jwt.verify(token, 'secret123')
        const name = decoded.name
        console.log(req.body.id)
        const sheet = await Sheet.findOne({sheetID : req.body.id})
        return res.json({status: "ok", columnCount:sheet.columnCount})
    } catch(error) {
        console.log(error)
        res.json({status: 'error', error: "invalid"})
    }
})

app.listen(1337, () => {
    console.log('Server started on 1337')
})