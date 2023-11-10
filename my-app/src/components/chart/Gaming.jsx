import Barchart from "./Barchart";
import useFetch from "../hooks/useFetch";
import { Button } from "react-bootstrap";
import "./chart.css";
import axios from "axios";

const Gaming = () => {
    const { data, loading, reFetch } = useFetch(`http://localhost:8080/info/firstChart`);

    const clear = data.length <= 0;

    const handleClear = () => {
        axios.delete(`http://localhost:8080/info/firstChart`);
    }

    return (
        <div className = {clear ? "outer-clear" : "outer-chart"}>
            <div className="dashboard">
                Data Dashboard 
                <Button className="button-clear" id="clear-button" onClick={handleClear}> Clear </Button>
            </div>

            {clear && <div> 
                <h1 className="clear-message"> The information is clear! </h1> 
                <h1 className="clear-message"> Please input your CSV file </h1>      
            </div>}

            { loading ? <p className="loading-screen"> Loading </p> : <div className="bar-chart">
                {data.map((item) => (
                    item.plot === "gaming" ? 
                    <Barchart chart={item}/> : null
                ))
            }
            </div>}

            <div className="end">
            </div>

        </div>
    )
}

export default Gaming;