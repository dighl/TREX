/*
  d3.phylogram.js
  Wrapper around a d3-based phylogram (tree where branch lengths are scaled)
  Also includes a radial dendrogram visualization (branch lengths not scaled)
  along with some helper methods for building angled-branch trees.

  Copyright (c) 2013, Ken-ichi Ueda

  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer. Redistributions in binary
  form must reproduce the above copyright notice, this list of conditions and
  the following disclaimer in the documentation and/or other materials
  provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
  POSSIBILITY OF SUCH DAMAGE.

  DOCUEMENTATION

  d3.phylogram.build(selector, nodes, options)
    Creates a phylogram.
    Arguments:
      selector: selector of an element that will contain the SVG
      nodes: JS object of nodes
    Options:
      width       
        Width of the vis, will attempt to set a default based on the width of
        the container.
      height
        Height of the vis, will attempt to set a default based on the height
        of the container.
      vis
        Pre-constructed d3 vis.
      tree
        Pre-constructed d3 tree layout.
      children
        Function for retrieving an array of children given a node. Default is
        to assume each node has an attribute called "branchset"
      diagonal
        Function that creates the d attribute for an svg:path. Defaults to a
        right-angle diagonal.
      skipTicks
        Skip the tick rule.
      skipBranchLengthScaling
        Make a dendrogram instead of a phylogram.
  
  d3.phylogram.buildRadial(selector, nodes, options)
    Creates a radial dendrogram.
    Options: same as build, but without diagonal, skipTicks, and 
      skipBranchLengthScaling
  
  d3.phylogram.rightAngleDiagonal()
    Similar to d3.diagonal except it create an orthogonal crook instead of a
    smooth Bezier curve.
    
  d3.phylogram.radialRightAngleDiagonal()
    d3.phylogram.rightAngleDiagonal for radial layouts.
*/

