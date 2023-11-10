import useFetch from "../hooks/useFetch.js";
import { useLocation } from "react-router-dom";
import "./description.css";
import { useState } from "react";

const Description = () => {

    const location = useLocation();
    const temp = location.pathname.split('/');
    const id = temp[temp.length - 1];

    const { data } = useFetch(`http://localhost:8080/description/${id}`);

    const loaded = (data.topList === undefined);

    return(
        <div className="outer-describe">
            <p className="summary-title"> Summary for {data.category} </p>
            <div className="description">
                {data.description}
            </div>

            {loaded ? "loading" : <table>
                <tr>
                    <th> Rank </th>
                    <th> {data.category} </th>
                    <th> Percentage </th>
                </tr>

                <tr>
                    <th> 1 </th>
                    <th> {data.topList[0]} </th>
                    <th> {data.numbers[0]} </th>
                </tr>

                <tr>
                    <th> 2 </th>
                    <th> {data.topList[1]} </th>
                    <th> {data.numbers[1]} </th>
                </tr>

                {data.topList[2] &&
                    <tr>
                        <th> 3 </th>
                        <th> {data.topList[2]} </th>
                        <th> {data.numbers[2]} </th>
                    </tr>
                }
            </table>}
        </div>
    )

}

export default Description;