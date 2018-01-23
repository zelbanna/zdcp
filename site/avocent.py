"""Moduledocstring.

HTML5 Ajax calls module

"""
__author__= "Zacharias El Banna"
__version__ = "17.11.01GA"
__status__= "Production"

#
#
def inventory(aWeb):
 from ..devices.avocent import Device
 counter = 0
 pdu = aWeb['ip']
 avocent = Device(pdu)
 avocent.load_snmp()
 print "<ARTICLE>"
 print aWeb.button('reload',DIV='div_content_left', SPIN='true', URL='sdcp.cgi?%s'%aWeb.get_args())
 print "<DIV CLASS=table><DIV CLASS=thead><DIV CLASS=th>PDU</DIV><DIV CLASS=th>Position</DIV><DIV CLASS=th>Device</DIV><DIV CLASS=th STYLE='width:63px;'>State</DIV></DIV>"
 print "<DIV CLASS=tbody>"
 for key in avocent.get_keys(aSortKey = lambda x: int(x.split('.')[0])*100+int(x.split('.')[1])):
  counter += 1
  value = avocent.get_entry(key)
  print "<DIV CLASS=tr><DIV CLASS=td TITLE='Open up a browser tab for {1}'><A TARGET='_blank' HREF='https://{0}:3502'>{1}</A></DIV><DIV CLASS=td>{2}</DIV>".format(avocent._ip,pdu,value['slotname']+'.'+value['unit'])
  print "<DIV CLASS=td><A CLASS=z-op DIV=div_content_right URL='sdcp.cgi?call=pdu_unit_info&pdu={0}&slot={1}&unit={2}&name={3}&slotname={4}' TITLE='Edit port info' >{3}</A></DIV><DIV CLASS=td ID=div_pdu_{5}>&nbsp;".format(pdu,value['slot'],value['unit'],value['name'], value['slotname'],counter)
  url = 'sdcp.cgi?call=pdu_op&ip=%s&slot=%s&unit=%s&id=%i&nstate={}'%(pdu,value['slot'],value['unit'],counter)
  div = 'div_pdu_%i'%counter
  if value['state'] == "off":
   print aWeb.button('start',   DIV=div, SPIN='div_content_left', URL=url.format('on'))
  else:
   print aWeb.button('shutdown',DIV=div, SPIN='div_content_left', URL=url.format('off'))
   print aWeb.button('reboot',  DIV=div, SPIN='div_content_left', URL=url.format('reboot'))
  print "</DIV></DIV>"
 print "</DIV></DIV></ARTICLE>"

#
#
def op(aWeb):
 from ..devices.avocent import Device
 avocent = Device(aWeb['ip'])
 avocent.set_state(aWeb['slot'],aWeb['unit'],aWeb['nstate'])
 # Avocent is not fast enough to execute something immediately after op, halt output then :-)
 from time import sleep
 sleep(10 if aWeb['nstate'] == 'reboot' else 4)
 url = 'sdcp.cgi?call=pdu_op&ip=%s&slot=%s&unit=%s&id=%s&nstate={}'%(aWeb['ip'],aWeb['slot'],aWeb['unit'],aWeb['id'])
 div = 'div_pdu_%s'%aWeb['id']
 print "&nbsp;"
 if avocent.get_state(aWeb['slot'],aWeb['unit'])['state'] == "off":
  print aWeb.button('start',   DIV=div, SPIN='div_content_left', URL=url.format('on'))
 else:
  print aWeb.button('shutdown',DIV=div, SPIN='div_content_left', URL=url.format('off'))
  print aWeb.button('reboot',  DIV=div, SPIN='div_content_left', URL=url.format('reboot'))

