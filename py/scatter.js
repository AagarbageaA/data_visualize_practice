d3.csv('py/data/Salary.csv').then(res => {

    const ageData = processDataScatter(res, 'Age', 'Salary', 'Age vs Salary', 'YlGnBu');
    ageData[0].visible = true;

    const experienceData = processDataScatter(res, 'Years of Experience', 'Salary', 'Experience vs Salary', 'YlGnBu');
    experienceData[0].visible = false;

    const ageGroups = groupAndCalculateAverage(res, 'Age', 'Salary');
    
    const layout = {
        height: 600,
        width: 1100,
        margin: {
            l:80,
            r:50,
            b: 100
        },
        yaxis: {
            title: 'Salary',
            showgrid: true,
        },
        updatemenus: [
            {
                y: 1.2,
                x: 0.3,
                yanchor: 'top',
                buttons: [
                    {
                        method: 'restyle',
                        args: ['visible', [true, false, true, false]],
                        label: 'Age vs Salary',
                    },
                    {
                        method: 'restyle',
                        args: ['visible', [false, true,false , true]],
                        label: 'Experience vs Salary',
                    },
                ],
            },
        ],
        legend:{
            x:60,
            y:15
        }
    };

    const scatterDataAll = [...ageData, ...experienceData];

    Plotly.newPlot("scatterGraph", scatterDataAll, layout);
    const experienceGroups = groupAndCalculateAverage(res, 'Years of Experience', 'Salary');
    
    addAverageLinePlot(ageGroups, 'Age vs Salary', 'Age', layout, 'Blues');
    addAverageLinePlot(experienceGroups, 'Experience vs Salary', 'Years of Experience', layout, 'Greens');
}).catch(error => {
    console.error('Error loading CSV:', error);
});

function groupAndCalculateAverage(data, xCategory, yCategory) {
    const groupedData = d3.nest()
        .key(d => d[xCategory])
        .entries(data);

    const averageSalaries = groupedData.map(group => {
        const averageSalary = d3.mean(group.values, d => parseFloat(d[yCategory]));
        return { [xCategory]: group.key, 'Average Salary': averageSalary };
    });

    return averageSalaries;
}

function addAverageLinePlot(averageData, plotName, xCategory, layout, colorscale) {
    const sortedData = averageData.slice().sort((a, b) => a[xCategory] - b[xCategory]);
    const lineColor = '#7A4767';

    const lineData1 = {
        x: sortedData.map(entry => entry[xCategory]),
        y: sortedData.map(entry => entry['Average Salary']),
        mode: 'lines+markers',
        type: 'scatter',
        line: {
            color: lineColor,
        },
        marker: {
            color: lineColor,
        },
        text: sortedData.map(entry => `${xCategory}: ${entry[xCategory]}, Average Salary: ${entry['Average Salary']}`),
        name: `Average ${plotName}`,
        visible: true,
    };

    const lineData2 = {
        x: sortedData.map(entry => entry[xCategory]),
        y: sortedData.map(entry => entry['Average Salary']),
        mode: 'lines+markers',
        type: 'scatter',
        line: {
            color: lineColor,
        },
        marker: {
            color: lineColor,
        },
        text: sortedData.map(entry => `${xCategory}: ${entry[xCategory]}, Average Salary: ${entry['Average Salary']}`),
        name: `Average ${plotName}`,
        visible: false,
    };


    if (plotName.includes('Age')) {
        Plotly.addTraces('scatterGraph', lineData1);
    } else if (plotName.includes('Experience')) {
        Plotly.addTraces('scatterGraph', lineData2);
    }

    const newLayout = {
        ...layout,
        updatemenus: [
            ...layout.updatemenus,
            {
                y: 1.2,
                x: 0.3,
                yanchor: 'top',
                buttons: [
                    ...layout.updatemenus[0].buttons,
                    {
                        method: 'restyle',
                        args: ['visible', [true, true, true, false]],
                        label: `Average ${plotName}`,
                    },
                ],
                legend:{
                    x:50,
                    y:10
                }
            },
        ],
    };

    Plotly.update('scatterGraph', newLayout);
}
function processDataScatter(data, xCategory, yCategory, plotName, colorscale) {
    const scatterData = {
        x: data.map(entry => parseFloat(entry[xCategory])),
        y: data.map(entry => parseFloat(entry[yCategory])),
        mode: 'markers',
        type: 'scatter',
        marker: {
            color: data.map(entry => parseFloat(entry[yCategory])),
            colorscale: colorscale,
            colorbar: {
                title: 'Salary',
            },
        },
        text: data.map(entry => entry['Job Title']),
        name: plotName,
        visible: true,
    };
//5555
    return [scatterData];
}
