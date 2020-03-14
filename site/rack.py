"""HTML5 Ajax Racks module"""
__author__= "Zacharias El Banna"

################################################## Basic Rack Info ######################################################

def main(aWeb):
 aWeb.wr("<NAV><UL>&nbsp;</UL></NAV>")
 aWeb.wr("<SECTION CLASS=content ID=div_content><SECTION CLASS=content-left ID=div_content_left>")
 list(aWeb)
 aWeb.wr("</SECTION><SECTION CLASS=content-right ID=div_content_right></SECTION></SECTION>")

#
#
def list(aWeb):
 racks = aWeb.rest_call("rack/list",{"sort":"name"})['data']
 aWeb.wr("<ARTICLE><P>Racks</P>")
 aWeb.wr(aWeb.button('reload',DIV='div_content_left',URL='rack_list'))
 aWeb.wr(aWeb.button('add',DIV='div_content_right',URL='rack_info?id=new'))
 aWeb.wr("<DIV CLASS=table><DIV CLASS=thead><DIV>Location</DIV><DIV>Name</DIV><DIV>Size</DIV><DIV>&nbsp;</DIV></DIV><DIV CLASS=tbody>")
 for unit in racks:
  aWeb.wr("<DIV><DIV>%(location)s</DIV><DIV>%(name)s</DIV><DIV>%(size)s</DIV><DIV>"%unit)
  aWeb.wr(aWeb.button('edit', DIV='div_content_right', URL='rack_info?id=%s'%unit['id']))
  aWeb.wr(aWeb.button('show', DIV='main',              URL='device_main?rack=%s'%unit['id'],TITLE='Rack inventory'))
  aWeb.wr("</DIV></DIV>")
 aWeb.wr("</DIV></DIV></ARTICLE>")

#
def list_infra(aWeb):
 type = aWeb['type']
 devices = aWeb.rest_call("device/list",{'field':'base','search':type,'extra':['type']})['data']
 aWeb.wr("<ARTICLE><P>%ss</P>"%type.title())
 aWeb.wr(aWeb.button('reload',DIV='div_content_left', URL='rack_list_infra?type=%s'%type))
 aWeb.wr("<DIV CLASS=table><DIV CLASS=thead><DIV>ID</DIV><DIV>Name</DIV><DIV>&nbsp;</DIV></DIV><DIV CLASS=tbody>")
 for dev in devices:
  aWeb.wr("<DIV><DIV><A CLASS=z-op DIV=div_content_right URL='device_info?id=%s'>%s</DIV><DIV><A CLASS=z-op DIV=div_content_left URL='%s_inventory?ip=%s'>%s</A></DIV><DIV>"%(dev['id'],dev['id'],dev['type_name'],dev['ip'],dev['hostname']))
  aWeb.wr(aWeb.button('info',DIV='main',URL='%s_manage?id=%s&ip=%s&hostname=%s'%(dev['type_name'],dev['id'],dev['ip'],dev['hostname'])))
  if dev.get('url'):
   aWeb.wr(aWeb.button('ui', HREF=dev['url'], TARGET='_blank', TITLE='UI'))
  aWeb.wr("</DIV></DIV>")
 aWeb.wr("</DIV></DIV></ARTICLE>")

