//############### global variables ###############
var widthbox = parseInt(d3.select('#map').style('width'));
var width = 580;
widthbox < width ? width = widthbox - 100 : width = width;
var mapRatio = .7;
var height = width * mapRatio;  //0.26 * $(document).width();
var mapscale = width/10; //width/7.9;
var radSmall = 2.5;
var radFocus = 6;
var scaleFactor = 1;
var ew = 0, ns = 0;
var families;
var langByValue;
var langByGenFamily;
var codeByLang;
var featureByName = {};
var selLanguages = [];
var catSelection = [];
var allLanguages = [];
var zoompan = false;
var radius;
var fam;
var featureSet = {};
var childrennodes = {};
var currlevel = "root";
var edges = {};
var datamappoints;
var parents = {};
var click;
var polygons;


//############### projection settings ###############
var margin = {top: 10, left: 10, bottom: 10, right: 10}
  , width = parseInt(d3.select('#map').style('width'));

if(width > 580){ width = 580;}

var width = width - margin.left - margin.right
  , mapRatio = .8
  , height = width * mapRatio - margin.bottom;


var projection = d3.geo.mercator()
	.scale(width/8)
  .translate([width / 2 , height / 2])
	.center([0,50])
	.rotate([-162.5,0])
	;


$('#mapcontainer').css("height",function(){return height + 120;});

//############### make basic map plot ###############
var svg = d3.select("#map").append("svg")
	.attr("width", width)
	.attr("height", height)
	.style('cursor',"move")
	;
var g = svg.append("g");
var mapPoly = g.append('g').attr('class','mapPoly')
var edgeArcs = g.append('g').attr('class','edgeArcs');
var overall = g.append('g').attr('class','overAll');
var nodeCircles = g.append('g').attr('class','nodeCircles');
var cells = g.append("svg:g");
var polys = g.append("g").attr("id","polys");

// define scales and projections
var path = d3.geo.path()
	.projection(projection);
var groupScale = d3.scale.category10();

// load and display the World
d3.json("world-110m.json", function(error, topology) {
	var countrydata = topojson.object(topology,topology.objects.countries).geometries;
	mapPoly.selectAll("path")
		.data(topojson.object(topology, topology.objects.countries)
		.geometries)
		.enter()
		.append("path")
		.attr("d", path)
		.style("fill",function(d){
			return "#f0f0f0";
		 })
		.style('stroke','#ccc')
		.style('stroke-width',function(d){
			return 1/scaleFactor;
		})
		;
});



// zoom and pan

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 20]) /* added deeper scaling @lingulist */
    .on("zoom",function() {
        g.attr("transform","translate("+
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("circle")
            .attr("d", path.projection(projection))
            .attr("r",function(d){
                scaleFactor = d3.event.scale;
                return radSmall/d3.event.scale;
            })
            .style('stroke-width',function(d){
                return 1/d3.event.scale;
            })
        ;
        g.selectAll("path")
            .attr("d", path.projection(projection))
            .style('stroke-width',function(d){
                return 1/d3.event.scale;
            });

        polys.selectAll("polygon")
          .style('stroke-width',function(d){
            return 1/d3.event.scale;
          });


  });
svg.call(zoom)


d3.select('#resetmap').on('click',function(a){
	 radSmall = 2.5;
	 zoom.scale(1);
   zoom.translate([0,0]);d3.event.scale = 1;
	 g.transition()
  	 .duration(750)
  	 .attr('transform','translate(0,0)');
	 scaleFactor = 1;
	 ew = 0, ns = 0;
	 g.selectAll("circle")
     .attr("d", path.projection(projection))
     .attr("r",function(d){
         return radSmall/scaleFactor;
     })
     .style('stroke-width',function(d){
         return 0.2/scaleFactor;
     })
	 ;
	 g.selectAll("path")
	     .attr("d", path.projection(projection))
	     .style('stroke-width',function(d){
	         return 1/scaleFactor;
	  });

   polys.selectAll("polygon")
          .style('stroke-width',function(d){
            return 1/d3.event.scale;
   });
});

d3.select("#zoomtofit").on("click",function(d){
    //var bounds = brush.extent();

  var lats = [];
    datamappoints.forEach(function(a){
      lats.push(a.latitude);
    });
  var  longs = [];
    datamappoints.forEach(function(a){
      longs.push(a.longitude);
    });

  var offset = 10;
  var minlats = d3.min(lats) - offset;
  var maxlats = d3.max(lats) + offset;
  var minlongs = d3.min(longs) - offset;
  var maxlongs = d3.max(longs) + offset;
  var minminxproj = projection([minlongs,minlats])[0];
  var minminyproj = projection([minlongs,minlats])[1];
  var minmaxxproj = projection([minlongs,maxlats])[0];
  var minmaxyproj = projection([minlongs,maxlats])[1];
  var maxminxproj = projection([maxlongs,minlats])[0];
  var maxminyproj = projection([maxlongs,minlats])[1];
  var maxmaxxproj = projection([maxlongs,maxlats])[0];
  var maxmaxyproj = projection([maxlongs,maxlats])[1];

  var bounds = [[minminxproj,minminyproj],
  [maxmaxxproj,maxmaxyproj]
  ];

    //console.log(bounds);
  var dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y - 50];

  zoom.scale(scale);
  zoom.translate(translate);
  d3.event.scale = scale;

  g.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");


   scaleFactor = scale;
   ew = translate[0];
   ns = translate[1];
    g.selectAll("circle")
                   .attr("d", path.projection(projection))
                   .attr("r",function(d){
                       return radSmall/scaleFactor;
                   })
                   .style('stroke-width',function(d){
                       return 0.2/scaleFactor;
                   })
               ;
   g.selectAll("path")
   .transition()
      .duration(750)
       .attr("d", path.projection(projection))
       .style('stroke-width',function(d){
           return 1/scaleFactor;
       });


   polys.selectAll("polygon")
   .transition()
      .duration(750)
          .style('stroke-width',function(d){
            return 1/d3.event.scale;
   });

  

}); // end zoomtofit





