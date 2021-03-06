const formatDate = (date) => date.slice(5);
const formatNum = (num) => num.toLocaleString('cs-CZ', { notation: 'compact' });

const getData = async () => {
    const response = await fetch('https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/nakazeni-vyleceni-umrti-testy.min.json');
    const data = await response.json();

    const formattedData = data.data.map((element) => {
        return {
            date: element.datum,
            infected: element.kumulativni_pocet_nakazenych,
            recoveries: element.kumulativni_pocet_vylecenych,
            deaths: element.kumulativni_pocet_umrti,
        };
    });

    return formattedData;
};

const makeChart = (dates, values) => {
    const data = values.map((value) => {
        return {
            label: value.name,
            backgroundColor: value.color,
            borderColor: value.color,
            pointRadius: 0,
            borderWidth: 4,
            data: value.data,
            fill: false,
        };
    });

    new Chart('chart', {
        type: 'line',
        data: {
            labels: dates,
            datasets: data,
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                xAxes: [
                    {
                        ticks: {
                            callback: (date) => formatDate(date),
                            // remove the x-axis labels, because they look bad, and are pretty much useless when you can just hover over the graph
                            display: false,
                        },
                        gridLines: {
                            display: false,
                        },
                    },
                ],
                yAxes: [
                    {
                        ticks: {
                            callback: (num) => formatNum(num),
                        },
                    },
                ],
            },
        },
    });
};

const main = async () => {
    const data = await getData();

    const get = (element) => data.map((e) => e[element]);

    makeChart(get('date'), [
        { data: get('infected'), name: 'Nakažených', color: '#F8B425' },
        { data: get('recoveries'), name: 'Vyléčených', color: '#049DD9' },
        { data: get('deaths'), name: 'Zemřelých', color: '#EC4561' },
    ]);
};

main();
