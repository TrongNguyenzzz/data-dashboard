from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.metrics import r2_score
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn import *
import pandas as pd
import numpy as np
import math
from flask import request

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})

mlr = LinearRegression()
model_accuracy = 0
ready = False
curr_command = ""
information = {}
predictor  = 0
encode_res = {}

@app.route("/predict/<command>", methods=['POST'])
def home(command):
    global curr_command
    global information
    global encode_res
    
    curr_command = command

    data = request.files['currFile']
    file_data = pd.read_csv(data)
    file_data.dropna(inplace=True)
    
    if command == "airline":
        month = []
        temp = file_data.loc[:, "Departure Date"].tolist()
        for date in temp:
            list_date = date.strip().split("/")
            month.append(list_date[0])
        file_data = file_data.assign(Month = month)
        
        # Encode data since logistic regression cannot use string
        label_encoder = LabelEncoder()
        colname = file_data.columns.values.tolist()
        for col in colname:
            if col == "Flight Status":
                currLine = file_data.loc[:, col].tolist()
                encode_res["On Time"] = currLine.index("On Time")
                encode_res["Delayed"] = currLine.index("Delayed")
                encode_res["Cancelled"] = currLine.index("Cancelled")
            file_data.loc[:, col] = label_encoder.fit_transform(file_data.loc[:, col])
            
            if col == "Flight Status":
                currLine = file_data.loc[:, col].tolist()
                encode_res["On Time"] = currLine[encode_res["On Time"]]
                encode_res["Delayed"] = currLine[encode_res["Delayed"]]
                encode_res["Cancelled"] = currLine[encode_res["Cancelled"]]
    
    colname = file_data.columns.values.tolist()

    # Process the file data as needed
    
    data_dict = {}
    chosen_col = []
    length = 0
        
    for col in colname:
        col_lowercase = col.lower()
        if command == "weather":
            if "temp" in col_lowercase or "humid" in col_lowercase or "speed" in col_lowercase \
                or "degree" in col_lowercase or "visibility" in col_lowercase: 
                    temp = file_data.loc[:, col].tolist()
                    if length == 0:
                        length += len(temp)
                    data_dict[col_lowercase] = temp
                    chosen_col.append(col_lowercase)
        
        elif command == "airline":
            if "airport" in col_lowercase or "month" in col_lowercase or "flight status" in col_lowercase:
                temp = file_data.loc[:, col].tolist()
                if length == 0:
                    length += len(temp)
                data_dict[col_lowercase] = temp
                chosen_col.append(col_lowercase)
        
        elif command == "gaming":
            if "winner" in col_lowercase or "first" in col_lowercase:
                temp = file_data.loc[:, col].tolist()
                if length == 0:
                    length += len(temp)
                data_dict[col_lowercase] = temp
                chosen_col.append(col_lowercase)

    print(data_dict.keys())

    model, accuracy = splitCommand(data_dict, command, file_data, length, chosen_col)
    
    coefficient = model.coef_.tolist()    
    
    if (command == "weather"):
        chosen_col.remove("temperature")
    elif (command == "airline"):
        chosen_col.remove("flight status")
    elif (command == "gaming"):
        chosen_col.remove("winner")
    
    for index in range(len(coefficient)):
        
        if command == "weather":
            information[chosen_col[index]] = coefficient[index]
                
        elif command == "airline":
            for inner_index in range(len(coefficient[index])):
                if chosen_col[inner_index] not in information:
                    information[chosen_col[inner_index]] = [coefficient[index][inner_index]]
                else:
                    information[chosen_col[inner_index]].append(coefficient[index][inner_index])
                
        elif command == "gaming":
            for inner_index in range(len(coefficient[index])):
                if chosen_col[inner_index] not in information:
                    information[chosen_col[inner_index]] = [coefficient[index][inner_index]]
                else:
                    information[chosen_col[inner_index]].append(coefficient[index][inner_index])
            
    information["intercept"] = model.intercept_.tolist() 
    
    information["command"] = command
    
    information["accuracy"] = accuracy * 100
    
    return information

def splitCommand(data_dict, command, file_data, length, colname):
    
    if command == "weather":
        return processWeatherData(data_dict, file_data, length, colname)
    
    elif command == "airline":
        return processAirlineData(data_dict, file_data, length, colname)
    
    elif command == "gaming":
        return processGamingData(data_dict, file_data, length, colname)
    
def processGamingData(data_dict, file_data, length, colname):
    
    global mlr
    global model_accuracy
    global ready
    global predictor
    
    mlr = LogisticRegression()  
    predict_set = []
    test_x = []
    
    model_cap = int(3/4 * length)
    start_test = int(3/4 * length) + 1
    
    # Add data to the train set
    for i in range(model_cap):
        inner_list = []
        for col in colname:
            if col != "winner":
                element = data_dict[col][i]
                inner_list.append(element)
        predict_set.append(np.array(inner_list))
    
    train_set = np.array(predict_set)
    
    # Add data to the test set
    for i in range(start_test, length):
        inner_list = []
        for col in colname:
            if col != "winner":
                element = data_dict[col][i]
                inner_list.append(element)
        test_x.append(np.array(inner_list))
    
    test_x = np.array(test_x)
    
     # Slicing the result set according to the train set
    result_set = np.array(data_dict["winner"][:model_cap])
    
    # Slicing the result test for x according to the test set
    validation_x = np.array(data_dict["winner"][start_test:])
    
    predictor = mlr.fit(train_set, result_set)
    
    y_pred_mlr = mlr.predict(test_x)    
    
    toReturn = mlr.coef_.tolist()
    
    toReturn.append(mlr.intercept_)
    
    ready = True
    
    model_accuracy = mlr.score(test_x, validation_x)
    
    return mlr, mlr.score(test_x, validation_x)
    