function getlevelnode(name,verbose){
  currchildren = childrennodes[currlevel];
  if(verbose=="yes"){console.log("children: ", currchildren);}
  currlevelnode = '';
  currchildren.forEach(function(f){
    //children = get_children(name, CFG['newick_dict'], true);
    //hierstring = CFG['classification_strings'][name];
    //parents = hierstring.split(',');
    //console.log("curr children",parents);
    for(var cl in CFG['classification_strings']){
      var currcl = CFG['classification_strings'][cl].split(',');
      for(var i=1;i<currcl.length;i++){
        parents[currcl[i]] = currcl.slice(0,i+1);
      }
    }
    parents['root'] = [];
    if(parents[name].indexOf(f) > -1){
      currlevelnode = f;
    }
  });
  //console.log("levelnode: ",currlevelnode);
  if(verbose=="yes"){console.log(name,currlevelnode);}
  if(currlevelnode == ""){ return "root";}
  return currlevelnode;
}

// ZOOMABLE SUNBURST
// ########################################

function createSunburst(newickJSONstring){


  var partition = d3.layout.partition()
      .value(function(d) { return 1; })
      ;

  // prepare data

  newnewickJSONstring = newickJSONstring.replace(/branchset/g,"children");

  newickNEW = JSON.parse(newnewickJSONstring);

  hierarchy = { "name": "root", "children": newickNEW};
  //console.log(hierarchy);

  hierdata = partition.nodes(hierarchy);
  //console.log(hierdata);


  hierdata.forEach(function(d){
      if(d.children){
          d.children.forEach(function(c){
              if(childrennodes[d.name]){
                  childrennodes[d.name].push(c.name);
              }
              else{
                  childrennodes[d.name] = [c.name];
              }});
      }
  });

  var swidth = 400,
      sheight = 400,
      radius = Math.min(swidth-30, sheight-30) / 2;

  var x = d3.scale.linear()
      .range([0, 2 * Math.PI]);

  var y = d3.scale.sqrt()
      .range([0, radius]);

  var svgsun = d3.select("#sunburst").append("svg")
      .attr("width", swidth)
      .attr("height", sheight)
      .append("g")
      .attr("transform", "translate(" + swidth / 2 + "," + (sheight / 2 + 10) + ")");

  var arc = d3.svg.arc()
      .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
      .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
      .innerRadius(function(d) { return Math.max(0, y(d.y)); })
      .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

  var pathsun = svgsun.selectAll("path")
      .data(hierdata)
      .enter().append("path")
      .attr("class",function(d){
          return "sunburstarcs";// + 'sun_' + d.name;
      })
      .attr('id',function(d){return 'sun_'+d.name;})
      .attr("d", arc)
      .style("fill", function(d){
          var currname = getlevelnode(d.name);
          if(currname == "root"){ return "#CCC"}
          return groupScale(currname);
        })
      .attr('cursor',"pointer")
      .style('opacity',0.45)
      .style("stroke","black")
      .on("click", function(d){
        currlevel = d.name;
        console.log(d);
        click(d);
      })
      ;

  pathsun
      .attr('id',function(d){return 'sun_'+d.name;})
      .text(function(d){
        return d.name;
      });

  click = function (e) {
    console.log(currlevel);
    pathsun.transition()
      .duration(750)
      .attrTween("d", arcTween(e));

    // update voronoi cells
    d3.selectAll('.poly')
        .style("fill",function(d,i){

          var currname = getlevelnode(datamappoints[i].name);
          if(currname == "root"){ return "#CCC"}
          return groupScale(currname);
        });

    // update sunburst segments
    d3.selectAll('.sunburstarcs')
        .style("fill",function(d,i){
          var currname = getlevelnode(d.name);
          if(currname == "root"){ return "#CCC"}
          return groupScale(currname);
        });
  } // end click function



  d3.select(self.frameElement).style("height", sheight + "px");

  // Interpolate the scales!
  function arcTween(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(y.domain(), [d.y, 1]),
        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
    return function(d, i) {
      return i
          ? function(t) { return arc(d); }
          : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
    };
  }

} // end createSunburst function

