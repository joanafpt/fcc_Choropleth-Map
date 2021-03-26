let datasetUSEducation;
let req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json', false);
req.onreadystatechange = () => {
  if (req.readyState == 4 && req.status == 200)
    datasetUSEducation = JSON.parse(req.responseText);
}
req.send();

let datasetUSCounty;
let reqTwo = new XMLHttpRequest();
reqTwo.open("GET", 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json', false);
reqTwo.onreadystatechange = () => {
  if (reqTwo.readyState == 4 && reqTwo.status == 200)
    datasetUSCounty = JSON.parse(reqTwo.responseText);
}
reqTwo.send();

//console.log(datasetUSEducation)
let h = 800;
let w = 1100;
let path = d3.geoPath();

const svg = d3.select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h)
  //.style("margin-left", "350")
  .style("background-color", "white")
  .style("display", "block")
  .style("margin-left", "auto")
  .style("margin-right", "auto")

let datasetUSEducationObject = {};
for (var s in datasetUSEducation) {
  let fips;
  fips = datasetUSEducation[s]['fips'];
  let vals;
  vals = datasetUSEducation[s];
  datasetUSEducationObject[fips] = vals;
  //console.log(datasetUSEducationObject)
}

let geographicInfos = {};
for (var r in datasetUSEducation) {
  let fips;
  fips = datasetUSEducation[r]['fips'];
  let states;
  states = datasetUSEducation[r]['state'];
  geographicInfos[fips] = states;
  //console.log(geographicInfos )
}

let areaNameObj = {}
for (var q in datasetUSEducation) {
  let fips;
  fips = datasetUSEducation[q]['fips'];
  let areaName;
  areaName = datasetUSEducation[q]['area_name'];
  areaNameObj[fips] = areaName;
  //console.log(areaNameObj)
}

let colorDegreePercentage = ['#ffe6e6', '#ffcccc', '#ffb3b3', '#ff9999', ' #ff8080', '#ff6666'];

svg
  .append("g")
  .attr("class", "counties")
  .selectAll("path")
  .data(topojson.feature(datasetUSCounty, datasetUSCounty.objects['counties']).features)
  .enter()
  .append("path")
  .attr("class", "county")
  .attr("data-fips", function (d) {
    return d.id;
  })
  .attr("data-education", function (d) {
    return datasetUSEducationObject[d.id]['bachelorsOrHigher'];
  })

  .attr("fill", function (d, i) {
    let percentageDegree;

    //console.log( datasetUSEducationObject[d.id]['bachelorsOrHigher'])
    percentageDegree = datasetUSEducationObject[d.id]['bachelorsOrHigher'];
    // console.log(percentageDegree)

    if (percentageDegree >= 0 && percentageDegree < 10) {
      return colorDegreePercentage[0];
    }

    if (percentageDegree >= 10 && percentageDegree < 20) {
      return colorDegreePercentage[1];
    }

    if (percentageDegree >= 20 && percentageDegree < 30) {
      return colorDegreePercentage[2];
    }
    if (percentageDegree >= 30 && percentageDegree < 40) {
      return colorDegreePercentage[3];
    }

    if (percentageDegree >= 40 && percentageDegree < 50) {
      return colorDegreePercentage[4];
    }

    if (percentageDegree >= 50) {
      return colorDegreePercentage[5];
    }

  })
  .attr("d", path)
  .on("mouseout", function () {
    div.attr('class', 'invisible')
      .attr('data-education', "");
  })
  //console.log(datasetUSEducation)
  .on("mouseover", function (d, i) {
    div.attr('class', 'visible')
      .attr('data-education', function () {
        return datasetUSEducationObject[d.id]['bachelorsOrHigher'];
      })
      .html("% of adults >= 25 with bachelor degree or higher: " + datasetUSEducationObject[d.id]['bachelorsOrHigher'] + "%" + ", " +
        " State: " + geographicInfos[d.id] + ", " + " Area: " + areaNameObj[d.id])
      .style("left", (d3.event.pageX + 10) + "px")
      .style("top", (d3.event.pageY + 5) + "px");
  });

const div = d3.select("body").append("div")
  .attr("id", "tooltip")
  .attr('class', 'invisible')
  .attr('data-education', " ")


let exLegend = ["0% - 9%", "10% - 19%", "20% - 29%", "30% - 39%", "40% - 49%", ">50%"] // apenas um placeholder p ver cm fica
var legend = d3.select("svg").append("g")
  .attr("id", "legend")
  .attr("transform", "translate(" + (w - 100 * colorDegreePercentage.length) + "," + 0 + ")")

legend.selectAll('rect')
  .data(colorDegreePercentage)
  .enter()
  .append("rect")
  .attr("y", function (d, i) { return 650 + i * 15 })
  .attr("x", 0)
  .attr("width", 55)
  .attr("height", 15)
  .style("fill", function (d) {
    return d;
  })

legend.selectAll("text")
  .data(exLegend)
  .enter()
  .append("text")
  .attr("x", 0)
  .attr("y", function (d, i) { return 650 + i * 15 })
  .text((d) => d).attr("alignment-baseline", "text-before-edge").style("font-family", "Calibri").style("font-size", "12");

svg.append("text")
  .attr("x", '500')
  .attr("y", '755')
  .text("Legend: Percentage of adults with >= 25 years old and with bachelor or higher degree")
  .style("font-family", "Calibri")
  .style("font-size", "14");




