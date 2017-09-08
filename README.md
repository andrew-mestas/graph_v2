# graph_v2
## Summary
D3 graph created from data pulled from an obesity study. Data is held within a csv file and parsed out using d3 method. The remaining processing is taken care of via a custom JavaScript library I call instructo.

## Technologies used
HTML5, CSS - Page and style (not very styled yet)

JavaScript - Instructo - Transforming object structures

D3 - Parsing, creating dynamic content

## An example flat object returned from d3 parse method
```json
{
  "age_end" : "4",
  "age_group" : "2 to 4 yrs",
  "age_group_id" : "34",
  "age_start" : "2",
  "location" : "AFG",
  "location_id" : "160",
  "location_name" : "Afghanistan",
  "lower" : "0.044",
  "mean" : "0.068",
  "measure" : "prevalence",
  "metric" : "obese",
  "sex" : "male",
  "sex_id" : "1",
  "unit" : "pct",
  "upper" : "0.107",
  "year" : "1990"
}
```

## With instructo all I need to do is provide the object hierarchy I want and call the method createObject

```javascipt
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
```

## This results in an array of object with this structure

```javascript
  Afghanistan : {
    1990 : {
        2 to 4 yrs : {
            obese : {
                female : {0.042: {…}}
                male :   {0.068: {…}}
                both : {0.056: {…}}
            },            
            overweight : {
                omitted for brevity
            }
        },
        2 to 19 yrs, age-standardized : {
            omitted for brevity
        },
        omitted for brevity
    }, 
    1991 : {
        omitted for brevity
    },
    omitted for brevity
}

```
