import { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import "./prediction.css"
import { Button } from "react-bootstrap";
import Result from "./Result.jsx";
import axios from "axios";

const Prediction = () => {

    const { data, loading, reFetch } = useFetch(`http://127.0.0.1:8000`);

    const keysToExclude = ["type", "command", "intercept", "accuracy"];

    const [currPredict, setCurrPredict] = useState(false)

    const [res, setRes] = useState(0)

    const keys = Object.keys(data);

    var filteredKeys = keys.filter(key => !keysToExclude.includes(key));

    var firstKey = filteredKeys[0]

    filteredKeys = filteredKeys.filter(key => key !== firstKey);

    const spaces = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';

    var output = ""

    var unit = ""

    const info = {}

    if (data.command === "weather") {
        output = "Predicted Temperature"
        unit = " degree celcius"
    } else if (data.command === "airline") {
        output = "Flight Status"
    } else if (data.command === "gaming") {
        output = "Predicted Winner"
    }

    const addItem = (key,toAdd) => {
        info[key] = toAdd;
        
    }

    const handlePredict = async() => {
        setCurrPredict(false);
        var result;
        if (data.command === "weather") {
            result = await axios.get(`http://127.0.0.1:8000/predict/result/weather/${firstKeyInput}/${inputValues['humidity']}/${inputValues['wind bearing (degrees)']}/${inputValues['wind speed']}/${inputValues['visibility (km)']}`)
            setRes(result.data[0])
        } else if (data.command === "airline") {
            result = await axios.get(`http://127.0.0.1:8000/predict/result/airline/${inputValues['airport country code']}/${firstKeyInput}/${inputValues['arrival airport']}/${inputValues['month']}`)
            setRes(result.data)
        } else if (data.command === "gaming") {
            result = await axios.get(`http://127.0.0.1:8000/predict/result/gaming/${inputValues['firstblood']}/${inputValues['firsttower']}/${inputValues['firstinhibitor']}/${firstKeyInput}/${inputValues['firstdragon']}/${inputValues['firstriftherald']}`)
            setRes(result.data)
        }
        setCurrPredict(true);
    }

    const [firstKeyInput, setFirstKeyInput] = useState('');
    const [inputValues, setInputValues] = useState({});

    return(
        <div className="outer-prediction">
            { loading ? <p className="loading-screen"> Loading </p> : <div className="model-prediction">

                <h2 className="model-type"> {data.type} </h2>

                {data.command === "weather" ? (
                    <img src="https://www.voxco.com/wp-content/uploads/2021/11/Linear-Regression1.png" alt="" className="model-image" />
                    ) : (
                    <img src="https://miro.medium.com/v2/resize:fit:725/1*QY3CSyA4BzAU6sEPFwp9ZQ.png" alt="" className="model-image" />
                )}

                <p className="response-description"> The response variable for the model is {output} </p>

                {data.command === "weather" ? (
                <div>
                    <p className="coefficient-description"> The coefficient of {firstKey} is {data[firstKey]} </p>

                    {filteredKeys.map(item => <p className="coefficient-description">
                        {`${spaces}${item} is ${data[item]}`}</p>)}
                </div>) : 
                
                <div>
                    <p className="coefficient-description"> The list coefficient of {firstKey} is [{`${data[firstKey]}`}]</p>

                    {filteredKeys.map(item => <p className="coefficient-description">
                        {`${spaces}${item} is [${data[item]}]`}</p>)}
                </div> 
                }


                <br/>
                <h2 className="model-type"> Your prediction </h2>

                <div className="input-prediction">
                <label className="firstKey">{firstKey}</label> <br />
                <input
                    type="text"
                    id="weatherInput"
                    value={firstKeyInput}
                    onChange={(e) => setFirstKeyInput(e.target.value)}
                />

                {filteredKeys.map((item) => (
                    <div key={item}>
                    <p className="coefficient-description">
                        <label>{`${item}`}</label>
                        <br />
                        <input
                        type="text"
                        value={inputValues[item] || ''}
                        onChange={(e) => {
                            setInputValues({ ...inputValues, [item]: e.target.value });
                        }}
                        />
                    </p>
                </div>
                ))}
                
                </div>

                <Button className="process-button" onClick={handlePredict}> Process </Button>

                {/* { currPredict && <Result 
                temp={firstKeyInput}
                humid={inputValues['humidity']}
                bearing={inputValues['wind bearing (degrees)']}
                speed={inputValues['wind speed']}
                visibility={inputValues['visibility (km)']}/> } */}

                {currPredict && <p className="predict-result"> The prediction will be around: {res} {unit} with the accuracy about {data.accuracy}% </p>}
                            
            </div>}
        </div>
    )
}

export default Prediction;