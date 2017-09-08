// Parse dataset
    d3.csv("dataset.csv", function(data){
        var structure = [
        {
            key: "location_name",
            type: "object"
        },
        {
            key: "year",
            type: "object"
        },
        {
            key: "age_group",
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

        var parsedDataSet = new instructo(data)
            .createObject(structure)
            .results;
        $(".loader").hide();
        var location = Object.keys(parsedDataSet);
        var year = Object.keys(parsedDataSet[location[0]]);
        var age = Object.keys(parsedDataSet[location[0]][year[0]]);
        var sex = Object.keys(parsedDataSet[location[0]][year[0]][age[0]]);

        addToSelect(location, "location")
        addToSelect(year, "year")
        addToSelect(sex, "sex")
        addToSelect(age, "age")
        
        var ages = Object.keys(parsedDataSet[$("#location").val()][$("#year").val()]);
        var slider = document.getElementById("year");
        var output = document.getElementById("demo");
        output.innerHTML = slider.value; 
        slider.oninput = function() {
            output.innerHTML = this.value;
        }

        var slidera = document.getElementById("age");
        var outputa = document.getElementById("demoage");
        outputa.innerHTML = ages[slidera.value]; 
        slidera.oninput = function() {
            outputa.innerHTML = ages[this.value];
        }
        
        $(".selectors").change(update);
        $('input[type=range]').on('input', update);

        function update(){
            var location = $("#location").val();
            var year = $("#year").val(); 
            var age = ages[$("#age").val()]; 
            var values = parsedDataSet[location][year][age];
            var vals = [{ name: "overweight male", val : Object.keys(values.overweight.male)[0]}, 
                        {name: "obese male" , val: Object.keys(values.obese.male)[0]},
                        {name: "overweight female", val: Object.keys(values.overweight.female)[0]},
                        {name: "obese female", val: Object.keys(values.obese.female)[0]} ]

            circles.data(vals)
                   .transition()
                   .attr("r", function (d, i ) { return d.val * 100; })

                    
            text.data(vals)
                .text( function (d) { return d.name + " " + d.val });
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

        var jsonCircles = [
          { "x_axis": 200, "y_axis": 200, "radius": 0, "color" : "#2ecc71" , "name": "overweight male"},
          { "x_axis": 200, "y_axis": 500, "radius": 0, "color" : "#1abc9c", "name": "obese male"},
          { "x_axis": 500, "y_axis": 200, "radius": 0, "color" : "#9b59b6" , "name": "overweight female"},
          { "x_axis": 500, "y_axis": 500, "radius": 0, "color" : "#e74c3c", "name": "obese female"},
          ];

          var container = d3.select("body").append("svg")
                                           .attr("width", 800)
                                           .attr("height", 550);

          var circles = container.selectAll("circle")
                                 .data(jsonCircles)
                                 .enter()
                                 .append("circle");

          var circleAttributes = circles
                       .attr("cx", function (d) { return d.x_axis; })
                       .attr("cy", function (d) { return d.y_axis; })
                       .attr("r", function (d) { return d.radius; })
                       .style("fill", function(d) { return d.color; });

         var text = container.selectAll("text")
                        .data(jsonCircles)
                        .enter()
                        .append("text");

         var textLabels = text
                 .attr("x", function(d) { return d.x_axis - 100; })
                 .attr("y", function(d) { return d.y_axis - 100; })
                 .text( function (d) { return d.name + " " + d.radius })
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "20px")
                 .attr("fill", "black");

          $(window).on('resize', resize);

          function resize(e){
            var width = $('body').width(); 
            var height = $('body').height(); 
            container.attr('width', width);
            container.attr('height', height);
            circles.data(jsonCircles)
                   .attr("cx", function (d) { return d.x_axis * (width*0.001); })
            text.data(jsonCircles)
                .attr("x", function(d) { return d.x_axis * (width*0.001); })
          }
        })