#
#
def inventory(aWeb):
 data = aWeb.rest_call("rack/devices",{"id":aWeb['rack']})
 size = data['size']
 aWeb.wr("<DIV STYLE='display:grid; justify-items:stretch; align-items:stretch; margin:10px; grid: repeat({}, 20px)/20px 220px 20px 20px 20px 220px 20px;'>".format(size))
 # Create rack and some text, then place devs
 aWeb.wr("<DIV STYLE='grid-column:1/4; grid-row:1; justify-self:center; font-weight:bold; font-size:14px;'>Front</DIV>")
 aWeb.wr("<DIV STYLE='grid-column:5/8; grid-row:1; justify-self:center; font-weight:bold; font-size:14px;'>Back</DIV>")
 for idx in range(2,size+2):
  ru = size-idx+2
  aWeb.wr("<DIV CLASS=rack-indx STYLE='grid-column:1; grid-row:%i; border-right:1px solid grey'>%i</DIV>"%(idx,ru))
  aWeb.wr("<DIV CLASS=rack-indx STYLE='grid-column:3; grid-row:%i;  border-left:1px solid grey'>%i</DIV>"%(idx,ru))
  aWeb.wr("<DIV CLASS=rack-indx STYLE='grid-column:5; grid-row:%i; border-right:1px solid grey'>%i</DIV>"%(idx,ru))
  aWeb.wr("<DIV CLASS=rack-indx STYLE='grid-column:7; grid-row:%i;  border-left:1px solid grey'>%i</DIV>"%(idx,ru))

 for dev in data['devices']:
  if dev['rack_unit'] == 0:
   continue
  rowstart = size-abs(dev['rack_unit'])+2
  rowend   = rowstart + dev['rack_size']
  col = "2" if dev['rack_unit'] > 0 else "6"
  aWeb.wr("<DIV CLASS='rack-data centered green' STYLE='grid-column:{0}; grid-row:{1}/{2};'>".format(col,rowstart,rowend))
  aWeb.wr("<A CLASS='z-op' TITLE='Show device info for {0}' DIV='div_content_right' URL='device_info?id={1}'>{0}</A></CENTER>".format(dev['hostname'],dev['id']))
  aWeb.wr("</DIV>")
 aWeb.wr("</DIV>")

#
#
def info(aWeb):
 args = aWeb.args()
 res  = aWeb.rest_call("rack/info",args)
 info = res['data']
 aWeb.wr("<ARTICLE CLASS=info><P>Rack Info (%s)</P>"%(info['id']))
 aWeb.wr("<FORM ID=rack_info_form>")
 aWeb.wr("<INPUT TYPE=HIDDEN NAME=id VALUE={}>".format(info['id']))
 aWeb.wr("<DIV CLASS='info col2'>")
 aWeb.wr("<label for='name'>Name:</label><INPUT id='name' NAME=name TYPE=TEXT VALUE='%s'>"%(info['name']))
 aWeb.wr("<label for='size'>Size:</label><INPUT id='size' NAME=size TYPE=TEXT VALUE='%s'>"%(info['size']))
 aWeb.wr("<label for='console'>Console:</label><SELECT id='console' NAME=console>")
 for unit in res['consoles']:
  extra = " selected" if (info['console'] == unit['id']) or (not info['console'] and unit['id'] == 'NULL') else ""
  aWeb.wr("<OPTION VALUE={0} {1}>{2}</OPTION>".format(unit['id'],extra,unit['hostname']))
 aWeb.wr("</SELECT>")
 aWeb.wr("<label for='location_id'>Location:</label><SELECT id='location_id' NAME=location_id>")
 for unit in res['locations']:
  extra = " selected" if (info['location_id'] == unit['id']) or (not info['location_id'] and unit['id'] == 'NULL') else ""
  aWeb.wr("<OPTION VALUE={0} {1}>{2}</OPTION>".format(unit['id'],extra,unit['name']))
 aWeb.wr("</SELECT>")
 for key in ['pdu_1','pdu_2']:
  aWeb.wr("<label for='%s'>%s:</label><SELECT id='%s' NAME=%s>"%(key,key.capitalize(),key,key))
  for unit in res['pdus']:
   extra = " selected" if (info[key] == unit['id']) or (not info[key] and unit['id'] == 'NULL') else ""
   aWeb.wr("<OPTION VALUE={0} {1}>{2}</OPTION>".format(unit['id'],extra,unit['hostname']))
  aWeb.wr("</SELECT>")
 aWeb.wr("</DIV>")
 aWeb.wr("<SPAN CLASS='right' ID=update_results></SPAN>")
 aWeb.wr("</FORM>")
 aWeb.wr(aWeb.button('reload',DIV='div_content_right', URL='rack_info?id={0}'.format(info['id'])))
 aWeb.wr(aWeb.button('save', DIV='div_content_right', URL='rack_info?op=update', FRM='rack_info_form'))
 if not id == 'new':
  aWeb.wr(aWeb.button('trash',DIV='div_content_right',URL='rack_delete?id=%s'%(info['id'])))
 aWeb.wr("</ARTICLE>")

#
#
def delete(aWeb):
 res = aWeb.rest_call("rack/delete",{'id':aWeb['id']})
 aWeb.wr("<ARTICLE>Rack %s deleted (%s)</ARTICLE>"%(aWeb['id'],res))
