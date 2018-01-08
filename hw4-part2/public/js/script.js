
        //load the data corresponding to all the election years
        //pass this data and instances of all the charts that update on year selection to yearChart's constructor
        d3.csv("data/yearwiseWinner.csv", function (error, electionWinners) {

            let votePercentageChart = new VotePercentageChart();

            let tileChart = new TileChart();

            let shiftChart = new ShiftChart();

            let yearsShiftChart = new YearsShiftChart();

            let electoralVoteChart = new ElectoralVoteChart(shiftChart);

            let multipleYearsTileChart = new MuiltipleYearsTileChart();

            let yearChart = new YearChart(electoralVoteChart, tileChart, multipleYearsTileChart, votePercentageChart, electionWinners, yearsShiftChart);

            yearChart.update();
        });
