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
  var newick_string = document.getElementById('newick_string').value;
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
  $('#db').html(newickJSONstring);
    
    $('#treewindow').append('<div id="tree"></div>');
    d3.phylogram.build("#tree", newick, {skipLabels:false,skipTicks:true,width:400,height:400,skipBranchLengthScaling: true});


  
  // create sunburst with newick
   createSunburst(newickJSONstring);


  }
  else
  {
    fakeAlert("There seems to be problems with the newick format you inserted.");
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