if (!d3) { throw "d3 wasn't included!"};
(function() {
  d3.phylogram = {}
  d3.phylogram.rightAngleDiagonal = function() {
    var projection = function(d) { return [d.y, d.x]; }
    
    var path = function(pathData) {
      return "M" + pathData[0] + ' ' + pathData[1] + " " + pathData[2];
    }
    
    function diagonal(diagonalPath, i) {
      var source = diagonalPath.source,
          target = diagonalPath.target,
          midpointX = (source.x + target.x) / 2,
          midpointY = (source.y + target.y) / 2,
          pathData = [source, {x: target.x, y: source.y}, target];
      pathData = pathData.map(projection);
      return path(pathData)
    }
    
    diagonal.projection = function(x) {
      if (!arguments.length) return projection;
      projection = x;
      return diagonal;
    };
    
    diagonal.path = function(x) {
      if (!arguments.length) return path;
      path = x;
      return diagonal;
    };
    
    return diagonal;
  }

  /* addon by @lingulist */
  d3.phylogram.leftAngleDiagonal = function() {
    var projection = function(d) { return [d.x, d.y]; }
    
    var path = function(pathData) {
      return "M" + pathData[0] + ' ' + pathData[1] + " " + pathData[2];
    }
    
    function diagonal(diagonalPath, i) {
      var source = diagonalPath.source,
          target = diagonalPath.target,
          midpointX = (source.x + target.x) / 2,
          midpointY = (source.y + target.y) / 2,
          pathData = [source, {x: target.x, y: source.y}, target];
      pathData = pathData.map(projection);
      return path(pathData)
    }
    
    diagonal.projection = function(x) {
      if (!arguments.length) return projection;
      projection = x;
      return diagonal;
    };
    
    diagonal.path = function(x) {
      if (!arguments.length) return path;
      path = x;
      return diagonal;
    };
    
    return diagonal;
  }

  d3.phylogram.radialRightAngleDiagonal = function() {
    return d3.phylogram.rightAngleDiagonal()
      .path(function(pathData) {
        var src = pathData[0],
            mid = pathData[1],
            dst = pathData[2],
            radius = Math.sqrt(src[0]*src[0] + src[1]*src[1]),
            srcAngle = d3.phylogram.coordinateToAngle(src, radius),
            midAngle = d3.phylogram.coordinateToAngle(mid, radius),
            clockwise = Math.abs(midAngle - srcAngle) > Math.PI ? midAngle <= srcAngle : midAngle > srcAngle,
            rotation = 0,
            largeArc = 0,
            sweep = clockwise ? 0 : 1;
        return 'M' + src + ' ' +
          "A" + [radius,radius] + ' ' + rotation + ' ' + largeArc+','+sweep + ' ' + mid +
          'L' + dst;
      })
      .projection(function(d) {
        var r = d.y, a = (d.x - 90) / 180 * Math.PI;
        return [r * Math.cos(a), r * Math.sin(a)];
      })
  }
  
  // Convert XY and radius to angle of a circle centered at 0,0
  d3.phylogram.coordinateToAngle = function(coord, radius) {
    var wholeAngle = 2 * Math.PI,
        quarterAngle = wholeAngle / 4
    
    var coordQuad = coord[0] >= 0 ? (coord[1] >= 0 ? 1 : 2) : (coord[1] >= 0 ? 4 : 3),
        coordBaseAngle = Math.abs(Math.asin(coord[1] / radius))
    
    // Since this is just based on the angle of the right triangle formed
    // by the coordinate and the origin, each quad will have different 
    // offsets
    switch (coordQuad) {
      case 1:
        coordAngle = quarterAngle - coordBaseAngle
        break
      case 2:
        coordAngle = quarterAngle + coordBaseAngle
        break
      case 3:
        coordAngle = 2*quarterAngle + quarterAngle - coordBaseAngle
        break
      case 4:
        coordAngle = 3*quarterAngle + coordBaseAngle
    }
    return coordAngle
  }
  
  d3.phylogram.styleTreeNodes = function(vis,options) {
    var node_size = options.node_size || 6;

    vis.selectAll('g.leaf.node')
      .append("svg:circle")
        .attr("r", node_size)
        .attr('stroke',  'black')
        .attr('fill', 'white')
        .attr('id', function(d){return d.name})
        .attr('class','leaf tree_node')
        .attr('stroke-width', '2px');

    vis.selectAll('g.inner.node')
      .append('svg:circle')
        .attr('r',node_size)
        .attr('stroke', 'black')
        .attr('fill', 'white')
        .attr('id',function(d){return d.name})
        .attr('class','inner_node tree_node')
        //.attr('title',function(d){return d.name})
        .attr('stroke-width','2px');
    
    vis.selectAll('g.root.node')
      .append('svg:circle')
        .attr("r", node_size)
        .attr('class','tree_node')
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', '2px');
  }
  
  function scaleBranchLengths(nodes, w) {
    // Visit all nodes and adjust y pos width distance metric
    var visitPreOrder = function(root, callback) {
      callback(root)
      if (root.children) {
        for (var i = root.children.length - 1; i >= 0; i--){
          visitPreOrder(root.children[i], callback)
        };
      }
    }
    visitPreOrder(nodes[0], function(node) {
      node.rootDist = (node.parent ? node.parent.rootDist : 0) + (node.length || 0)
    })
    var rootDists = nodes.map(function(n) { return n.rootDist; });
    var yscale = d3.scale.linear()
      .domain([0, d3.max(rootDists)])
      .range([0, w]);
    visitPreOrder(nodes[0], function(node) {
      node.y = yscale(node.rootDist)
    })
    return yscale
  }
  
  
  d3.phylogram.build = function(selector, nodes, options) {
    options = options || {}
    var font_size = options.font_size || "10px";
    var w = options.width || d3.select(selector).style('width') || d3.select(selector).attr('width'),
        h = options.height || d3.select(selector).style('height') || d3.select(selector).attr('height'),
        w = parseInt(w),
        h = parseInt(h);
    var tree = options.tree || d3.layout.cluster()
      .size([h, w])
      .sort(function(node) { return node.children ? node.children.length : -1; })
      .children(options.children || function(node) {
        return node.branchset
      });
    var diagonal = options.diagonal || d3.phylogram.rightAngleDiagonal();
    var vis = options.vis || d3.select(selector).append("svg:svg")
        .attr("width", w + 300)
        .attr("height", h + 30)
      .append("svg:g")
        .attr("transform", "translate(20, 20)");
    var nodes = tree(nodes);
    
    if (options.skipBranchLengthScaling) {
      var yscale = d3.scale.linear()
        .domain([0, w])
        .range([0, w]);
    } else {
      var yscale = scaleBranchLengths(nodes, w)
    }

    if (!options.skipTicks) {
      vis.selectAll('line')
          .data(yscale.ticks(10))
        .enter().append('svg:line')
          .attr('y1', 0)
          .attr('y2', h)
          .attr('x1', yscale)
          .attr('x2', yscale)
          .attr("stroke", "#000");

      vis.selectAll("text.rule")
          .data(yscale.ticks(10))
        .enter().append("svg:text")
          .attr("class", "rule")
          .attr("x", yscale)
          .attr("y", 0)
          .attr("dy", -3)
          .attr("text-anchor", "middle")
          .attr('font-size', '8px')
          .attr('fill', '#000')
          .text(function(d) { return Math.round(d*100) / 100; });
    }
        
    var link = vis.selectAll("path.link")
        .data(tree.links(nodes))
      .enter().append("svg:path")
        .attr("class", "link")
        .attr("d", diagonal)
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", "4px")
        .attr("id",function(d){return "link_"+d.source.name+'_'+d.target.name;});

    //alert(JSON.stringify(Object.keys(tree.links(nodes)["1"].id)));
        
    var node = vis.selectAll("g.node")
        .data(nodes)
      .enter().append("svg:g")
        .attr("class", function(n) {
          if (n.children) {
            if (n.depth == 0) {
              return "root node"
            } else {
              return "inner node"
            }
          } else {
            return "leaf node"
          }
        })
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .on('click',click);

    function click(d) 
    {
      if (d.branchset) 
      {
        d._children = d.branchset;
        d.children = null;
        d.branchset = null;  
        d.toggled = true;
      } 
      else 
      {
        d.branchset = d._children;
        d._children = null;
        d.children = d._children;
        d.toggled = false;
      }
      d3.phylogram.update(selector, nodes, options); 
    }
      
    d3.phylogram.styleTreeNodes(vis,options)
    
    if (!options.skipLabels) {
      vis.selectAll('g.inner.node')
        .append("svg:text")
          .attr("dx", -6)
          .attr("dy", -6)
          .attr("text-anchor", 'end')
          .attr('font-size', '8px')
          .attr('fill', '#000')
          //.text(function(d) { return d.name; })
          ;

      vis.selectAll('g.leaf.node').append("svg:text")
        .attr("dx", 10)
        .attr("dy", 3)
        .attr("text-anchor", "start")
        .attr('font-family', 'Helvetica Neue, Helvetica, sans-serif')
        .attr('font-size', font_size)
        .attr('fill', 'black')
        .text(function(d) { return d.name });
    }
    
    return {tree: tree, vis: vis}
  }
  
  /* update tree when toggling layout */
  d3.phylogram.update = function(selector, nodes, options)
  {
    /* solution can be accomplished as follows:
     *
     * - START by selecting all children of the given node, including their intermediate nodes 
     * - have them all disappear
     * - reset the name of the node which was clicked
     * 
     * as an alternative:
     *
     * - recompute new tree layout
     * - check for each element whether it is still present or not, if not have it being deleted
     * - 
     */
    var diagonal = options.diagonal || d3.phylogram.rightAngleDiagonal();
    var tree = options.tree || d3.layout.cluster()
      .size([options.height, options.width])
      .sort(function(node) { return node.children ? node.children.length : -1; })
      .children(options.children || function(node) {
        return node.branchset
      });

    /* retrieve the old object */
    var old_vis = d3.select('#tree > svg');
    
    var new_nodes = tree(CFG['newick_object']);
    var modifier = {}
    // iterate over new nodes 
    for(key in new_nodes)
    {
      var base = new_nodes[key];
      var bset = new_nodes[key]['branchset'];
      var depth = new_nodes[key]['depth'];
      var x = new_nodes[key]['x'];
      var y = new_nodes[key]['y'];
      var name = new_nodes[key]['name'];
      if(typeof bset == 'undefined')
      {
        bset = 'leaf';
      }
      else if(bset === null)
      {
        bset = 'leaf';
      }
      else
      {
        bset = 'inner';
      }
      modifier[name] = [x,y,bset];
    }
   
    old_vis.selectAll('g.node')
      .transition().duration(750)
      .attr(
          'transform',
          function(d){

            if(d.name in modifier){
            
              var y = modifier[d.name][1];
              var x = modifier[d.name][0];

              if(options.radial)
              {
                return "rotate(" + (x-90)+")translate("+y+")";
              }
              else
              {
                return 'translate('+modifier[d.name][1]+','+modifier[d.name][0]+')';
              }
            } 
            else{
              if(options.radial)
              {
                return "rotate(" + (d.x-90)+")translate("+d.y+")";
              }
              else
              {
                return "translate("+d.y+","+d.x+")";
              }
            }
        })
      .attr('style',function(d){if(d.name in modifier){return 'display:inline'} else{return "display:none"}})
      .attr('class', function(d){
        if(d.name in modifier){
          if(modifier[d.name][2] == 'leaf')
          {
            return 'leaf node';
          }
          else
          {
            return 'inner node';
          }
        }
        else
        {
          return 'node';
        }});
    
    old_vis.selectAll('path.link')
      .transition().duration(750)
      .attr(
          'style',
          function(d){
            if(d.source.name in modifier && d.target.name in modifier){
              return "display:inline"} 
            else{
              return "display:none"}
          })
      .attr('d',diagonal)
    ;

    old_vis.selectAll('g.node text').remove();
    
    if(options.radial)
    {
      old_vis.selectAll('g.node').append("svg:text")
        .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
        .attr('font-family', 'Helvetica Neue, Helvetica, sans-serif')
        .attr('font-size', options.font_size)
        .attr(
            'fill', 
            function(d){
              if(d.toggled){
                return 'red'}
              else{
                return 'black'}
            })
        .text(function(d) { 
          if(d.name in modifier){
            if(modifier[d.name][2] == 'leaf')
            {
              return d.name 
            }
            else
            {
              return '';
            }
          }
          else
          {
            return '';
          }
        });
    }
    else
    {
      old_vis.selectAll('g.node').append("svg:text")
        .attr("dx", 10)
        .attr("dy", 3)
        .attr("text-anchor", "start")
        .attr('font-family', 'Helvetica Neue, Helvetica, sans-serif')
        .attr('font-size', options.font_size)
        .attr(
            'fill', 
            function(d){
              if(d.toggled){
                return 'red'}
              else{
                return 'black'}
            })
        .text(function(d) { 
          if(d.name in modifier){
            if(modifier[d.name][2] == 'leaf')
            {
              return d.name 
            }
            else
            {
              return '';
            }
          }
          else
          {
            return '';
          }
        });
    }

  }
  
  d3.phylogram.buildRadial = function(selector, nodes, options) {
    options = options || {}
    var w = options.width || d3.select(selector).style('width') || d3.select(selector).attr('width'),
        r = w / 1.25, 
        labelWidth = options.skipLabels ? 10 : options.labelWidth || 120;
    
    var node_size = options.node_size || 8;
    var font_size = options.font_size || "10px";

    var vis = d3.select(selector).append("svg:svg")
        .attr("width", r * 2)
        .attr("height", r * 2)
      .append("svg:g")
        .attr("transform", "translate(" + r + "," + r + ")");
        
    var tree = d3.layout.cluster()
      .size([360, r - labelWidth])
      .sort(function(node) { return node.children ? node.children.length : -1; })
      .children(options.children || function(node) {
        return node.branchset
      })
      .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
    
    var diagonalx = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    var phylogram = d3.phylogram.build(selector, nodes, {
      vis: vis,
      tree: tree,
      node_size: node_size,
      skipBranchLengthScaling: true,
      skipTicks: true,
      skipLabels: options.skipLabels,
      diagonal: d3.phylogram.radialRightAngleDiagonal()
    })

    vis.selectAll('g.node')
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
      .on('click',click);

    options.diagonal = d3.phylogram.radialRightAngleDiagonal();
    options.tree = tree;
    options.radial = true;
    
    function click(d) 
    {
      if (d.branchset) 
      {
        d._children = d.branchset;
        d.children = null;
        d.branchset = null;
        d.toggled = true;
      } 
      else 
      {
        d.branchset = d._children;
        d._children = null;
        d.children = d._children;
        d.toggled = false;
      }
      d3.phylogram.update(selector, nodes, options); 
    }
    
    if (!options.skipLabels) {
      vis.selectAll('g.leaf.node text')
        .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
        .attr('font-family', 'Helvetica Neue, Helvetica, sans-serif')
        .attr('font-size', font_size)
        .attr('fill', 'black')
        .text(function(d) { return d.name; });

      vis.selectAll('g.inner.node text')
        .attr("dx", function(d) { return d.x < 180 ? -6 : 6; })
        .attr("text-anchor", function(d) { return d.x < 180 ? "end" : "start"; })
        .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; });
    }
    
    return {tree: tree, vis: vis}
  }
}());
