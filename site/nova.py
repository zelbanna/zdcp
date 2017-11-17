"""Module docstring.

HTML5 Ajax Openstack NOVA calls module

- left and right divs frames (div_content_left/right) needs to be created by ajax call
"""
__author__= "Zacharias El Banna"
__version__ = "17.11.01GA"
__status__= "Production"

from sdcp.devices.openstack import OpenstackRPC
from sdcp.site.openstack import dict2html

################################# Nova ###############################
#
def list(aWeb):
 from sdcp.core.extras import get_quote
 cookie = aWeb.cookie
 token  = cookie.get('os_user_token')
 if not token:
  print "Not logged in"
  return
 controller = OpenstackRPC(cookie.get('os_controller'),token)

 ret = controller.call(cookie.get('os_nova_port'),cookie.get('os_nova_url') + "/servers/detail")
 if not ret['result'] == "OK":
  print "Error retrieving list {}".format(str(ret))
  return

 print "<SECTION CLASS=content-left ID=div_content_left><ARTICLE><P>Nova Servers</P>"
 print aWeb.button('reload', DIV='div_content', URL='sdcp.cgi?call=nova_list')
 print aWeb.button('add', DIV='div_content_right', URL='sdcp.cgi?call=nova_select_parameters')
 print "<DIV CLASS=table>"
 print "<DIV CLASS=thead><DIV CLASS=th>Name</DIV><DIV CLASS=th style='width:94px;'>&nbsp;</DIV></DIV>"
 print "<DIV CLASS=tbody>"
 for server in ret['data'].get('servers',None):
  print "<DIV CLASS=tr>"
  print "<!-- {} - {} -->".format(server['status'],server['OS-EXT-STS:task_state'])
  print "<DIV CLASS=td><A TITLE='VM info' CLASS='z-op' DIV=div_content_right URL=sdcp.cgi?call=nova_action&id={}&op=info SPIN=true>{}</A></DIV>".format(server['id'],server['name'])
  print "<DIV CLASS=td>"
  qserver = get_quote(server['name'])
  actionurl = 'sdcp.cgi?call=nova_action&name=%s&id=%s&op={}'%(qserver,server['id'])
  print aWeb.button('term', TARGET='_blank', HREF='sdcp.cgi?call=nova_console&headers=no&name=%s&id=%s'%(qserver,server['id']), TITLE='New window console')
  print aWeb.button('term-frame', DIV='div_content_right', URL='sdcp.cgi?call=nova_console&id=%s'%server['id'], TITLE='Embedded console')
  print aWeb.button('delete', DIV='div_content_right', URL=actionurl.format('remove'), MSG='Are you sure you want to delete VM?', SPIN='true')
  if not server['OS-EXT-STS:task_state']:
   if   server['status'] == 'ACTIVE':
    print aWeb.button('shutdown', DIV='div_content_right', URL=actionurl.format('stop'), SPIN='true', TITLE='Stop VM')
    print aWeb.button('reboot', DIV='div_content_right', URL=actionurl.format('reboot'), SPIN='true', TITLE='Reboot')
   elif server['status'] == 'SHUTOFF':
    print aWeb.button('start', DIV='div_content_right', URL=actionurl.format('start'), SPIN='true', TITLE='Start VM')
  else:
   print aWeb.button('info', DIV='div_content_right', URL=actionurl.format('info'), SPIN='true', TITLE='VM info')
  print "</DIV></DIV>"
 print "</DIV></DIV>"
 print "</ARTICLE></SECTION>"
 print "<SECTION CLASS=content-right ID=div_content_right></SECTION>"


