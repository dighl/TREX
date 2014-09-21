/* Tree handler for TREX
 *
 * author   : Johann-Mattis List, Thomas Mayer
 * email    : mattis.list@lingulist.de
 * created  : 2014-09-16 14:36
 * modified : 2014-09-16 14:36
 *
 */

/* set up a global configuration variable */
var CFG = {};
CFG['tree_height'] = 30;
CFG['tree_width'] = 400;
CFG['newick'] = false;
CFG['newick_dict'] = false;
CFG['tree_layout'] = 'rectangle';
CFG['tree_node_size'] = 5;
CFG['tree_font_size'] = 8;
CFG['newick_object'] = false;
CFG['taxa'] = [];
CFG['map_node_size'] = false;

var STORE = ''; // variable needed for file select
//var DOCUL = {}; // variable stores doculect external data


function generateTestData() {
  var txt = "Name	LAT	LON	CLS\n" + 
    "Beijing	40.0500	116.4200	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Northern,Beijing\n" + 
    "Changsha	28.8503	112.9433	Chinese,CentralChinese,Xiang,Changsha\n" + 
    "Chengdu	30.6058	103.9709	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Southwestern,Chengdu\n" + 
    "Fuzhou	26.0890	119.2942	Chinese,SouthernChinese,Min,Coastal,Fuzhou\n" + 
    "Guangzhou	23.5000	113.1000	Chinese,SouthernChinese,Cantonese,Yue,Guangzhou\n" + 
    "Guiyang	26.7169	106.6383	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Southwestern,Kungui,Guiyang\n" + 
    "Haerbin	45.8466	126.5511	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Northern,Haerbin\n" + 
    "Haikou	20.0439	110.3294	Chinese,SouthernChinese,Min,Southern,Haikou\n" + 
    "Hangzhou	29.2500	119.8000	Chinese,CentralChinese,Hui-Wu,Wu,Taichao,Hangzhou\n" + 
    "Hefei	31.8736	117.2237	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Eastern,Hefei\n" + 
    "Huhehaote	40.8555	111.7439	Chinese,NorthernChinese,Mandarin-Jin,Jin,Huhehaote\n" + 
    "Jian’ou	27.0424	118.3074	Chinese,SouthernChinese,Min,Jian’ou\n" + 
    "Jinan	36.6908	116.9973	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Northern,Beifang,Jinan\n" + 
    "Kunming	25.0497	102.7227	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Southwestern,Kungui,Kunming\n" + 
    "Lanzhou	36.0805	103.8384	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Northwestern,Lanyin,Lanzhou\n" + 
    "Meixian	24.5000	115.9500	Chinese,SouthernChinese,Hakka,Meixian\n" + 
    "Nanchang	28.7066	115.8575	Chinese,CentralChinese,Gan,Nanchang\n" + 
    "Nanjing	32.5000	119.0000	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Eastern,Nanjing\n" + 
    "Nanning	22.8487	108.3662	Chinese,SouthernChinese,Cantonese,Pinghua,Nanning\n" + 
    "Pingyao	37.2021	111.7500	Chinese,NorthernChinese,Mandarin-Jin,Jin,Pingyao\n" + 
    "Qingdao	36.0894	120.3797	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Northern,Qingdao\n" + 
    "Shanghai	31.2229	121.4754	Chinese,CentralChinese,Hui-Wu,Wu,Taichao,Suhujia,Shanghai\n" + 
    "Shantou	23.3500	116.6667	Chinese,SouthernChinese,Min,Coastal,Southern,Shantou\n" + 
    "Shexian	30.5898	118.4283	Chinese,CentralChinese,Hui-Wu,Hui,Shexian\n" + 
    "Suzhou	31.5000	120.0000	Chinese,CentralChinese,Hui-Wu,Wu,Taichao,Suhujia,Suzhou\n" + 
    "Taibei	25.3000	121.9000	Chinese,SouthernChinese,Min,Coastal,Southern,Taibei\n" + 
    "Taiyuan	37.8842	113.2500	Chinese,NorthernChinese,Mandarin-Jin,Jin,Taiyuan\n" + 
    "Taoyuan	24.0000	120.5000	Chinese,SouthernChinese,Hakka,Taoyuan\n" + 
    "Tianjin	39.1861	117.2154	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Northern,Beifang,Tianjin\n" + 
    "Tunxi	29.0000	118.0000	Chinese,CentralChinese,Hui-Wu,Hui,Tunxi\n" + 
    "Wenzhou	28.0055	120.7012	Chinese,CentralChinese,Hui-Wu,Wu,Wenzhou\n" + 
    "Wuhan	30.6241	114.3056	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Southwestern,Wuhan\n" + 
    "Wulumuqi	43.9000	89.0000	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Northwestern,Lanyin,Wulumuqi\n" + 
    "Xiamen	24.4942	118.0892	Chinese,SouthernChinese,Min,Coastal,Southern,Xiamen\n" + 
    "Xianggang	22.4226	114.0984	Chinese,SouthernChinese,Cantonese,Yue,Xianggang\n" + 
    "Xiangtan	27.0000	112.9455	Chinese,CentralChinese,Xiang,Xiangtan\n" + 
    "Xining	36.6713	101.7769	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Northwestern,Zhongyuan,Xining\n" + 
    "Xi’an	34.2282	108.9606	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Northwestern,Zhongyuan,Xi’an\n" + 
    "Yinchuan	38.5467	106.2401	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Northwestern,Lanyin,Yinchuan\n" + 
    "Zhengzhou	34.8077	113.6394	Chinese,NorthernChinese,Mandarin-Jin,Guanhua,Northwestern,Zhongyuan,Zhengzhou\n"  
  document.getElementById('ethnologue').value = txt; 
}
function generateRandomData() {
  var fams = {};
  for (key in DOCUL) {
    var fam = DOCUL[key][4].split(',')[1];
    try {
      fams[fam].push(key);
    }
    catch (e) {
      fams[fam] = [key];
    }
  }
  /* select random family */
  var randint = parseInt(Object.keys(fams).length * Math.random() + 0.5);
  var count = 0;
  for(fam in fams) {
    if (randint == count) {
      families = fams[fam];
      break;
    }
    count += 1
  }
  /* create set of random integers */
  var rands = [];
  for (var i=0;i<50; i++) {
    
    var lang = families[parseInt(families.length * Math.random()+0.5)];
    if (rands.indexOf(lang) == -1) {
      rands.push(lang);
    }
  }
  var txt = 'NAME\tISO\n';
  for (var i=0, rand; rand=rands[i]; i++) {
    txt +=  DOCUL[rand][0]+'\t'+rand+'\n';
  }
  document.getElementById('ethnologue').value = txt;
}

