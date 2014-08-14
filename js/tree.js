function fakeAlert(text)
{
  var falert = document.createElement('div');
  falert.id = 'fake';
  var text = '<div class="message"><p>' + text + '</p>';
  text += '<div class="okbutton" onclick="' + "$('#fake').remove(); document.onkeydown = function(event){basickeydown(event)};" + '")> OK </div></div>';
  falert.className = 'fake_alert';

  document.body.appendChild(falert);
  falert.innerHTML = text;
  document.onkeydown = function(event){$('#fake').remove(); document.onkeydown = function(event){basickeydown(event);};};

}

function checkfortreeparse(event)
{
  if(event.keyCode == 13)
  {
    parseTree();
  }
  else
  {
    return;
  }
}

function parseTree()
{
  //var newick_string = document.getElementById('newick_string').value;
  var ethnologue = document.getElementById('ethnologue').value;
  var tmp = getEthnologue();
  var newick_string = tmp[0];
  var latlon = tmp[1]; 

  /* debug message */
  $('#db').html("Coordinates: "+JSON.stringify(latlon));
  
  var nst = document.getElementById('newick_string');
  nst.innerHTML = '<b>Computed classification in NEWICK format: </b> <pre><code>'+newick_string+'</code></pre>';
  nst.style.display = 'block';


  var treewindow = document.getElementById('treewindow');
  treewindow.innerHTML = '';
  
  if(newick_string.indexOf(';') == newick_string.length -1)
  {

    var newick = Newick.parse(newick_string); 
    var newickNodes = [];
    function buildNewickNodes(node, callback)
    {
      newickNodes.push(node)
        if(node.branchset)
        {
          for(var i=0; i < node.branchset.length; i++)
          {
            buildNewickNodes(node.branchset[i])
          }
        }
    }
    buildNewickNodes(newick);

    /* debug for showing what format the newick is in */
    var newickJSONstring = JSON.stringify(newick.branchset);
    
    //$('#db').html(newickJSONstring);
    
    /* create the phylogram of the newick tree */
    $('#treewindow').append('<div id="tree"></div>');
    d3.phylogram.build("#tree", newick, {skipLabels:false,skipTicks:true,width:400,height:400,skipBranchLengthScaling: true});

    // create sunburst with newick
    // replace old svg first, make sure nothing remained 
    document.getElementById('sunburst').innerHTML = '';
    createSunburst(newickJSONstring);

    $('#tree').draggable();

  }
  else
  {
    fakeAlert("There seem to be problems with the newick format you inserted.");
  }

}

function createObjectFromNewick(newick_string)
{
  var newick = Newick.parse(newick_string); 
  var newickNodes = [];
  function buildNewickNodes(node, callback)
  {
    newickNodes.push(node)
      if(node.branchset)
      {
        for(var i=0; i < node.branchset.length; i++)
        {
          buildNewickNodes(node.branchset[i])
        }
      }
  }
  buildNewickNodes(newick);
  return newick;
}