def select_parameters(aWeb):
 cookie = aWeb.cookie
 token  = cookie.get('os_user_token')
 if not token:
  print "Not logged in"
  return
 controller = OpenstackRPC(cookie.get('os_controller'),token)
 port,url = cookie.get('os_nova_port'),cookie.get('os_nova_url')
 print "<ARTICLE>"
 print """
 <script>
  $( function() {
	$(".z-drag").attr("draggable","true");
	$(".z-drag").on("dragstart", function(e){
		console.log("Drag " + $(this).prop("id") + " FROM " + $(this).parent().prop("id"));
		e.originalEvent.dataTransfer.setData("Text",e.target.id);
	});

	$(document.body).on("drop dragover", ".z-drop", function(e){ e.preventDefault();
		if (e.type == 'drop') {
			var elem_id = e.originalEvent.dataTransfer.getData("Text");
			var elem    = document.getElementById(elem_id);
			var input   = $("#" + elem_id + " input");
			console.log("Drop " + elem_id + " INTO " + $(this).prop("id"));
			e.target.appendChild(elem);
			$(this).removeClass("z-drop");
			if ($(elem).attr("name")) {
				console.log("Restoring drop to: " + $(elem).attr("name"));
				$("#" + $(elem).attr("name")).addClass("z-drop");
			}
			input.attr("name",$(this).prop("id"));
		}
   });
 });
</script>
 """
 print "<H2>New VM parameters</H2>"
 print "<FORM ID=frm_os_create_vm>"
 print "<DIV ID=div_os_form CLASS='table' style='float:left;'><DIV CLASS=tbody>"
 print "<DIV CLASS=tr><DIV CLASS=td>Name</DIV><DIV CLASS=td><INPUT NAME=os_name PLACEHOLDER='Unique Name'></DIV></DIV>"
 print "<DIV CLASS=tr><DIV CLASS=td>Image</DIV><DIV CLASS=td><SELECT NAME=os_image>"
 images = controller.call(cookie.get('os_glance_port'),cookie.get('os_glance_url') + "/v2/images?sort=name:asc")['data']['images']
 for img in images:
  print "<OPTION VALUE={}>{} (Min Ram: {}Mb)</OPTION>".format(img['id'],img['name'],img['min_ram'])
 print "</SELECT></DIV></DIV>"

 flavors = controller.call(port,url + "/flavors/detail?sort_key=name")['data']['flavors']
 print "<DIV CLASS=tr><DIV CLASS=td>Flavor</DIV><DIV CLASS='table-val td'><SELECT NAME=os_flavor>"
 for fl in flavors:
  print "<OPTION VALUE={}>{} (Ram: {}Mb, vCPUs: {}, Disk: {}Gb</OPTION>".format(fl['id'],fl['name'],fl['ram'],fl['vcpus'],fl['disk'])
 print "</SELECT></DIV></DIV>"

 print "<DIV CLASS=tr><DIV CLASS=td>Network</DIV><DIV CLASS='td z-drop' ID=os_network1></DIV></DIV>"
 print "</DIV></DIV></FORM>"

 print "<DIV ID=div_os_nets style='float:left; height:200px; overflow:auto;'>"
 networks = controller.call(cookie.get('os_neutron_port'),cookie.get('os_neutron_url') + "/v2.0/networks?sort_key=name")['data']['networks']
 for net in networks:
  if net.get('contrail:subnet_ipam'):
   print "<DIV ID=div_drag_{0} CLASS='z-drag z-drag-input' style='font-size:11px;'><INPUT ID=input_{0} NAME=unused TYPE=HIDDEN VALUE={0}>{1} ({2})</DIV>".format(net['id'],net['name'],net['contrail:subnet_ipam'][0]['subnet_cidr'])
 print "</DIV>"
 print "<BR>"
 print aWeb.button('start',DIV='div_content_right', URL='sdcp.cgi?call=nova_action&id=new&op=add', SPIN='true')
 print "</ARTICLE>"