function fakeAlert(text)
{
  var falert = document.createElement('div');
  falert.id = 'fake';
  var text = '<div class="message"><p>' + text + '</p>';
  text += '<button style="margin-bottom:10px" class="btn btn-success" onclick="' + "$('#fake').remove();" + '")> OK </button><br></div>';
  falert.className = 'fake_alert';

  document.body.appendChild(falert);
  falert.innerHTML = text;
  document.onkeydown = function(event){
    $('#fake').remove(); 
    //document.onkeydown = function(event){basickeydown(event);};
  };
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
  var newick_dict = tmp[2];

  /* append newick_string to CFG */
  CFG['newick'] = newick_string;
  CFG['taxa'] = Object.keys(latlon);
  CFG['taxlen'] = CFG['taxa'].length;
  CFG['newick_dict'] = newick_dict;

  /* debug message */
  //$('#db').html("Coordinates: "+JSON.stringify(latlon));
  
  var nst = document.getElementById('newick_string');
  nst.innerHTML = '<b>Computed classification in NEWICK format: </b> <pre><div oncontextmenu="exportNewick(event);" title="Click to edit, right click to download." onclick="this.contentEditable=\'true\';" id="newick_code">'+newick_string+'</div></pre>';
  
  /* reset default behaviour, since otherwise element won't be editable in firefox */
  $('#newick_code').bind('mousedown.ui-disableSelection selectstart.ui-disableSelection', function(event) {
      event.stopImmediatePropagation();
  })

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
    createTree();

    // create sunburst with newick
    // replace old svg first, make sure nothing remained, same applies to map ?
    document.getElementById('sunburst').innerHTML = '';
    $('.mappoint').remove();
    document.getElementById('map').innerHTML = '';
    drawmapsunburst(newickJSONstring,latlon);
    //createSunburst(newickJSONstring);
    //drawMapPoints(latlon);

    $('#tree').draggable();

  }
  else
  {
    fakeAlert("There seem to be problems with the newick format you inserted.");
  }
  

  $('.sunburstarcs').on('mouseover', function(){
    var children = get_children(this.id.replace(/^sun_/,''),newick_dict);
    for(var i=0,child;child=children[i];i++)
    {
      $('#mappoint_'+child).css('fill','red').attr('r', function(d,i){return resizeMapNodes(i,'up');});
    }
  });
  $('.sunburstarcs').on('mouseout', function(){
    var children = get_children(this.id.replace(/^sun_/,''),newick_dict);
    for(var i=0,child;child=children[i];i++)
    {
      $('#mappoint_'+child).css('fill','DarkGreen').attr('r', function(d,i){return resizeMapNodes(i,'down');});
      
    }
  });
  $('.sunburstarcs').tipsy({gravity: 'w', html:true,title: function(){return this.id.replace(/^sun_/,'');}});
  $('.mappoint').tipsy({gravity: 'w', html: true, title: function(){return this.id.replace(/^mappoint_/,'');}});

}

