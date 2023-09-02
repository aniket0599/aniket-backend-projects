const express = require('express');
const bodyParser = require('body-parser');
const URLSearchParams = require('url-search-params');
const newsRoutes = require('express').Router();
const User = require("../models/user");
const {validator} = require('../helpers/validator');
const verifyToken = require('../middleware/authJWT');

const {newsApi} = require('../controllers/newsController');

newsRoutes.use(bodyParser.json());

let url = "https://newsapi.org/v2/top-headlines";

newsRoutes.get('/news', verifyToken, async(req, res) => {
    try{
        if(!req.user && req.message){
            return res.status(403).send({
                message: req.message
            });
        }
        if(!req.user && req.message == null) {
            return res.status(401).send({
                message: "Invalid JWT token"
            });
        }

        const searchParams = new URLSearchParams();
        if(req.user.newsPreferences) {
            const preferences = req.user.preferences;
            for(let i = 0; i < preferences; i++){
                searchParams.append('category', preferences[i]);
            }
            searchParams.append('apiKey', process.env.NEWS_API_KEY);
            console.log('${url}?${searchParams}');
            try{
                let resp = await newsApi('${url}?${searchParams}');
                res.status(200).json(resp.articles);
            }catch(err) {
                res.status(500).json({error: err});
            }
        }
        else{
            console.log("User preferences not provided");
        }
    }
    catch(error){
        return res.status(500).send("Could not fetch news for your preferences.")
    }
});

newsRoutes.get('/preferences', verifyToken, (req, res) => {
    if (!req.user && req.message) { 
    return res.status(403).send({ message: req.message });
    }
    if (!req.user && req.message == null) {
        return res.status(401).send({ message: "Invalid JWT token" });
    }
    return res.status(200).send("News Preferences of logged in user: "+req.user.preferences);
    //res.send(user);
});

newsRoutes.put('/preferences', verifyToken, (req, res) => { 
    console.log("Inside fecthing news based on preferences");
    if (!req.user && req.message) { 
      return res.status(403).send({ message: req.message });
    }
    if (!req.user && req.message == null) {
      return res.status(401).send({ message: "Invalid JWT token" });
    }
    //validate & update preferences
    if(validator(req.body.preferences)) { 
      req.user.preferences = req.body.preferences;
      req.user.updatedDate = Date.now();
      req.user.save().then(data => { 
        return res.status(200).send('Preferences updated successfully'); 
      }).catch(err => { 
        return res.status(500).send('Preferences updation failed : '+err);
      });
    } else {
      return res.status(400).send({ message: 'Invalid Preferences !!' })
    }
    
  });

  module.exports = newsRoutes;
