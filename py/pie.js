d3.csv('py/data/Salary.csv').then(res => {
    // Step 2: Count the occurrences of each race
    const raceCounts = {};
    res.forEach(entry => {
        const race = entry['Race']; // Ensure the property name is correct
        raceCounts[race] = (raceCounts[race] || 0) + 1;
    });

    // Create data for the race pie chart
    const raceColors = ['#CFF78F', '#2AF78F', '#9FF78F', '#6DF722', '#6DF7B9', '#ADF7E5','#ADB9E5','#43B98C','#84B98C','#84B94C'];
    const raceData = [{
        labels: Object.keys(raceCounts),
        values: Object.values(raceCounts),
        type: 'pie',
        marker: {
            colors: raceColors.slice(0, Object.keys(raceCounts).length),
        },
        textinfo: 'label+percent',
        title: 'Race Distribution', // Title for Race chart
    }];

    // Count the occurrences of each education level
    const educationCounts = {};
    res.forEach(entry => {
        const educationLevelCode = entry['Education Level'];
        const educationLevelMapping = {
            0: 'No Education',
            1: 'Elementary Education',
            2: 'Secondary Education',
            3: 'Higher Education ',
        };
        const educationLevel = educationLevelMapping[educationLevelCode] || 'Unknown';
        educationCounts[educationLevel] = (educationCounts[educationLevel] || 0) + 1;
    });

    // Create data for the education level pie chart
    const educationColors = ['#CFF78F', '#2AF78F', '#9FF78F', '#6DF722', '#6DF7B9', '#ADF7E5'];
    const educationData = [{
        labels: Object.keys(educationCounts),
        values: Object.values(educationCounts),
        type: 'pie',
        marker: {
            colors: educationColors.slice(0, Object.keys(educationCounts).length),
        },
        textinfo: 'label+percent',
        title: 'Education Level Distribution', // Title for Education Level chart
    }];

    // Parse and prepare data for gender pie chart
    const genderCounts = { Male: 0, Female: 0 };
    res.forEach(entry => {
        const gender = entry['Gender'];
        genderCounts[gender]++;
    });

    // Create data for the gender pie chart
    const genderColors = ['#63E063', '#63E0BE'];
    const genderData = [{
        labels: Object.keys(genderCounts),
        values: Object.values(genderCounts),
        type: 'pie',
        marker: {
            colors: genderColors,
        },
        textinfo: 'label+percent',
        title: 'Gender Distribution', // Title for Gender chart
    }];

    const countryCounts = {};
    res.forEach(entry => {
        const country = entry['Country']; 
        countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    const countryColors = ['#CFF78F', '#2AF78F', '#9FF78F', '#6DF722', '#6DF7B9', '#ADF7E5'];
    const countryData = [{
        labels: Object.keys(countryCounts),
        values: Object.values(countryCounts),
        type: 'pie',
        marker: {
            colors: countryColors.slice(0, Object.keys(countryCounts).length),
        },
        textinfo: 'label+percent',
        title: 'Country Distribution', 
    }];

    const layout = {
        height: 500,
        width: 1100,
        updatemenus: [
            {
                y: 1.2,
                x: 0.3,
                yanchor: 'top',
                buttons: [
                    {
                        method: 'restyle',
                        args: ['visible', [true, false, false, false]],
                        label: 'Race',
                    },
                    {
                        method: 'restyle',
                        args: ['visible', [false, true, false, false]],
                        label: 'Education Level',
                    },
                    {
                        method: 'restyle',
                        args: ['visible', [false, false, true, false]],
                        label: 'Gender',
                    },
                    {
                        method: 'restyle',
                        args: ['visible', [false, false, false, true]],
                        label: 'Country',
                    }
                ],
            },
        ],
    };
    raceData[0].visible = true;
    educationData[0].visible = false;
    genderData[0].visible = false;
    countryData[0].visible = false;
    
    const pieDataAll = [raceData[0], educationData[0], genderData[0], countryData[0]];

    Plotly.newPlot("pieGraph", pieDataAll, layout);
}).catch(error => {
    console.error('Error loading CSV:', error);
});