/* function to modify the nodes on the map */
function resizeMapNodes(size,bigorsmall)
{
  if(bigorsmall == 'down')
  {
    if(CFG['map_node_size'])
    {
      return CFG['map_node_size'];
    }
    else
    {
      return size;
    }
  }
  else
  {
    CFG['map_node_size'] = parseFloat(size);
    return parseFloat(size) + 0.5 * parseFloat(size);
  }
}

/* function to create a newick object from a newick string */
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

/* core function returns newick strings from ethnologue style classifications */
function getEthnologue()
{
  var ethnologue = document.getElementById('ethnologue').value;
  var elist = ethnologue.split(/\n|\r\n/);
  var dpoints = [];

  var clsify = '';
  var clsify = document.getElementsByClassName('classify');
  if(clsify[0].checked) {
    clsify = 3;
  }
  else {
    clsify = 4;
  }

  for(var i=1,row;row=elist[i];i++)
  {
    dpoints.push(row.split('\t'));
  }

  /* create the header */
  var header = elist[0].split('\t');

  /* get index for CLS */
  var clsIdx = header.indexOf('CLS');

  /* get indices for lat lon */
  var latIdx = header.indexOf("LAT");
  var lonIdx = header.indexOf("LON");

  /* if lat and lon are undefined, we need to supply the data from our big tsv-file */
  _added_values = false; /* store status of added values  for later check */
  if(latIdx == -1 || clsIdx == -1)
  {
    //parseDoculects();

    /* get index of iso in header */
    var isoIdx = header.indexOf('ISO');

    if(isoIdx == -1){fakeAlert('no iso-codes specified!')} // debug
    _added_values = true;
  }

  if(latIdx == -1)
  {
    latIdx = header.length;
    lonIdx = latIdx + 1;

    header.push('LAT');
    header.push('LON');

    for(var i=0,line;line=dpoints[i];i++)
    {
      var iso = line[isoIdx];
      var lat = DOCUL[iso][1];
      var lon = DOCUL[iso][2];
      dpoints[i].push(lat);
      dpoints[i].push(lon);
    }
  }
  if(clsIdx == -1)
  {
    clsIdx = header.length;

    header.push("CLS");

    for(var i=0,line;line=dpoints[i];i++)
    {
      var iso = line[isoIdx];
      var cls = DOCUL[iso][clsify]; // currently only ethnologue, no further choice!
      dpoints[i].push(cls);
    }
  }

  if(_added_values)
  {
    var txt = header.join('\t')+'\n';
    for(var i=0,line;line=dpoints[i];i++)
    {
      txt += line.join('\t')+'\n';
    }

    fakeAlert("No coordinates were provided, added data automatically.");
    
    document.getElementById('ethnologue').value = txt;
  }
  
  var latlon = {}

  /* retrieve the classification from the input string */
  var classification = {}; // stores classification
  var tracker = {} // stores non-unique items and creates unique ones
  var converter = {} // stores replacement names
  
  for(var i=0,row;row=dpoints[i];i++)
  {
    var lineage = row[clsIdx].split(',');
    var taxon = row[0];
    for(var j=1;j<lineage.length;j++)
    {
      var node = lineage[j];
      
      var parents = lineage.slice(0,j).join(',');
      
      if(node in tracker)
      {
        if(tracker[node].indexOf(parents) != -1)
        {
          if(node+'/'+parents in converter)
          {
            dpoints[i][clsIdx] = dpoints[i][clsIdx].replace(parents+','+node,parents+','+converter[node+'/'+parents]);
          }
        }
        else
        {
          /* append alternative node to tracker */
          var new_node = node + (tracker[node].length+1);
          converter[node+'/'+parents] = new_node;
          dpoints[i][clsIdx] = dpoints[i][clsIdx].replace(parents+','+node,parents+','+converter[node+'/'+parents]);

          tracker[node].push(parents);
        }
      }
      else
      {
        tracker[node] = [parents];
      }
    }
  }

  for(var i=0,row;row=dpoints[i];i++)
  {
    var lineage = row[clsIdx].split(',');
    var taxon = row[0]+':0'; /* currently, we store taxon at first pos */

    latlon[row[0]] = [parseFloat(row[latIdx]),parseFloat(row[lonIdx])];
    
    for(var j=0,node;node=lineage[j];j++)
    {
      // get child and parent 
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
          if(current_parent in newick)
          {}
          else
          {
            newick[current_parent] = []
          }

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
          if(current_parent in newick)
          {
            newick[current_parent].push(taxon);
          }
          else
          {
            newick[current_parent] = [taxon];
          }
        }
      }
    }
  }
  
  /* create specific object (in CFG) to show current classification of
   * each doculect. 
   * we do this from scratch, since otherwise we cannot guarantee that this 
   * will be done correctly, correpsonding to our dictionary.
   */

  /* get the root node, forgot whether or where I stored it before ;-) */
  var root_node = '';
  var current = 1000;
  var current_key = '';
  for (key in newick) {
    var new_count = parseInt(key.split(':')[1]);
    if (new_count == 1) {
      root_node = key;
      break
    }
    else if (new_count < current) {
      current = new_count;
      current_key = key;
    }
  }
  if(root_node == ''){
    root_node = current_key;
  }
  
  console.log('root-node',root_node);

  /* make a queue and the classification */
  var queue = [root_node];
  var children = {};
  var parents = {};
  var leaves = [];
  
  while (queue.length > 0) {
    var key = queue.shift();
    
    var name = key.split(':')[0];
    var pos = key.split(':')[1];
    
    if (key in newick) {
      children[name] = [];
      for (var i=0,child; child=newick[key][i]; i++) {
        children[name].push(child.split(':')[0]);
        parents[child.split(':')[0]] = name;
        queue.push(child);
      }
    }
    else {
      children[name] = [];
      leaves.push(name);

    }
  }
  
  var cstrings = {};
  // create classification strings
  for (var i=0,l; l=leaves[i];i++) {
    var tmp = [];
    var next_node = l;
    while (true == true) {
      tmp.push(next_node);
      if (next_node in parents) {
        next_node = parents[next_node];
      }
      else {
        break;
      }
    }
    tmp.reverse();
    cstrings[l] = tmp.join(',');
  }
  
  console.log("newick",newick,"goodnodes",good_nodes);
  console.log("leaves:",leaves, "cstrings:",cstrings);
  CFG['children'] = children;
  CFG['parents'] = parents;
  CFG['classification_strings'] = cstrings;
  
  // now we transform the whole stuff into a newick string
  // this is a bit redundant, since we will then again parse it using
  // newick.js, but it is useful, since we also want to pass the newick
  // data as output, so that people can reuse it for their purpose

  var best_key = 1000;
  var rootNode = '';
  for(key in newick)
  {
    var new_key = parseInt(key.split(':')[1]);
    if(new_key > 0 && new_key < best_key)
    {
      best_key = new_key;
      rootNode = key;
    }
  }
  
  var newick_string = rootNode+';';
  var queue = [rootNode];
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
  console.log('getEthnologue-End: Newick:',newick);

