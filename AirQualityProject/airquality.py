from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import pymongo
from bs4 import BeautifulSoup as bs
import requests
from splinter import Browser
import time 
import citipy
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import requests
from scipy.stats import linregress
from datetime import date
from tqdm import tqdm
from bson import json_util 
import json 
from datetime import date, timedelta

def airquality():
    today = date.today()
    date1 = (today - timedelta(days = 90)).strftime('%Y%m%d')
    date2 = (today - timedelta(days = 90)).strftime('%Y%m%d')

    key = "jdbero3@gmail.com&key=carmelhare42"
    #key = epa_api_key
    param_list = [42101, 42401, 44201, 81102, 88101]

    # Lat/Long Source: https://www.worldatlas.com/aatlas/infopage/nsewusa.htm

    #farthest east
    maxlon = -66.9
    #farthest west
    minlon = -124.7
    #farthest south
    minlat = 25.1
    #farthest north
    maxlat = 49.3

    query_urlList = []
    response_list = []

    for param in param_list:
        query_url = f"https://aqs.epa.gov/data/api/dailyData/byBox?email={key}&param={param}&bdate={date1}&edate={date2}&minlat={minlat}&maxlat={maxlat}&minlon={minlon}&maxlon={maxlon}"
        #print(query_url)
        query_urlList.append(query_url)
        response = requests.get(query_url).json()
        response_list.append(response)
        time.sleep(5)

    #print("-----------------")
    #print(query_urlList)

    #from pymongo import MongoClient
    #client = pymongo.MongoClient("mongodb://localhost:27017")
    #db = client.test

    conn = 'mongodb+srv://jdb3:Password1@usairquality-q8vtd.mongodb.net/test?retryWrites=true&w=majority'
    client = pymongo.MongoClient(conn)

    # # Define database and collection
    db = client.AirQuality
    collection = db.pollution
    
    # Clear previous data in collection
    collection.drop()
    # insert new data into collection
    collection.insert_many(response_list)


    # Pull data from MongoDB and export as .json file
    aqi_data = db.pollution.find()

    with open('aqi.json', 'w') as outfile:
     otherword = json_util.dumps(aqi_data)
     outfile.write(otherword)

airquality()