def processAirlineData(data_dict, file_data, length, colname):
    
    global mlr
    global model_accuracy
    global ready
    global predictor
    
    mlr = LogisticRegression()  
    predict_set = []
    test_x = []
    
    model_cap = int(3/4 * length)
    start_test = int(3/4 * length) + 1
    
    # Add data to the train set
    for i in range(model_cap):
        inner_list = []
        for col in colname:
            if col != "flight status":
                element = data_dict[col][i]
                inner_list.append(element)
        predict_set.append(np.array(inner_list))
    
    train_set = np.array(predict_set)
    
    # Add data to the test set
    for i in range(start_test, length):
        inner_list = []
        for col in colname:
            if col != "flight status":
                element = data_dict[col][i]
                inner_list.append(element)
        test_x.append(np.array(inner_list))
    
    test_x = np.array(test_x)
    
     # Slicing the result set according to the train set
    result_set = np.array(data_dict["flight status"][:model_cap])
    
    # Slicing the result test for x according to the test set
    validation_x = np.array(data_dict["flight status"][start_test:])
    
    predictor = mlr.fit(train_set, result_set)
    
    y_pred_mlr = mlr.predict(test_x)
    
    model_accuracy = mlr.score(test_x, validation_x)
    
    ready = True
    
    return mlr, mlr.score(test_x, validation_x)

def processWeatherData(data_dict, file_data, length, colname):
    
    global mlr
    global model_accuracy
    global ready
    global predictor
    
    mlr = LinearRegression()  
    predict_set = []
    test_x = []
    
    model_cap = int(3/4 * length)
    start_test = int(3/4 * length) + 1
    
    # Add data to the train set
    for i in range(model_cap):
        inner_list = []
        for col in colname:
            if col != "temperature":
                element = data_dict[col][i]
                inner_list.append(element)
        predict_set.append(np.array(inner_list))
    
    train_set = np.array(predict_set)
    
    # Add data to the test set
    for i in range(start_test, length):
        inner_list = []
        for col in colname:
            if col != "temperature":
                element = data_dict[col][i]
                inner_list.append(element)
        test_x.append(np.array(inner_list))
    
    test_x = np.array(test_x)
    
    # Slicing the result set according to the train set
    result_set = np.array(data_dict["temperature"][:model_cap])
    
    # Slicing the result test for x according to the test set
    validation_x = np.array(data_dict["temperature"][start_test:])
    
    predictor = mlr.fit(train_set, result_set)
    
    y_pred_mlr = mlr.predict(test_x)
    
    model_accuracy = r2_score(validation_x, y_pred_mlr)
    
    ready = True
    
    return mlr, r2_score(validation_x, y_pred_mlr)

@app.route("/", methods=['GET'])
def get():
    if not ready:
        return "No data available"
    if curr_command == "airline" or curr_command == "gaming":
        information["type"] = "Logistic Regression"
    elif curr_command == "weather":
        information["type"] = "Linear Regression"
    return information

@app.route("/predict/result/weather/<apprentTemp>/<humid>/<windBearing>/<windSpeed>/<visibility>", methods=['GET'])
def predictWeather(apprentTemp, humid, windBearing, windSpeed, visibility):
    toPredict = np.array([apprentTemp, humid, windSpeed, windBearing ,visibility], dtype=np.float64)
    return str(predictor.predict(toPredict.reshape(1, -1)))

@app.route("/predict/result/airline/<countryCode>/<continent>/<arrival>/<month>", methods=['GET'])
def predictAirline(countryCode, continent, arrival, month):
    global encode_res
    
    label_encoder = LabelEncoder()
    toPredict = label_encoder.fit_transform(np.array([countryCode, continent, arrival, month]))
    res = predictor.predict(toPredict.reshape(1, -1))
    for key,value in encode_res.items():
        if value == int(res[0]):
            return key
    return "No result"

@app.route("/predict/result/gaming/<firstBlood>/<firstTower>/<firstInhibi>/<firstBaron>/<firstDrag>/<firstRift>", methods=['GET'])
def predictGaming(firstBlood, firstTower, firstInhibi, firstBaron, firstDrag, firstRift):
    toPredict = np.array([firstBlood, firstTower, firstInhibi, firstBaron, firstDrag, firstRift], dtype=np.float64)
    return str(predictor.predict(toPredict.reshape(1, -1)))

if __name__ == "__main__":
    app.run(port=8000, debug=True)