"""Module docstring.

Ajax DNS calls module

"""
__author__= "Zacharias El Banna"
__version__ = "17.10.4"
__status__= "Production"

import sdcp.PackageContainer as PC
from sdcp.core.dbase import DB
from sdcp.core.rest import call as rest_call

#
#
#
def load(aWeb):
 dns_domains  = rest_call(PC.dns['url'], "sdcp.rest.{}_domains".format(PC.dns['type']))
 print "<DIV CLASS=z-frame>"
 with DB() as db:
  db.do("SELECT id,name FROM domains")
  sdcp_domains = db.get_rows_dict('id')
  for dom in dns_domains:
   add = sdcp_domains.pop(dom['id'],None)
   if not add:
    print "Added: {}".format(dom)
   db.do("INSERT INTO domains(id,name) VALUES ({0},'{1}') ON DUPLICATE KEY UPDATE name='{1}'".format(dom['id'],dom['name']))
  print "<SPAN>Domains - Inserted:{}, Remaining old:{}</SPAN><BR>".format(len(dns_domains),len(sdcp_domains))
  for dom,entry in sdcp_domains.iteritems():
   print "Delete {} -> {}<BR>".format(dom,entry)
   db.do("DELETE FROM domains WHERE id = '{}'".format(dom))
  db.commit()
 print "</DIV>"

#
#
#
def discrepancy(aWeb):
 print "<DIV CLASS=Z-frame>"
 for type in ['a','ptr']:
  dns = rest_call(PC.dns['url'],"sdcp.rest.{}_get_records".format(PC.dns['type']),{'type':type})
  tid = "{}_id".format(type)
  with DB() as db:
   db.do("SELECT devices.id, ip, INET_NTOA(ip) as ipasc, {0}_id, CONCAT(hostname,'.',name) as fqdn FROM devices LEFT JOIN domains ON devices.a_dom_id = domains.id ORDER BY ip".format(type))
   devs = db.get_rows_dict("ipasc" if type == 'a' else "fqdn")
  print "<DIV CLASS=title>{0} Consistency</DIV><SPAN ID=span_dns STYLE='font-size:9px;'>&nbsp;</SPAN>".format(type.upper())
  print "<DIV CLASS=z-table STYLE='width:auto;'><DIV CLASS=thead><DIV CLASS=th>Content</DIV><DIV CLASS=th>Type</DIV><DIV CLASS=th>Name</DIV><DIV CLASS=th>Id</DIV><DIV CLASS=th>Id (Dev)</DIV><DIV CLASS=th>Hostname (Dev)</DIV></DIV><DIV CLASS=tbody>"
  for rec in dns['records']:
   dev = devs.pop(rec['content'],None)
   if not dev or dev[tid] != rec['id']:
    print "<DIV CLASS=tr>"
    print "<!-- {} --> ".format(rec)
    print "<DIV CLASS=td>{}</DIV>".format(rec['content'])
    print "<DIV CLASS=td>{}</DIV>".format(rec['type'])
    print "<DIV CLASS=td>{}</DIV>".format(rec['name'])
    print "<DIV CLASS=td>{}</DIV>".format(rec['id'])
    if dev:
     print "<DIV CLASS=td>{}</DIV>".format(dev[tid])
     print "<DIV CLASS=td>{0}</DIV>".format(dev['fqdn'])
    else:
     print "<DIV CLASS=td>&nbsp</DIV><DIV CLASS=td>&nbsp</DIV>"
    print "<DIV CLASS=td>&nbsp;"
    print "<A CLASS='z-op z-btn z-small-btn' DIV=span_dns MSG='Are you sure?' URL='sdcp.cgi?call=dns_remove&type={}&id={}'><IMG SRC=images/btn-remove.png></A>".format(type,rec['id'])
    print "</DIV>"
    print "</DIV>"
  print "</DIV></DIV>"
  if len(devs) > 0:
   print "<DIV CLASS=title>Extra only in SDCP ({})</DIV>".format(len(devs))
   print "<DIV CLASS=z-table STYLE='width:auto;'><DIV CLASS=thead><DIV CLASS=th>IP</DIV><DIV CLASS=th>Name</DIV><DIV CLASS=th>&nbsp;</DIV></DIV><DIV CLASS=tbody>"
   for key,value in  devs.iteritems():
    print "<DIV CLASS=tr>"
    print "<DIV CLASS=td>{}</DIV><DIV CLASS=td><A CLASS=z-op DIV=div_content_right URL=sdcp.cgi?call=device_info&id={}>{}</A></DIV><DIV CLASS=td>".format(key,value['id'],value['fqdn'])
    print "&nbsp;</DIV>"
    print "</DIV>"
  print "</DIV></DIV>"
 print "</DIV>"


#
# DNS top
#
def top(aWeb):
 import sdcp.core.extras as EXT
 dnstop = rest_call(PC.dns['url'], "sdcp.rest.{}_top".format(PC.dns['type']), {'count':20})
 print "<DIV CLASS=z-frame STYLE='float:left; width:49%;'><DIV CLASS=title>Top looked up FQDN</DIV>"
 EXT.dict2table(dnstop['top'])
 print "</DIV>"
 print "<DIV CLASS=z-frame STYLE='float:left; width:49%;'><DIV CLASS=title>Top looked up FQDN per Client</DIV>"
 EXT.dict2table(dnstop['who'])
 print "</DIV>"

#
# Cleanup duplicate entries
#
def cleanup(aWeb):
 dnsclean = rest_call(PC.dns['url'], "sdcp.rest.{}_cleanup".format(PC.dns['type']))
 print "<DIV CLASS=z-frame><DIV CLASS=title>Cleanup</DIV>"
 xist = len(dnsclean['removed'])
 if xist > 0:
  import sdcp.core.extras as EXT
  EXT.dict2table(dnsclean['removed'])
 print "</DIV>"

#
# Remove from DNS DB
#
def remove(aWeb):
 id   = aWeb.get_value('id')
 type = aWeb.get_value('type') 
 res = rest_call(PC.dns['url'],"sdcp.rest.{}_remove".format(PC.dns['type']),{"{}_id".format(type):id})
 print "Remove {} - Results:{}".format(id,res)