#Questions answers

1.1 DOM inspector shows the dynamic state of DOM (including everything being modified or moved around by scripts)

1.2 Javascript generates the table, original data is stored in json file

2.1 Any columns may be filtered.
    -In my opinion, it's better to use slider (`<input type="range">`) for gdp, life_expectancy or population year filtering (one for min value and one for max value);
    -numeric input field (`<input type="number">`) can also be used for year filtering (one for min year and one for max year);
    -search field (`<input type="search">`) for country name filtering.

3.1 Aggregation by year could be investigated. If using countries_1995_2012.json and year selection slider, in case of such aggregation selection the year slider should be removed.

4.1 Years attribute in countries_1995_2012.json file holds array of data depending on year for each concrete country and the year itself

5.1 SVG gives us ability to create dinamic graphics (for example, depending on time or some input elements of page), in contrast to html

7.2
    1. Multidimensionality of time-varying data
    2. Big data array length
    3. Different needs of users

7.3
    1. Computational complexity

7.4
    1. Data processing process and data processing time are depending on data semantics
    2. Processing of unformatted data may be rather complicated

