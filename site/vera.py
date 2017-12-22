"""Module docstring.

HTML5 Ajax Vera Z-wave controller calls module

"""
__author__= "Zacharias El Banna"
__version__ = "17.11.01GA"
__status__ = "Production"

########################################## ESXi Operations ##########################################
#
#
#
def inventory(aWeb):
 if aWeb['ip']:
  ip = aWeb['ip']
 else:
  from sdcp.rest.device import info as rest_info
  data = rest_info({'id':id})
  ip = data['ip']
 print "<NAV><UL>"
 print "<LI CLASS=warning><A CLASS=z-op DIV=div_content MSG='Really shut down?' URL='sdcp.cgi?call=vera_op&nstate=poweroff&ip=%s'>Shutdown</A></LI>"%(ip)
 print "<LI><A CLASS=z-op DIV=div_content URL=sdcp.cgi?call=vera_status&ip=%s>Status</A></LI>"%ip
 print "<LI><A CLASS=z-op DIV=div_content URL=sdcp.cgi?call=vera_devices&ip=%s>Devices</A></LI>"%ip
 print "<LI><A CLASS=z-op DIV=div_content URL=sdcp.cgi?call=vera_rooms&ip=%s>Rooms</A></LI>"%ip
 print "<LI><A CLASS='z-op reload' DIV=main URL='sdcp.cgi?%s'></A></LI>"%(aWeb.get_args())
 print "<LI CLASS='right navinfo'><A CLASS=z-op TARGET=_blank HREF='http://%s/cmh/'>UI</A></LI>"%(ip)
 print "<LI CLASS='right'><A CLASS=z-op DIV=div_content URL=sdcp.cgi?call=vera_rest_main&ip=%s>REST</A></LI>"%ip
 print "</UL></NAV>"
 print "<SECTION CLASS=content ID=div_content></SECTION>"

#
#
def rest_main(aWeb):
 print "<ARTICLE><P>REST API inspection</P>"
 print "<FORM ID=frm_vera_rest><INPUT TYPE=hidden NAME=vera_host VALUE='%s'>"%aWeb['ip']
 print "Enter API: <INPUT CLASS='white' STYLE='width:500px;' TYPE=TEXT NAME=vera_api><BR>"
 print "Call 'Method': <SELECT STYLE='width:70px; height:22px;' NAME=vera_method>"
 for method in ['GET','POST','DELETE','PUT']:
  print "<OPTION VALUE={0}>{0}</OPTION>".format(method)
 print "</SELECT>"
 print aWeb.button('start',  DIV='div_rest_info', URL='sdcp.cgi?call=vera_rest_execute', FRM='frm_vera_rest')
 print aWeb.button('remove', DIV='div_rest_info', OP='empty', TITLE='Clear results view')
 print "<BR>Arguments/Body<BR><TEXTAREA STYLE='width:100%; height:100px;' NAME=vera_args></TEXTAREA>"
 print "</FORM>"
 print "</ARTICLE>"
 print "<DIV ID=div_rest_info></DIV>"

#
#
def rest_execute(aWeb):
 from sdcp.rest.vera import execute as rest_execute
 from json import loads,dumps
 try:    arguments = loads(aWeb['vera_args'])
 except: arguments = None
 print "<ARTICLE CLASS=info STYLE='width:auto; overflow:auto'><DIV CLASS='border'>"
 try:
  ret = rest_execute({'ip':aWeb['vera_host'], 'api':aWeb['vera_api'],'args':arguments,'method':aWeb['vera_method']})
  print "<PRE CLASS='white'>%s</PRE>"%dumps(ret,indent=4, sort_keys=True)
 except Exception as e:
  print "<DIV CLASS=table style='width:auto'><DIV CLASS=tbody>"
  for key,value in e[0].iteritems():
   print "<DIV CLASS=tr><DIV CLASS=td>%s</DIV><DIV CLASS=td>%s</DIV></DIV>"%(key.upper(),value)
  print "</DIV></DIV>"
 print "</DIV></ARTICLE>"

