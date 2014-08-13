var newick = Newick.parse("(((German,Dutch),English)East_Germanic,(Swedish,(Norwegian,Danish))Scandinavian);");
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

$('#treewindow').append('<div id="tree"></div>');
d3.phylogram.build("#tree", newick, {skipLabels:false,skipTicks:true,width:400,height:400,skipBranchLengthScaling: true});