#
#
#
def info(aWeb):
 from ..devices.avocent import Device
 from ..core.dbase import DB
 id = aWeb['id']
 ip = aWeb['ip']
 with DB() as db:
  if aWeb['op'] == 'lookup':
   pdu   = Device(ip)
   slotl = pdu.get_slot_names()
   slotn = len(slotl)
   if slotn == 1:
    db.do("UPDATE pdus SET slots = 0, 0_slot_id = '{}', 0_slot_name = '{}' WHERE ip = INET_ATON('{}')".format(slotl[0][0],slotl[0][1],ip))
   elif slotn == 2:
    db.do("UPDATE pdus SET slots = 1, 0_slot_id = '{}', 0_slot_name = '{}', 1_slot_id = '{}', 1_slot_name = '{}' WHERE ip = INET_ATON('{}')".format(slotl[0][0],slotl[0][1],slotl[1][0],slotl[1][1],ip))
  elif aWeb['op'] == 'update':
   slots = aWeb.get('slots','0')
   if id == 'new':
    sql = "INSERT into pdus (name, ip, slots) VALUES ('{}',INET_ATON('{}'),'{}')".format(aWeb['name'],aWeb['ip'],slots)
    res = db.do(sql)
    id = db.get_last_id()
   else:
    sql = "UPDATE pdus SET name = '{}', ip = INET_ATON('{}'), slots = '{}' WHERE id = '{}'".format(aWeb['name'],aWeb['ip'],slots,id)
    res = db.do(sql)

  if id == 'new':
   pdudata = { 'id':'new', 'slots':0, '0_slot_name':'unknown', '0_slot_id':0, '1_slot_name':'unknown', '1_slot_id':1, 'ipasc':'127.0.0.1' if not ip else ip,'name':'new-name' if not aWeb['name'] else aWeb['name'] }
  else:
   if id:
    db.do("SELECT pdus.*, INET_NTOA(ip) as ipasc FROM pdus WHERE id = '{}'".format(id))
   else:
    db.do("SELECT pdus.*, INET_NTOA(ip) as ipasc FROM pdus WHERE ip = INET_ATON('{}')".format(ip))
   pdudata = db.get_row()

 print "<ARTICLE CLASS=info><P>PDU Device Info {}</P>".format("(new)" if id == 'new' else "")
 print "<FORM ID=pdu_info_form>"
 print "<DIV CLASS=table><DIV CLASS=tbody>"
 print "<DIV CLASS=tr><DIV CLASS=td>IP:</DIV><DIV CLASS=td><INPUT NAME=ip TYPE=TEXT VALUE='{0}'></DIV></DIV>".format(pdudata['ipasc'])
 print "<DIV CLASS=tr><DIV CLASS=td>Name:</DIV><DIV CLASS=td><INPUT NAME=name TYPE=TEXT VALUE='{0}'></DIV></DIV>".format(pdudata['name'])
 if pdudata['slots'] == 1:
  print "<DIV CLASS=tr><DIV CLASS=td>Right/Left slots:</DIV><DIV CLASS=td><INPUT TYPE=checkbox NAME=slots VALUE=1 checked=checked></DIV></DIV>"
  print "<DIV CLASS=tr><DIV CLASS=td>Slot 1 Name:</DIV><DIV CLASS=td>{}</DIV></DIV>".format(pdudata['0_slot_name'])
  print "<DIV CLASS=tr><DIV CLASS=td>Slot 1 ID:</DIV><DIV CLASS=td>{}</DIV></DIV>".format(pdudata['0_slot_id'])
  print "<DIV CLASS=tr><DIV CLASS=td>Slot 2 Name:</DIV><DIV CLASS=td>{}</DIV></DIV>".format(pdudata['1_slot_name'])
  print "<DIV CLASS=tr><DIV CLASS=td>Slot 2 ID:</DIV><DIV CLASS=td>{}</DIV></DIV>".format(pdudata['1_slot_id'])
 else:
  print "<DIV CLASS=tr><DIV CLASS=td>Right/Left slots:</DIV><DIV CLASS=td><INPUT TYPE=checkbox NAME=slots VALUE=1></DIV></DIV>"
  print "<DIV CLASS=tr><DIV CLASS=td>Slot 1 Name:</DIV><DIV CLASS=td>{}</DIV></DIV>".format(pdudata['0_slot_name'])
  print "<DIV CLASS=tr><DIV CLASS=td>Slot 1 ID:</DIV><DIV CLASS=td>{}</DIV></DIV>".format(pdudata['0_slot_id'])

 print "</DIV></DIV>"
 if not id == 'new':
  print aWeb.button('reload',DIV='div_content_right', URL='sdcp.cgi?call=pdu_info&id=%s'%id)
  print aWeb.button('delete',DIV='div_content_right', URL='sdcp.cgi?call=pdu_remove&id=%s'%id)
  print aWeb.button('search',DIV='div_content_right', URL='sdcp.cgi?call=pdu_info&id=%s&op=lookup&ip=%s'%(id,pdudata['ipasc']), TITLE='Fetch info')
 print aWeb.button('save',  DIV='div_content_right', URL='sdcp.cgi?call=pdu_info&id=%s&op=update'%id, TITLE='Fetch info', FRM='pdu_info_form')
 print "</FORM>"
 print "</ARTICLE>"

####################################### Device Operations #########################################
#
#
def unit_info(aWeb):
 from ..devices.avocent import Device
 if aWeb['op'] == 'update':
  avocent = Device(aWeb['pdu'])
  avocent.set_name(aWeb['slot'],aWeb['unit'],aWeb['name'])
  print "Updated name: {} for {} slot {}".format(aWeb['name'],aWeb['pdu'],aWeb['slot'])
  return
 print "<ARTICLE CLASS=info><P>PDU Unit Info</P>"
 print "<FORM ID=pdu_form>"
 print "<INPUT NAME=slot   VALUE={} TYPE=HIDDEN>".format(aWeb['slot'])
 print "<INPUT NAME=unit   VALUE={} TYPE=HIDDEN>".format(aWeb['unit'])
 print "<INPUT NAME=pdu    VALUE={} TYPE=HIDDEN>".format(aWeb['pdu'])
 print "<DIV CLASS=table><DIV CLASS=tbody>"
 print "<DIV CLASS=tr><DIV CLASS=td>PDU:</DIV><DIV CLASS=td>{0}</DIV></DIV>".format(aWeb['pdu'])
 print "<DIV CLASS=tr><DIV CLASS=td>Slot.Unit:</DIV><DIV CLASS=td>{0}.{1}</DIV></DIV>".format(aWeb['slotname'],aWeb['unit'])
 print "<DIV CLASS=tr><DIV CLASS=td>Name:</DIV><DIV CLASS=td><INPUT NAME=name TYPE=TEXT PLACEHOLDER='{0}'></DIV></DIV>".format(aWeb['name'])
 print "</DIV></DIV>"
 print aWeb.button('save',DIV='update_results', URL='sdcp.cgi?call=pdu_unit_info&op=update', FRM='pdu_form')
 print "<SPAN CLASS='results' ID=update_results></SPAN>"
 print "</FORM>"
 print "</ARTICLE>"