console.log('geThnologue-End:latlon',latlon);

  return [newick_string,latlon,newick];
}

function get_children(node,newick,internal_nodes) {
  if (typeof internal_nodes == 'undefined') {
    internal_nodes = false;
  }

  /* find start node first  in newick stuff */
  var nodes = Object.keys(newick);
  var tmp_node = false;
  while(nodes.length > 0)
  {
    var tmp_node = nodes.shift();
    if(tmp_node.split(':')[0] == node)
    {
      break;
    }
    else
    {
      tmp_node = false;
    }
  }
  if(!tmp_node)
  {
    return [node];
  }
  
  var children = [];
  var queue = [tmp_node];

  while(queue.length > 0)
  {
    var cnode = queue.shift();
    var tmp_children = newick[cnode];
    for(var i=0,child;child=tmp_children[i];i++)
    {
      if(child.indexOf(':') != -1)
      {
        queue.push(child);
        if (internal_nodes) {
          children.push(child.split(':')[0]);
        }
      }
      else
      {
        children.push(child);
      }
    }
  }
  return children;
}


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


// Note that I took the event string to bind to out of the jQuery.ui.js file.
$('#ethnologue').bind('mousedown.ui-disableSelection selectstart.ui-disableSelection', function(event) {
      event.stopImmediatePropagation();
})


