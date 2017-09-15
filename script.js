// Parse dataset
    d3.csv("dataset.csv", function(data){
        var structure = [
        {
            key: "location_name",
            type: "object"
        },
        {
            key: "age_group",
            type: "object"  
        },
        {
            key: "year",
            type: "object"
        },
        {
            key: "metric",
            type: "object"
        },
        {
            key: "sex",
            type: "object"
        },         
        {
            key: "mean",
            type: "object"
        }
        ]

        console.log(data);
        
        var x = d3.scaleLinear().domain([0, 23]).range([100, 780]);
        var y = d3.scaleLinear().domain([0,1]).range([450, 100]);
        var r = d3.scaleSqrt().domain([0,1]).range([2,14]);        

        var parsedDataSet = new instructo(data)
            .createObject(structure)
            .results;
            console.log(parsedDataSet)
        $(".loader").hide();
        var location = Object.keys(parsedDataSet);
        var age = Object.keys(parsedDataSet[location[0]]);
        var year = Object.keys(parsedDataSet[location[0]][age[0]]);
        var sex = Object.keys(parsedDataSet[location[0]][age[0]][year[0]]);

        addToSelect(location, "location")
        addToSelect(year, "year")
        addToSelect(sex, "sex")
        addToSelect(age, "age")
        
        var ages = Object.keys(parsedDataSet[$("#location").val()]);

        var slidera = document.getElementById("age");
        var outputa = document.getElementById("demoage");
        outputa.innerHTML = ages[slidera.value]; 
        slidera.oninput = function() {
            outputa.innerHTML = ages[this.value];
        }
        
        $(".selectors").change(update);
        $('input[type=range]').on('input', update);

        function getMetricLine(metric, gender){
            return d3.line()
                          .x(function(d, i) { return x(i) * ($('body').width() * 0.001); })
                          .y(function(d) { return y(Object.keys(d[metric][gender])); })
        }

        function getMetricCircle(circles, years, metric, gender){
            circles.data(years)
                    .attr('fill', '#2ecc71')
                    .attr('cx', function(d, i) { return x( i ) * ($('body').width()*0.001)} )
                    .attr('cy', function(d, i) { return y( Object.keys(d[metric][gender])) })
                    .attr('r',  function(d, i) { return 4 })
        }
        

        function update(){
            var years = getYears();            
            var width = $('body').width(); 

            obeseMale.attr("d", getMetricLine('obese', 'male')(years))
            obeseFemale.attr("d", getMetricLine('obese', 'female')(years))
            overweightMale.attr("d", getMetricLine('overweight', 'male')(years))
            overweightFemale.attr("d", getMetricLine('overweight', 'female')(years))
            getMetricCircle(obeseMaleCircles, years, "obese", "male");
            getMetricCircle(obeseFemaleCircles, years, "obese", "female");
            getMetricCircle(overweightMaleCircles, years, "overweight", "male");
            getMetricCircle(overweightFemaleCircles, years, "overweight", "female");

            var xScale = d3.scaleTime()
	        .domain([mindate, maxdate])    // values between for month of january
		    .range([100 * (width*0.001), 780 * (width*0.001) ]);   // map these the the chart width = total width minus padding at both sides

            container.select(".xaxis").call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")))
        }

        function addToSelect(items, id){
            var select = "#" + id;
            $.each(items, function (i, item) {
                $(select).append($('<option>', { 
                    value: item,
                    text : item 
                }));
            });
        }
        var mindate = new Date(1990,0,1),
            maxdate = new Date(2013,0,31);
            
        var xScale = d3.scaleTime()
	        .domain([mindate, maxdate])   
		    .range([100, 780 ]); 
		    
        var container = d3.select("body").append("svg")
                                           .attr("class","svg-container")
                                           .attr("width", 800)
                                           .attr("height", 550)
            container.append("g")
                                .attr('transform', 'translate(0, 500)')
                                .attr("class", "xaxis")
                                .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")))
                                
            container.append("g")
                                .attr('transform', 'translate(50, 0)')
                                .attr("class", "yaxis")
                                .call(d3.axisLeft(y))
            // var div = d3.select("body").append("div")
            //     .attr("class", "tooltip")
            //     .style("opacity", 0);


        var years = getYears();

        var lineFunction = d3.line()
                          .x(function(d, i) { return x(i); })
                          .y(function(d) { return y(Object.keys(d.obese.male)); })

        var obeseMale = container.append("path")
                            .attr("d", lineFunction(years))
                            .attr("stroke", "#f39c12")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");

        var obeseFemale = container.append("path")
                            .attr("d", lineFunction(years))
                            .attr("stroke", "#e74c3c")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");
        var overweightMale = container.append("path")
                            .attr("d", lineFunction(years))
                            .attr("stroke", "#1abc9c")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");

        var overweightFemale = container.append("path")
                            .attr("d", lineFunction(years))
                            .attr("stroke", "#9b59b6")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");
        
        var obeseMaleCircles = container.selectAll('test').data(years).enter().append('circle')
        var obeseFemaleCircles = container.selectAll('test').data(years).enter().append('circle')
        var overweightMaleCircles = container.selectAll('test').data(years).enter().append('circle')
        var overweightFemaleCircles = container.selectAll('test').data(years).enter().append('circle')

        // .on("mouseover", function(d) {
        //     div.transition()
        //         .duration(200)
        //         .style("opacity", 1);
        //     div.html("<br/>" + "HI")
        //         .style("left", (d3.event.pageX - 30) + "px")
        //         .style("top", (d3.event.pageY - 60) + "px");
        //     })
        //     .on("mouseout", function(d) {
        //     div.transition()
        //         .duration(500)
        //         .style("opacity", 0);
        //     });


          $(window).on('resize', resize);

          function getYears(){
            var location = $("#location").val();
            var year = $("#year").val(); 
            var age = ages[$("#age").val()]; 
            var years = Object.keys(parsedDataSet[location][age]).map(function(x){return parsedDataSet[location][age][x]})
            return years;
          }

          function resize(e){
            var width = $('body').width(); 
            $(".svg-container").width(800 * (width*0.001) )
            var years = getYears();
            obeseMale.attr("d", getMetricLine('obese', 'male')(years))
            obeseFemale.attr("d", getMetricLine('obese', 'female')(years))
            overweightMale.attr("d", getMetricLine('overweight', 'male')(years))
            overweightFemale.attr("d", getMetricLine('overweight', 'female')(years))           
            obeseMaleCircles.attr('cx', function(d, i) { return x( i ) * ($('body').width()*0.001)} )
            obeseFemaleCircles.attr('cx', function(d, i) { return x( i ) * ($('body').width()*0.001)} )
            overweightMaleCircles.attr('cx', function(d, i) { return x( i ) * ($('body').width()*0.001)} )
            overweightFemaleCircles.attr('cx', function(d, i) { return x( i ) * ($('body').width()*0.001)} )

            var xScale = d3.scaleTime()
	        .domain([mindate, maxdate])  
		    .range([100 * (width*0.001), 780 * (width*0.001) ]);   

            container.select(".xaxis").call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")))

          }
        })
