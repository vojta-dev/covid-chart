const dict = {
    selected: 'cs',
    cs: {
        lang: 'cs-CZ',
        infected: 'Nakažených',
        recoveries: 'Vyléčených',
        deaths: 'Zemřelých',
    },
    en: {
        lang: 'en-US',
        infected: 'Infected',
        recoveries: 'Recoveries',
        deaths: 'Deaths',
    },
};

let d = dict[dict.selected];
let chart;

// change language
document.getElementById('flag').addEventListener('click', () => {
    document.getElementById('flag').setAttribute('src', `img/flag_${dict.selected}.svg`);

    dict.selected = dict.selected === 'cs' ? 'en' : 'cs';
    d = dict[dict.selected];

    chart.destroy();
    main();
});

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

    chart = new Chart('chart', {
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
                            callback: (num) => num.toLocaleString(d.lang, { notation: 'compact' }),
                        },
                    },
                ],
            },
        },
    });
};

const main = async () => {
    const data = await getData();

    const get = (property) => data.map((element) => element[property]);

    makeChart(get('date'), [
        { data: get('infected'), name: d.infected, color: '#F8B425' },
        { data: get('recoveries'), name: d.recoveries, color: '#049DD9' },
        { data: get('deaths'), name: d.deaths, color: '#EC4561' },
    ]);
};

main();
