from flask import Flask, render_template, request
from flask_pymongo import PyMongo
import airquality

app = Flask(__name__)

#app.config["MONGO_URI"] = "mongodb+srv://jdb3:Password1@usairquality-q8vtd.mongodb.net/test?retryWrites=true&w=majority"
app.config["MONGO_URI"] = "mongodb://localhost:27017/airquality"

mongo = PyMongo(app)

#@app.route("/", methods = ["GET"])

@app.route("/")
def index():
    aqi = mongo.db.pollution.find_one()
    return render_template("index.html", aqidata=aqi)

#def home():
#    if request.method == "GET":
#        aqi = mongo.db.pollution.find_one()
#        return render_template("index.html", listings=aqi)
    

if __name__ == "__main__":
    app.run()