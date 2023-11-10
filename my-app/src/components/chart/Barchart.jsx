import "./chart.css";
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const Barchart = ({chart, plot}) => {
    const chartRef = useRef(null); // Create a ref for the chart canvas
    const chartInstanceRef = useRef(null); // Create a ref for the chart instance
    
    const navigate = useNavigate();

    useEffect(() => {
        // Destroy the previous chart if it exists
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Create the new chart
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const newChartInstance = new Chart(ctx, {
                type: chart.plotType,
                data: {
                    labels: chart.colName,
                    datasets: [{
                        label: chart.category,
                        data: chart.data,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Save the chart instance to the ref
            chartInstanceRef.current = newChartInstance;
        }
    }, []);

    return(
        <div className="main-chart">
            {/* Chart canvas */}
            <h1> Barchart of {chart.category} </h1>
            <Link to={`/describe/${chart.category}`}>
                <button className="siCheckButton"> Brief descripton </button>
            </Link>
            <canvas ref={chartRef} id="myChart" className="barchart"></canvas>
        </div>
    )
}

export default Barchart;