function getEthnologue()
{
  var ethnologue = document.getElementById('ethnologue').value;
  var elist = ethnologue.split(/\n|\r\n/);
  var dpoints = [];
  for(var i=1,row;row=elist[i];i++)
  {
    dpoints.push(row.split('\t'));
  }
  var header = elist[0].split('\t');

  /* get index for CLS */
  var clsIdx = header.indexOf('CLS');

  /* get indices for lat lon */
  var latIdx = header.indexOf("LAT");
  var lonIdx = header.indexOf("LON");

  var latlon = {};

  var classification = {};
  for(var i=0,row;row=dpoints[i];i++)
  {
    var lineage = row[clsIdx].split(',');
    var taxon = row[0]+':0'; /* currently, we store taxon at first pos */

    latlon[row[0]] = [row[latIdx],row[lonIdx]];
    
    for(var j=0,node;node=lineage[j];j++)
    {
      var parnt = node+':'+(j+1)
      var child = lineage[j+1]+':'+(j+2);

      if(j < lineage.length - 1)
      {
        if(parnt in classification)
        {
          if(classification[parnt].indexOf(child) == -1)
          {
            classification[parnt].push(child);
          }
        }
        else
        {
          classification[parnt] = [child];
        }
      }
      else
      {
        if(parnt in classification)
        {
          if(classification[parnt].indexOf(taxon) == -1)
          {
            classification[parnt].push(taxon);
          }
        }
        else
        {
          classification[parnt] = [taxon];
        }
      }
    }
  }

  /* reduce nodes by eliminating those nodes which have only one child */
  var good_nodes = [];
  for(node in classification)
  {
    /* if length is smaller than one, the node can be discarded and replaced by its child instead */
    if(classification[node].length > 1)
    {
      good_nodes.push(node);
    }
    else if(classification[node][0].split(':')[1] == '0')
    {
      good_nodes.push(classification[node][0]);
    }
  }

  var newick = {};

  /* second run, create dictionary, but ignore nodes irrelevant for the classification */
  for(var i=0,row;row=dpoints[i];i++)
  {
    var lineage = row[clsIdx].split(',');
    var taxon = row[0]+':0';
    
    var current_parent = '';

    for(var j=0,node;node=lineage[j];j++)
    {
      if(j < lineage.length -1)
      {
        var next_parent = node+':'+(j+1);
        var child = node+':'+(j+2);

        var npIdx = good_nodes.indexOf(next_parent);
        var chIdx = good_nodes.indexOf(child);
        var cpIdx = good_nodes.indexOf(current_parent);

        if(current_parent == '' && npIdx != -1)
        {
          current_parent = next_parent;
          if(next_parent in newick)
          {
          }
          else
          {
            newick[next_parent] = [];
          }
        }
        else if(cpIdx != -1 && npIdx != -1)
        {
          if(current_parent in newick)
          {
            if(newick[current_parent].indexOf(next_parent) == -1)
            {
              newick[current_parent].push(next_parent);
            }
          }
          else
          {
            newick[current_parent] = [next_parent];
          }
          current_parent = next_parent;
        }
        else if(cpIdx != -1 && npIdx == -1)
        {
          if(current_parent in newick)
          {
          }
          else
          {
            newick[current_parent] = [];
          }
        }
        else if(cpIdx == -1)
        {
          current_parent = '';
        }
      }
      else
      {
        var next_node = node + ':' + (j+1);
        if(good_nodes.indexOf(next_node) != -1)
        {
          if(newick[current_parent].indexOf(next_node) == -1)
          {
            newick[current_parent].push(next_node);
          }
          if(next_node in newick)
          {
            newick[next_node].push(taxon);
          }
          else
          {
            newick[next_node] = [taxon];
          }
        }
        else
        {
          newick[current_parent].push(taxon);
        }
      }
    }
  }

  // now we transform the whole stuff into a newick string
  // this is a bit redundant, since we will then again parse it using
  // newick.js, but it is useful, since we also want to pass the newick
  // data as output, so that people can reuse it for their purpose

  best_key = 1000;
  root_node = '';
  for(key in newick)
  {
    var new_key = parseInt(key.split(':')[1]);
    if(new_key > 0 && new_key < best_key)
    {
      best_key = new_key;
      root_node = key;
    }
  }
  
  var newick_string = root_node+';';
  var queue = [root_node];
  while(queue.length > 0)
  {
    var next_key = queue.shift();
    var parent_name = next_key.split(':')[0];
    var values = newick[next_key];
  
    /* check for leaves in the tree and remove their number */
    for(var i=0,node;node=values[i];i++)
    {
      if(node.indexOf(':0') != -1)
      {
        values[i] = values[i].split(':0')[0];
      }
    }
    var rep_string = '('+values.join(',')+')'+parent_name;
    newick_string = newick_string.replace(next_key,rep_string);

    for(var i=0,value;value=values[i];i++)
    {
      if(value.indexOf(':') != -1)
      {
        queue.push(value);
      }
    }
  }
  return [newick_string,latlon];
}

var STORE = '';

function handleFileSelect(evt)
{
  evt.stopPropagation();
  evt.preventDefault();
  
  var files = evt.dataTransfer.files;
  var file = files[0];
  var reader = new FileReader({async:false});
  var textarea = document.getElementById('ethnologue');
  reader.onload = function(e){ethnologue.value = reader.result};
  reader.readAsText(file);
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

var dropZone = document.getElementById('ethnologue');
dropZone.addEventListener('dragover',handleDragOver,false);
dropZone.addEventListener('drop',handleFileSelect,false);

