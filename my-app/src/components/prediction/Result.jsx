import useFetch from "../hooks/useFetch";

const Result = ({temp, humid, bearing, speed, visibility}) => {

    const { data, loading, reFetch } = useFetch(`http://127.0.0.1:8000/predict/result/weather/${temp}/${humid}/${bearing}/${speed}/${visibility}`)


    return(
        <div>
            {loading ? (
                <p className="loading-screen"> Loading </p>) : 
                (<p> The prediction will be around {data} </p>)}
        </div>
    )
}

export default Result;