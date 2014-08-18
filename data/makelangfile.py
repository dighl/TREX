# author   : Johann-Mattis List
# email    : mattis.list@uni-marburg.de
# created  : 2014-08-18 19:26
# modified : 2014-08-18 19:26
"""
<++>
"""

__author__="Johann-Mattis List"
__date__="2014-08-18"

from lingpy import *
from lingpy.read.csv import read_asjp

# load asjp file
asjp = csv2list('listss16_formatted.tsv')


asjpd = {}
f = open('doculects.tsv','w')
f.write("ISO\tNAME\tLAT\tLON\tETHNOLOGUE\tGLOTTOLOG\n")
check = 0

f2 = open('testwithso.tsv','w')
f2.write('NAME\tISO\n');
# now get indices for ethnologue and t
for line in asjp[1:]:

    name = line[0]
    el = line[3]
    hh = line[4]
    lat,lon = line[5],line[6]
    iso = line[9]

    if iso in asjpd or not iso or (not lat and not lon):
        print('skipping iso {0}...'.format(iso))
        check += 1
    else:
        asjpd[iso] = 1
        f.write('\t'.join([iso,name,lat,lon,el,hh])+'\n')

        if 'Slavic' in el:
            f2.write(name+'\t'+iso+'\n')

f.close()
f2.close()
print('skipped {0} doculects from listss16'.format(check))