function exportNewick(event)
{
  event.preventDefault();
  
  var nwk = document.getElementById('newick_code').innerHTML;

  var blob = new Blob([nwk], {type: 'text/plain;charset=utf-8'});
  saveAs(blob, "tree.nwk");
  //console.log(get_children('Indo-European',CFG['newick_dict'],true));
}

function exportSVG(identifier)
{
  var svg = document.getElementById(identifier).firstChild;
  var svg_xml = (new XMLSerializer).serializeToString(svg);
  var blob = new Blob([svg_xml],{type:'text/svg;charset=utf-8'});
  saveAs(blob, identifier+'.svg');
}


function resizeNodes(what,bigorsmall)
{
  if(bigorsmall == 'up')
  {
    var new_node_size = CFG[what] + 0.1 * CFG[what];
    CFG[what] = new_node_size;
  }
  else
  {
    var new_node_size = CFG[what] - 0.1 * CFG[what];
    CFG[what] = new_node_size;
  }
  createTree();
}

function resizeTree(what,bigorsmall)
{
  if(bigorsmall == 'up')
  {
    if(what == 'height')
    {
      CFG['tree_height'] = parseInt(CFG['tree_height'] + 0.1 * CFG['tree_height']);
    }
    else
    {
      CFG['tree_width'] = parseInt(CFG['tree_width'] + 0.1 * CFG['tree_width']);
    }
  }
  else
  {
    if(what == 'height')
    {
      CFG['tree_height'] = parseInt(CFG['tree_height'] - 0.1 * CFG['tree_height']);
    }
    else
    {
      CFG['tree_width'] = parseInt(CFG['tree_width'] - 0.1 * CFG['tree_width']);
    }
  }
  createTree();
}


