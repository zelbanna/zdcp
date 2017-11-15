"""Module docstring.

Ajax Openstack HEAT calls module

- left and right divs frames (div_content_left/right) needs to be created by ajax call
"""
__author__= "Zacharias El Banna"
__version__ = "17.11.01GA"
__status__= "Production"

from sdcp.devices.openstack import OpenstackRPC
from sdcp.site.openstack import dict2html

##################################### Heatstack ##################################
#
def list(aWeb):
 cookie = aWeb.cookie
 token  = cookie.get('os_user_token')
 if not token:
  print "Not logged in"
  return
 controller = OpenstackRPC(cookie.get('os_controller'),token)

 port  = cookie.get('os_heat_port')
 url   = cookie.get('os_heat_url')
 name = aWeb['name']
 id   = aWeb['id']
 op   = aWeb.get('op','info')

 ret = controller.call(cookie.get('os_heat_port'),cookie.get('os_heat_url') + "/stacks") 
 if not ret['result'] == "OK":
  print "Error retrieving heat stacks ({})".format(ret['code'])
  return

 print "<DIV CLASS=z-content-left ID=div_content_left><DIV CLASS=z-frame style='width:394px;'>"
 print "<DIV CLASS=title>Heat Stacks</DIV>"
 print aWeb.button('reload',DIV='div_content',URL='sdcp.cgi?call=heat_list')
 print aWeb.button('add',   DIV='div_content_right',URL='sdcp.cgi?call=heat_choose_template')
 print "<DIV CLASS=z-table>"
 print "<DIV CLASS=thead><DIV CLASS=th>Name</DIV><DIV CLASS=th>Status</DIV><DIV CLASS=th style='width:94px;'>&nbsp;</DIV></DIV>"
 print "<DIV CLASS=tbody>"
 for stack in ret['data'].get('stacks',None):
  print "<DIV CLASS=tr>"
  print "<DIV CLASS=td>{}</DIV>".format(stack['stack_name'])
  print "<DIV CLASS=td>{}</DIV>".format(stack['stack_status'])
  print "<DIV CLASS=td>"
  print aWeb.button('info',DIV='div_content_right', SPIN='true', URL='sdcp.cgi?call=heat_action&name=%s&id=%s&op=info'%(stack['stack_name'],stack['id']))
  if stack['stack_status'] == "CREATE_COMPLETE" or stack['stack_status'] == "CREATE_FAILED" or stack['stack_status'] == "DELETE_FAILED":
   print aWeb.button('delete', DIV='div_content_right', SPIN='true', URL='sdcp.cgi?call=heat_action&name=%s&id=%s&op=remove'%(stack['stack_name'],stack['id']), MSG='Are you sure?')
  print "&nbsp;</DIV></DIV>"
 print "</DIV>"
 print "</DIV></DIV></DIV>"
 print "<DIV CLASS=z-content-right ID=div_content_right></DIV>"

######################### HEAT ADD ######################
#
# Add instantiation
#
def choose_template(aWeb):
 print "<DIV CLASS='z-frame' style='display:inline-block; padding:6px'>"
 print "<FORM ID=frm_heat_choose_template>"
 try:
  print "Add solution from template:<SELECT NAME=template style='border: none; overflow: visible; background-color: transparent; height:22px; width:auto;'>"
  from os import listdir
  for file in listdir("os_templates/"):
   name,_,suffix = file.partition('.')
   if suffix == 'tmpl.json':
    print "<OPTION VALUE={}>{}</OPTION>".format(file,name)
  print "</SELECT>"
 except Exception as err:
  print "openstack_choose_template: error finding template files in 'os_templates/' [{}]".format(str(err))
 print "</FORM>"
 print aWeb.button('document', DIV='div_os_info', URL='sdcp.cgi?call=heat_enter_parameters',   FRM='frm_heat_choose_template', TITLE='Enter parameters')
 print aWeb.button('info', DIV='div_os_info', URL='sdcp.cgi?call=heat_action&op=templateview', FRM='frm_heat_choose_template', TITLE='View Template')
 print "<BR><DIV ID=div_os_info></DIV>"
 print "</DIV>"

def enter_parameters(aWeb):
 from json import load,dumps
 template = aWeb['template']
 with open("os_templates/"+template) as f:
  data = load(f)
 print "<FORM ID=frm_heat_template_parameters>"
 print "<INPUT TYPE=hidden NAME=template VALUE={}>".format(template)
 print "<DIV CLASS=z-table>"
 print "<DIV CLASS=thead><DIV CLASS=th>Parameter</DIV><DIV CLASS=th style='min-width:300px'>Value</DIV></DIV>"
 print "<DIV CLASS=tbody>"
 print "<DIV CLASS=tr><DIV CLASS=td><B>Unique Name</B></DIV><DIV CLASS=td><INPUT TYPE=text NAME=name PLACEHOLDER='change-this-name'></DIV></DIV>"
 for key,value in data['parameters'].iteritems():
  print "<DIV CLASS=tr><DIV CLASS=td>{0}</DIV><DIV CLASS=td><INPUT TYPE=TEXT NAME=param_{0} PLACEHOLDER={1}></DIV></DIV>".format(key,value)
 print "</DIV></DIV>"
 print "</FORM>"
 print aWeb.button('next',DIV='div_content_right', URL='sdcp.cgi?call=heat_action&op=create',FRM='frm_heat_template_parameters', SPIN='true')

