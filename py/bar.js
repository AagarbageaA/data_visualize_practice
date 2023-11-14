d3.csv('py/data/Salary.csv').then(res => {
    const jobTitleData = processData(res, 'Job Title', 'YlGnBu');

    const genderData = processData(res, 'Gender', 'YlGnBu');

    const countryData = processData(res, 'Country', 'YlGnBu');

    const layout = {
        height: 600,
        width: 1100,
        barmode: 'group', 
        margin:{
            b:100
        },
        yaxis: {
            title: 'Average Salary', 
            showgrid: true, 
        },
        xaxis: {
            tickangle: -45, 
            tickfont: {
                size: 20, 
            },
        },
        updatemenus: [
            {
                y: 1.2,
                x: 0.3,
                yanchor: 'top',
                buttons: [
                    {
                        method: 'restyle',
                        args: ['visible', [true, false, false]],
                        label: 'Job Titles',
                    },
                    {
                        method: 'restyle',
                        args: ['visible', [false, true, false]],
                        label: 'Gender',
                    },
                    {
                        method: 'restyle',
                        args: ['visible', [false, false, true]],
                        label: 'Country',
                    },
                ],
            },
        ],
    };

    jobTitleData[0].visible = true;
    genderData[0].visible = false;
    countryData[0].visible = false;

    const barDataAll = [jobTitleData[0], genderData[0], countryData[0]];

    Plotly.newPlot("barGraph", barDataAll, layout);
}).catch(error => {
    console.error('Error loading CSV:', error);
});

function processData(data, category, colorscale) {
    const counts = {};
    const sums = {};

    data.forEach(entry => {
        const key = entry[category]; 
        const salary = parseFloat(entry['Salary']); 
        counts[key] = (counts[key] || 0) + 1;
        sums[key] = (sums[key] || 0) + salary;
    });

    const labels = Object.keys(counts);
    const averages = labels.map(key => sums[key] / counts[key]);

    const sortedData = labels.map((label, index) => ({ label, average: averages[index] }));
    sortedData.sort((a, b) => a.average - b.average);

    return [{
        x: sortedData.map(item => item.label),
        y: sortedData.map(item => item.average),
        type: 'bar',
        marker: {
            color: sortedData.map(item => item.average), 
            colorscale: colorscale, 
            colorbar: {
                title: 'Average Salary', 
            },
        },
        textposition: 'auto',
        hoverinfo: 'y+text',
        name: category,
    }];
}