#
#
def status(aWeb):
 from sdcp.rest.vera import status as rest_status
 data = rest_status({'ip':aWeb['ip']})
 print "<ARTICLE>"
 print "<DIV CLASS=table style='width:auto'><DIV CLASS=thead><DIV CLASS=th>Key</DIV><DIV CLASS=th>Value</DIV></DIV>"
 print "<DIV CLASS=tbody>"
 for key,value in data.iteritems():
  print "<DIV CLASS=tr><DIV CLASS=td>%s</DIV><DIV CLASS=td>%s</DIV></DIV>"%(key,value)
 print "</DIV></DIV></ARTICLE>"

#
#
def devices(aWeb):
 from sdcp.rest.vera import status as rest_status
 ip   = aWeb.get('ip')
 data = rest_status({'ip':ip})
 devs = data['devices']
 cats = { d['id']: d['name'] for d in data['categories'] }
 rooms= { d['id']: d['name'] for d in data['rooms'] }
 print "<SECTION CLASS=content-left ID=div_content_left>"
 print "<ARTICLE>"
 print "<DIV CLASS=table>"
 print "<DIV CLASS=thead><DIV CLASS=th>ID</DIV><DIV CLASS=th>Name</DIV><DIV CLASS=th>Type</DIV><DIV CLASS=th>Room</DIV></DIV>"
 print "<DIV CLASS=tbody>"
 for dev in devs:
   print "<DIV CLASS=tr><!-- %s -->"%(dev.keys())
   print "<DIV CLASS=td>%s</DIV>"%dev['id']
   print "<DIV CLASS=td><A CLASS=z-op DIV=div_content_right URL=sdcp.cgi?call=vera_device_info&ip=%s&id=%s>%s</A></DIV>"%(ip,dev['id'],dev['name'])
   print "<DIV CLASS=td>%s</DIV><DIV CLASS=td>%s</DIV>"%(cats.get(dev['category']),rooms.get(dev['room'],'Unassigned'))
   print "</DIV>"
 print "</DIV></DIV></ARTICLE></SECTION>"
 print "<SECTION CLASS=content-right ID=div_content_right></SECTION>"

def device_info(aWeb):
 from sdcp.rest.vera import dev_info as rest_dev_info
 ip,id = aWeb.get('ip'), aWeb['id']
 data  = rest_dev_info({'ip':ip,'id':id})
 dev   = data['Device_Num_%s'%id]
 print "<ARTICLE>"
 print "<DIV CLASS=title>Device %s</DIV>"%id
 print "<DIV>%s</DIV>"%dev.keys()
 print "<DIV CLASS=table>"
 print "<DIV CLASS=thead><DIV CLASS=th>ID</DIV><DIV CLASS=th>Variable</DIV><DIV CLASS=th>Service</DIV><DIV CLASS=th>Value</DIV></DIV>"
 print "<DIV CLASS=tbody>"
 for row in dev['states']:
  print "<DIV CLASS=tr><DIV CLASS=td>%s</DIV><DIV CLASS=td>%s</DIV><DIV CLASS=td>%s</DIV><DIV CLASS=td>%s</DIV></DIV>"%(row['id'],row['variable'],row['service'],row['value'])
 print "</DIV></DIV></ARTICLE>"

############################################### To Do ##############################################
#
#
def rooms(aWeb):
 from sdcp.devices.vera import Device
 ip   = aWeb.get('ip')
 ctrl = Device(ip)
 res  = ctrl.call(3480,"id=sdata")
 print "<SECTION CLASS=content-left ID=div_content_left>"
 print "<ARTICLE>"
 print "<DIV CLASS=table><DIV CLASS=thead><DIV CLASS=th>ID</DIV><DIV CLASS=th>Name</DIV><DIV CLASS=th>Section</DIV></DIV><DIV CLASS=tbody>"
 for room in res['data']['rooms']:
  print "<DIV CLASS=tr><DIV CLASS=td>%s</DIV>"%room['id']
  print "<DIV CLASS=td><A CLASS=z-op DIV=div_content_right URL=sdcp.cgi?call=vera_room_info&ip=%s&id=%s>%s</A></DIV>"%(ip,room['id'],room['name'])
  print "<DIV CLASS=td>%s</DIV></DIV>"%(room['section'])
 print "</DIV></DIV></ARTICLE></SECTION>"
 print "<SECTION CLASS=content-right ID=div_content_right></SECTION>"