//############### plot locations ###############

function drawMapPoints(latlon){

  datamappoints = [];
  for(var key in latlon){
    var currPoint = { "name": key, "latitude": latlon[key][0], "longitude": latlon[key][1]};
    datamappoints.push(currPoint);
  }

  nodeCircles.selectAll("path")
      .data(datamappoints)
      .enter()
      .append("circle")
      .attr('id',function(d){return 'mappoint_'+d.name;})
      .attr('class',function(d){
        return "mappoint";
      })
      .attr('cx',function(d){
        return projection([d.longitude, d.latitude])[0];
      })
      .attr('cy', function(d){
        return projection([d.longitude, d.latitude])[1];
      })
      .attr('r', function(d){
        return radSmall/scaleFactor;
      })
      .style("fill", function(d){
        return "darkGreen";
      })
      .style("stroke","black")
      .style("stroke-width", function(){ return 0.2/scaleFactor;})
      .style("cursor","pointer")
      ;

  cells
      .attr("id", "cells")
      .attr("pointer-events",'none')
      ;

      positions = [];

  datamappoints.forEach(function(a){
    positions.push(projection([a.longitude,a.latitude]));
  });

  polygons = d3.geom.voronoi(positions);

  // plot the voronoi polygons

  polys.selectAll('polygon')
      .data(polygons)
      .enter()
      .append("polygon")
      .attr('class',function(d,i){return 'poly poly_' + i;})
      .attr("points",function(d,i) {
          return d.map(function(m){
              return [m[0],m[1]].join(',');
          }).join(" ");
      })
      .style("fill", function(d,i){

          return groupScale(getlevelnode(datamappoints[i].name));
      })
      .style('stroke','black')
      .style('stroke-width',function(){
        return 1/scaleFactor;
      })
      .style("cursor","pointer")
      .style('opacity',0.4)
      .on("click",function(d,i){
        name = datamappoints[i].name;
        currlevelnode = '';
        currchildren.forEach(function(f){
          for(var cl in CFG['classification_strings']){
            var currcl = CFG['classification_strings'][cl].split(',');
            for(var i=1;i<currcl.length;i++){
              parents[currcl[i]] = currcl.slice(0,i+1);
            }
          }
          parents['root'] = [];
          if(parents[name].indexOf(f) > -1){
            currlevelnode = f;
          }
        });
        //if(currlevelnode == ""){ return "root";}
        console.log(datamappoints[i].name,currlevelnode);
        var reld = hierdata.filter(function(f){ return f.name == currlevelnode; });
        //console.log(reld[0]);
        if(reld.length == 0){
          var reld = hierdata.filter(function(f){ return f.name == currlevel; });
          console.log(reld[0]);
          currparent = reld[0].parent;
          currlevel = currparent.name;
          click(currparent);
        }
        else{
          currlevel = currlevelnode;
          click(reld[0]);
        }
      })
      ;

} // end drawMapPoints function
