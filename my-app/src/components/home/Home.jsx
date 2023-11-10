import { Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useState} from 'react';
import "./home.css";
import { useNavigate } from "react-router-dom";
import MultiSelect from  'react-multiple-select-dropdown-lite'
import  'react-multiple-select-dropdown-lite/dist/index.css'
import axios from "axios";
import DatalistInput from "react-datalist-input";
import "./../chart/chart.css";

const Home = () => {

    const [currFile, setCurrFile] = useState(null);

    const [processed, setProcessed] = useState(false);

    const [predicted, setPredicted] = useState(false);

    const [plot, setPlot] = useState("")

    const [value, setvalue] = useState('')

    const handleOnchange  =  val  => {
        setvalue(val)
    }

    const keyList = ["file1", "file2", "file3"];

    const  options  = [
        { label: 'Airline', value: 'Airline' },
        { label: 'Weather', value: 'Weather' },
        { label: 'Gaming', value: 'Gaming' },
      ]

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files) {
            setCurrFile(e.target.files);
        }
    };

    const uploadFile = () => {
        try{
            var formData = new FormData();
            for(let i = 0 ; i < currFile.length; i++) {
                formData.append(keyList[i], currFile[i]);
            }
            axios.post(`http://localhost:8080/info/${value}/${plot}`, formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                }
            })
            setProcessed(true);
        } catch(error) {
            fail();
        }
    }

    const predictFile = () => {
        try{
            var formData = new FormData();
            formData.append("currFile", currFile[0]);
            axios.post(`http://127.0.0.1:8000/predict/${value.toLowerCase()}`, formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                }
            })
            setPredicted(true);
        } catch(error) {
            fail();
        }
    }

    const handleProcess = async () => {
        if (!currFile) {
            fail();
        }
        else {
            uploadFile();
        }
    }

    const handlePrediction = async () => {
        if (!currFile) {
            fail();
        }
        else {
            predictFile();
        }
    }

    const notification = () => toast.success("Upload file sucessfully!",  {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    const fail = () => toast.error("Please submit a data file!",  {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });  

    const handleChart = () => {
        navigate("/bar");
    }

    return(
        <div className="main-frame">
            <div className="dashboard">
                <div className="data-title"> Data Dashboard </div>
            
                {processed && <Button className="temp" onClick={handleChart}> My Chart </Button>}
                {predicted && <Button className="temp" onClick={() => navigate("/prediction")}> My model </Button>}
            </div>

            <div className="main"> 
                <form action="">
                    <input className="inputId" id="fileInput" type="file" accept=".csv" onChange={(e) => handleFileChange(e)} multiple />

                    <div className="headerSearchItem">
                    <MultiSelect
                        placeholder = "Type of file"
                        onChange={handleOnchange}
                        options={options}
                    />
                    </div>

                    <DatalistInput className="plotType" style={{"width": "max-content"}}
                        placeholder = "Type of plot"
                        onSelect={(item) => {setPlot(item.value)}}
                        items={[
                            { id: 'bar', value: 'bar' },
                            { id: 'scatter', value: 'scatter' },
                            { id: 'pie', value: 'pie' },
                        ]}
                    />

                    <div className="note">
                        Note: Please only upload CSV file without any comma in any entry!
                    </div>

                    <div className="button-div">
                        <Button className="process-button" onClick={handleProcess}> Process </Button>
                        <Button className="process-button" onClick={handlePrediction}> Prediction </Button>
                    </div>
                    <ToastContainer />

                </form>
            </div>
        </div>
    )
}

export default Home;