function createTree()
{
    if(!CFG['newick_object'])
    {
      var newick = Newick.parse(CFG['newick']); 
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
      CFG['newick_object'] = newick;
    }
    else
    {
      var newick = CFG['newick_object'];
    }
    
    document.getElementById('treewindow').innerHTML = '';

    /* create the phylogram of the newick tree */
    $('#treewindow').append('<div id="tree"></div>');
    
    if(CFG['tree_layout'] == 'rectangle')
    {
      d3.phylogram.build(
          "#tree", 
          newick, 
          {
            labelWidth: 120,
            font_size: CFG['tree_font_size'] + 'px',
            node_size: CFG['tree_node_size'],
            skipLabels:false,
            skipTicks:true,
            width:CFG['tree_width'],
            height: CFG['taxlen'] * CFG['tree_height'],  
            skipBranchLengthScaling: true
          });
    }
    else
    {
      d3.phylogram.buildRadial(
          "#tree", 
          newick, 
          {
            labelWidth: 120,
            font_size: CFG['tree_font_size']+'px',
            node_size: CFG['tree_node_size'],
            skipLabels:false,
            skipTicks:true,
            width:CFG['tree_width'],
            height: CFG['taxlen'] * CFG['tree_height'],  
            skipBranchLengthScaling: true
          });
    }

  
  /* reset map nodes */
  $('.mappoint').css('fill','DarkGreen').attr('r',function(d,i){return resizeMapNodes(i,'down')});
  
  /* add highlight function for node element on map and the like */
  $('.leave').on('mouseover', function(){$('#mappoint_'+this.id).css('fill','red').attr('r',function(d,i){return resizeMapNodes(i,'up');})});
  $('.leave').on('mouseout', function(){$('#mappoint_'+this.id).css('fill','DarkGreen').attr('r',function(d,i){return resizeMapNodes(i,'down');})});

  $('.inner_node').on('mouseover', function(){
    var children = get_children(this.id,CFG['newick_dict']);
    for(var i=0,child;child=children[i];i++)
    {
      $('#mappoint_'+child).css('fill','red');
      $('#mappoint_'+child).attr('r',function(d,i){return resizeMapNodes(i,'up');});
    }
  });
  $('.inner_node').on('mouseout', function(){
    var children = get_children(this.id,CFG['newick_dict']);
    for(var i=0,child;child=children[i];i++)
    {
      $('#mappoint_'+child).css('fill','DarkGreen');
      $('#mappoint_'+child).attr('r',function(d,i){return resizeMapNodes(i,'down');});
    }
  });
  
  //$('.leave').css('fill',function(d){if(CFG['taxa'].indexOf(this.id) != -1){return 'white';} else{return 'red'}});

  $('.inner_node').tipsy({gravity:'s',html:true,title: function(){return this.id;}});

  $('#tree').draggable();
  $('#tree').on('dblclick',function(event){event.preventDefault(); exportSVG('tree');});
}

/* function parses file data/doculects.tsv and stores it in an object with iso-codes as key */
function parseDoculects()
{
  var tmp = {};
  var storer = '';

  $.ajax(
    {
      async:false,
      type: "GET",
      url: 'data/doculects.tsv',
      dataType: "text",
      success: function(data) 
      {
        storer = data;
        var rows = storer.split(/\n/);
        for(var i=1,row;row=rows[i];i++)
        {
          cells = row.split('\t');
          tmp[cells[0]] = cells.slice(1,cells.length);
        }
        tmp['header'] = rows[0];
      }
    });


  DOCUL = tmp;
}