######################################## Actions ########################################
#
def action(aWeb):
 cookie = aWeb.cookie
 token  = cookie.get('os_user_token')
 if not token:
  print "Not logged in"
  return
 controller = OpenstackRPC(cookie.get('os_controller'),token)

 port = cookie.get('os_nova_port')
 url  = cookie.get('os_nova_url')
 op   = aWeb.get('op','info')

 aWeb.log("nova_action - id:{} op:{} for project:{}".format(aWeb['id'],op,cookie.get('os_project_name')))

 if   op == 'info':
  from sdcp.core.extras import get_quote
  server = controller.call(port,url + "/servers/{}".format(aWeb['id']))['data']['server']
  qserver = get_quote(server['name'])
  tmpl = "<A TITLE='{}' CLASS='btn z-op' DIV=div_os_info URL=sdcp.cgi?call=nova_action&id=%s&op={} SPIN=true>{}</A>"%aWeb['id']
  print "<DIV>"
  print tmpl.format('Details','details','VM Details')
  print tmpl.format('Diagnostics','diagnostics','Diagnostics')
  print tmpl.format('Networks','networks','Networks')
  print "<A TITLE='New-tab Console'  CLASS='btn'  TARGET=_blank HREF='sdcp.cgi?call=nova_console&name={0}&id={1}'>Console</A>".format(qserver,aWeb['id'])
  print "</DIV>"
  print "<ARTICLE STYLE='overflow:auto;' ID=div_os_info>"
  dict2html(server,server['name'])
  print "</ARTICLE>"

 elif op == 'details':
  server = controller.call(port,url + "/servers/{}".format(aWeb['id']))['data']['server']
  dict2html(server,server['name'])

 elif op == 'stop' or op == 'start' or op == 'reboot':
  arg = {"os-"+op:None} if op != 'reboot' else {"reboot":{ "type":"SOFT" }}
  ret = controller.call(port,url + "/servers/{}/action".format(aWeb['id']),args=arg)
  print "Command executed successfully [{}]".format(str(arg)) if ret.get('code') == 202 else "Error executing command [{}]".format(str(arg))

 elif op == 'diagnostics':
  ret = controller.call(port,url + "/servers/{}/diagnostics".format(aWeb['id']))
  dict2html(ret['data'])

 elif op == 'print':
  from json import dumps
  print "<PRE>{}</PRE>".format(dumps(controller.href(aWeb['id'])['data'],indent=4))

 elif op == 'networks':
  from json import dumps
  vm  = controller.call("8082","virtual-machine/{}".format(aWeb['id']))['data']['virtual-machine']
  print "<DIV CLASS=table style='width:auto'>"
  print "<DIV CLASS=thead><DIV CLASS=th>MAC</DIV><DIV CLASS=th>Routing Instance</DIV><DIV CLASS=th>Network</DIV><DIV CLASS=th>IP</DIV><DIV CLASS=th>Floating IP</DIV><DIV CLASS=th>Operation</DIV></DIV>"
  for vmir in vm['virtual_machine_interface_back_refs']:
   vmi = controller.href(vmir['href'])['data']['virtual-machine-interface']
   ip = controller.href(vmi['instance_ip_back_refs'][0]['href'])['data']['instance-ip']
   print "<DIV CLASS=tbody>"
   print "<DIV CLASS=tr>"
   print "<!-- {} -->".format(vmir['href'])
   print "<DIV CLASS=td>{}</DIV>".format(vmi['virtual_machine_interface_mac_addresses']['mac_address'][0])
   print "<DIV CLASS=td>{}</DIV>".format(vmi['routing_instance_refs'][0]['to'][3])
   print "<DIV CLASS=td><A CLASS='z-op' DIV=div_content_right SPIN=true URL=sdcp.cgi?call=neutron_action&id={0}&op=info>{1}</A></DIV>".format(vmi['virtual_network_refs'][0]['uuid'],vmi['virtual_network_refs'][0]['to'][2])
   print "<DIV CLASS=td>{}</DIV>".format(ip['instance_ip_address'])
   if vmi.get('floating_ip_back_refs'):
    fip = controller.href(vmi['floating_ip_back_refs'][0]['href'])['data']['floating-ip']
    print "<DIV CLASS=td>{} ({})</DIV>".format(fip['floating_ip_address'],fip['fq_name'][2])
    print "<DIV CLASS=td>&nbsp;"
    print aWeb.button('remove',DIV='div_os_info', URL='sdcp.cgi?call=neutron_action&op=fi_disassociate&id=%s'%fip['uuid'], SPIN='true')
    print "</DIV>"
   else:
    print "<DIV CLASS=td></DIV>"
    print "<DIV CLASS=td></DIV>"
   print "</DIV>"
  print "</DIV></DIV>"

 elif op == 'add':
  print "TBD"

 elif op == 'remove':
  ret = controller.call(port,url + "/servers/{}".format(aWeb['id']), method='DELETE')
  if not ret['result'] == "OK":
   print "Error performing op {}".format(str(ret))
   return
  print "<ARTICLE><P>Removing VM</P>"
  print "VM removed" if ret['code'] == 204 else "Error code: %s"%(ret['code'])
  print "</ARTICLE>"

def console(aWeb):
 token = aWeb.cookie.get('os_user_token')

 if not token:
  if aWeb['headers'] == 'no':
   aWeb.put_html('Openstack Nova')
  print "Not logged in"
  return

 controller = OpenstackRPC(aWeb.cookie.get('os_controller'),token)
 data = controller.call(aWeb.cookie.get('os_nova_port'), aWeb.cookie.get('os_nova_url') + "/servers/{}/remote-consoles".format(aWeb['id']), { "remote_console": { "protocol": "vnc", "type": "novnc" } }, header={'X-OpenStack-Nova-API-Version':'2.8'})
 if data['code'] == 200:
  url = data['data']['remote_console']['url']
  # URL is not always proxy ... so force it through: remove http:// and replace IP (assume there is a port..) with controller IP
  url = "http://" + aWeb.cookie.get('os_controller') + ":" + url[7:].partition(':')[2]
  if not aWeb['headers']:
   print "<iframe id='console_embed' src='{}' style='width: 100%; height: 100%;'></iframe>".format(url)
  else:
   aWeb.put_redirect("{}&title={}".format(url,aWeb['name']))