#
# Heat Actions
#
def action(aWeb):
 cookie = aWeb.cookie
 token  = cookie.get('os_user_token')
 if not token:
  print "Not logged in"
  return
 controller = OpenstackRPC(cookie.get('os_controller'),token)

 port = cookie.get('os_heat_port')
 url  = cookie.get('os_heat_url')
 name = aWeb['name']
 id   = aWeb['id']
 op   = aWeb.get('op','info')

 aWeb.log("heat_action - project:{} id:{} name:{} op:{}".format(id,cookie.get('os_project_name'),name,op))

 if   op == 'info':
  tmpl = "<A TITLE='{}' CLASS='z-btn z-op' DIV=div_os_info URL=sdcp.cgi?call=heat_action&name=%s&id=%s&op={} SPIN=true>{}</A>"%(name,id)
  print "<DIV>"
  print tmpl.format('Stack Details','details','Stack Details')
  print tmpl.format('Stack Parameters','events','Events')
  print tmpl.format('Stack Template','template','Template')
  print tmpl.format('Stack Parameters','parameters','Parameters')
  print "</DIV>"
  ret = controller.call(port,url + "/stacks/{}/{}".format(name,id))
  print "<DIV CLASS=z-frame style='overflow:auto;' ID=div_os_info>"
  dict2html(ret['data']['stack'],name)
  print "</DIV>"

 elif op == 'details':
  ret = controller.call(port,url + "/stacks/{}/{}".format(name,id))
  dict2html(ret['data']['stack'],name)

 elif op == 'events':
  from json import dumps
  ret = controller.call(port,url + "/stacks/{}/{}/events".format(name,id))
  print "<!-- {} -->".format("/stacks/{}/{}/events".format(name,id) )
  print "<DIV CLASS=z-table>"
  print "<DIV CLASS=thead><DIV CLASS=th>Time</DIV><DIV CLASS=th>Resource</DIV><DIV CLASS=th>Id</DIV><DIV CLASS=th>Status</DIV><DIV CLASS=th>Reason</DIV></DIV>"
  print "<DIV CLASS=tbody>"
  for event in ret['data']['events']:
   print "<DIV CLASS=tr><DIV CLASS=td>{}</DIV><DIV CLASS=td>{}</DIV><DIV CLASS=td>{}</DIV><DIV CLASS=td>{}</DIV><DIV CLASS=td>{}</DIV></DIV>".format(event['event_time'].replace("T"," "),event['resource_name'],event['physical_resource_id'],event['resource_status'],event['resource_status_reason'])
  print "</DIV>"
  print "</DIV>"

 elif op == 'template':
  from json import dumps
  ret = controller.call(port,url + "/stacks/{}/{}/template".format(name,id))
  print "<PRE>" + dumps(ret['data'], indent=4) + "</PRE>"

 elif op == 'parameters':
  from json import dumps
  ret = controller.call(port,url + "/stacks/{}/{}".format(name,id))
  data = ret['data']['stack']['parameters']
  data.pop('OS::project_id')
  data.pop('OS::stack_name')
  data.pop('OS::stack_id')
  print "<PRE>" + dumps(data, indent=4) + "</PRE>"

 elif op == 'create':
  template = aWeb['template']
  print "<DIV CLASS='z-frame'>"
  if name and template:
   from json import load,dumps
   with open("os_templates/"+template) as f:
    data = load(f)
   data['stack_name'] = name
   params  = aWeb.get_args2dict_except(['op','call','template','name'])
   for key,value in params.iteritems():
    data['parameters'][key[6:]] = value
   ret = controller.call(port,url + "/stacks",args=data)
   if ret['code'] == 201:
    print "<H2>Starting instantiation of '{}' solution</H2>".format(template.partition('.')[0])
    print "Name: {}<BR>Id:{}".format(name,ret['data']['stack']['id'])
   else:
    print "<PRE>Error instantiating stack:" + str(ret) + "</PRE>"
  else:
   print "Error - need to provide a name for the instantiation"
  print "</DIV>"

 elif op == 'remove':
  ret = controller.call(port,url + "/stacks/{}/{}".format(name,id), method='DELETE')
  print "<DIV CLASS='z-frame'>"
  print "<H3>Removing {}</H3>".format(name)
  if ret['code'] == 204:
   print "Removing stack"
  else:
   print "Error code: {}".format(ret['code'])
  print "</DIV>"

 if op == 'templateview':
  template = aWeb['template']
  from json import load,dumps
  with open("os_templates/"+template) as f:
   data = load(f)
  data['stack_name'] = name if name else "Need_to_specify_name"
  print "<PRE>{}</PRE>".format(dumps(data, indent=4, sort_keys=True))
