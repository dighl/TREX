
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
	//.scale(mapscale) //.scale(mapscale)
	//.translate([290,171])
	;


$('#mapcontainer').css("height",function(){return height + 120;});

//############### make basic plot ###############
var svg = d3.select("#map").append("svg") 
	.attr("width", width)
	.attr("height", height)
	.style('cursor',"move")
	;
var g = svg.append("g");
var mapPoly = g.append('g').attr('class','mapPoly')
var edgeArcs = g.append('g').attr('class','edgeArcs'); 
var overall = g.append('g').attr('class','overAll');

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
    .scaleExtent([1, 8])
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
	     
     
 
  
});





