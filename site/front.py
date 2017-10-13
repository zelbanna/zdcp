"""Module docstring.

Front-End(s)

"""
__author__= "Zacharias El Banna"                     
__version__ = "17.10.4"
__status__= "Production"


import sdcp.PackageContainer as PC

#################################################################################################################
#
# SDCP "login"
#
# - writes cookies for sdcp_user(name) and sdcp_id
# - if passwords, then do proper checks
#
# Now do referrer?
#
def login(aWeb):
 if aWeb.cookie.get('sdcp_id'):
  id,user = aWeb.cookie.get('sdcp_id'),aWeb.cookie.get('sdcp_user')
 else:
  id,user = aWeb.get_value('sdcp_login',"None_None").split('_')
  if id != "None":
   # "Login successful"
   aWeb.add_cookie('sdcp_user', user, 86400)
   aWeb.add_cookie('sdcp_id', id, 86400)

 if id != "None":
  PC.log_msg("Entering as [{}-{}]".format(id,user))
  aWeb.put_html(PC.sdcp['name'])
  print """<DIV class='z-main-menu' ID=div_main_menu>
  <A CLASS='z-btn z-menu-btn z-op' DIV=div_main_cont TITLE='General'   URL=index.cgi?call=base_navigate&type=demo><IMG SRC='images/icon-start.png'/></A>
  <A CLASS='z-btn z-menu-btn z-op' DIV=div_main_cont TITLE='Rack'      URL=index.cgi?call=rack_main><IMG SRC='images/icon-rack.png'/></A>
  <A CLASS='z-btn z-menu-btn z-op' DIV=div_main_cont TITLE='Devices'   URL=index.cgi?call=device_main><IMG SRC='images/icon-network.png'/></A>
  <A CLASS='z-btn z-menu-btn z-op' DIV=div_main_cont TITLE='Examine'   URL=index.cgi?call=base_examine><IMG SRC='images/icon-examine.png'/></A>
  <A CLASS='z-btn z-menu-btn z-op' DIV=div_main_cont TITLE='Users'     URL=index.cgi?call=base_users><IMG SRC='images/icon-users.png'/></A>
  <A CLASS='z-btn z-menu-btn z-op' DIV=div_main_cont TITLE='Documents' URL=index.cgi?call=base_navigate&type=bookmark><IMG SRC='images/icon-docs.png'/></A>
  <A CLASS='z-btn z-menu-btn z-op' DIV=div_main_cont TITLE='Tools'     URL=index.cgi?call=base_navigate&type=tool><IMG SRC='images/icon-tools.png'/></A>
  <A CLASS='z-btn z-menu-btn z-op' DIV=div_main_cont TITLE='ESXi'      URL=index.cgi?call=esxi_main><IMG SRC='images/icon-servers.png'/></A>
  <A CLASS='z-btn z-menu-btn z-op' DIV=div_main_cont TITLE='Config'    URL=index.cgi?call=base_config><IMG SRC='images/icon-config.png'/></A>
  </DIV>
  <DIV CLASS=z-main-content ID=div_main_cont></DIV>"""
  return

 if PC.generic['db'] == '':
  PC.log_msg("No login available")                                   
  aWeb.put_html("No Login")     
  return
 
 import sdcp.core.GenLib as GL
 db = GL.DB()
 db.connect()
 db.do("SELECT id,name FROM users ORDER BY name")
 db.close()
 rows = db.get_rows()
 aWeb.put_html("Login")
 print "<DIV CLASS='z-centered' style='height:100%;'>"
 print "<DIV CLASS='z-frame' ID=div_login style='border: solid 1px black; width:600px; height:180px;'>"
 print "<CENTER><H1>Welcome to the management portal</H1></CENTER>"
 print "<FORM ACTION=index.cgi METHOD=POST ID=sdcp_login_form>"
 print "<INPUT TYPE=HIDDEN NAME=call VALUE=front_login>"
 print "<DIV CLASS=z-table style='display:inline; float:left; margin:0px 0px 0px 30px;'><DIV CLASS=tbody>"
 print "<DIV CLASS=tr><DIV CLASS=td>Username:</DIV><DIV CLASS=td><SELECT style='border:none; display:inline; color:black' NAME=sdcp_login>"
 for row in rows:
  print "<OPTION VALUE='{0}_{1}' {2}>{1}</OPTION>".format(row['id'],row['name'],'' if str(row['id']) != id else "selected=True")
 print "</SELECT></DIV></DIV>"
 print "</DIV></DIV>"
 print "<A CLASS='z-btn z-op' OP=submit style='margin:20px 20px 30px 40px;' FRM=sdcp_login_form>Enter</A>"
 print "</FORM>"
 print "</DIV></DIV>"

##################################################################################################
#
# Weathermap
#
def weathermap(aWeb):
 aWeb.put_html("Weathermap")

 page = aWeb.get_value('page')
 if not page:
  print "<DIV CLASS=z-navbar ID=div_navbar>" 
  for map,entry in PC.weathermap.iteritems():
   print "<A CLASS=z-op OP=iload IFRAME=iframe_wm_cont URL=index.cgi?call=front_weathermap&page={0}>{1}</A>".format(map,entry['name'])
  print "</DIV>"
  print "<DIV CLASS='z-content' ID=div_content NAME='Weathermap Content'>"
  print "<IFRAME ID=iframe_wm_cont src=''></IFRAME>"
  print "</DIV>" 
 else:
  entry  = PC.weathermap[page]
  graphs = entry.get('graphs')
  if graphs:
   from sdcp.tools.munin import widget_rows
   widget_rows(graphs)
  print "<DIV CLASS='z-frame'>"
  print aWeb.get_include('{}.html'.format(page))
  print "</DIV>"


###################################################################################################################################
#
# Openstack
#
# Cookies:
# af_controller   = appformix controller ip
# os_controller   = openstack controller ip
# os_demo_name    = Name of Customer demoing for
# os_main_token   = auth token for project recovery
# os_project_id   = id for selected project
# os_project_name = name for selected project
# os_user_name    = username last used
# os_user_token   = token for user
# os_xyz_port     = port for service xyz
# os_xyz_url      = url  for service xyz
# os_xyz_id       = id   for service xyz
#

def openstack(aWeb):
 from sdcp.devices.openstack import OpenstackRPC
 name = aWeb.get_value('name',"iaas")
 ctrl = aWeb.get_value('controller',"127.0.0.1")
 appf = aWeb.get_value('appformix',"127.0.0.1")
 user = aWeb.cookie.get("os_user_name")
 utok = aWeb.cookie.get("os_user_token")
 mtok = aWeb.cookie.get("os_main_token")
 prev = aWeb.cookie.get("os_project_id")
 if utok:
  aWeb.put_redirect("index.cgi?call=openstack_portal")
  return

 aWeb.add_cookie("os_demo_name",name)
 aWeb.add_cookie("os_controller",ctrl)
 aWeb.add_cookie("af_controller",appf)

 if not mtok:
  openstack = OpenstackRPC(ctrl,None)
  res = openstack.auth({'project':PC.openstack['project'], 'username':PC.openstack['username'],'password':PC.openstack['password']})
  aWeb.add_cookie("os_main_token",openstack.get_token())
  PC.log_msg("openstack_login - login result: {}".format(str(res['result'])))
 else:
  PC.log_msg("openstack_login - reusing token: {}".format(mtok))
  openstack = OpenstackRPC(ctrl,mtok)

 ret = openstack.call("5000","v3/projects")
 projects = [] if not ret['code'] == 200 else ret['data']['projects']

 aWeb.put_html("{} 2 Cloud".format(name.capitalize()))
 print "<DIV CLASS='z-centered' style='height:100%;'>"
 print "<DIV CLASS='z-frame' ID=div_login style='border: solid 1px black; width:600px; height:180px;'>"
 print "<CENTER><H1>Welcome to '{}' Cloud portal</H1></CENTER>".format(name.capitalize())
 print "<FORM ACTION=index.cgi METHOD=POST ID=openstack_login>"
 print "<INPUT TYPE=HIDDEN NAME=call VALUE=openstack_portal>"
 print "<INPUT TYPE=HIDDEN NAME=headers VALUE=no>"
 print "<DIV CLASS=z-table style='display:inline; float:left; margin:0px 0px 0px 30px;'><DIV CLASS=tbody>"
 print "<DIV CLASS=tr><DIV CLASS=td>Customer:</DIV><DIV CLASS=td><SELECT style='border:none; display:inline; color:black' NAME=project>"
 for p in projects:
  print "<OPTION VALUE={0}_{1} {2}>{1}</OPTION>".format(p['id'],p['name'],'' if not p['id'] == prev else "selected")
 print "</SELECT></DIV></DIV>"
 print "<DIV CLASS=tr><DIV CLASS=td>Username:</DIV><DIV CLASS=td><INPUT TYPE=text NAME=username {}></DIV></DIV>".format('' if not user else "VALUE={}".format(user))
 print "<DIV CLASS=tr><DIV CLASS=td>Password:</DIV><DIV CLASS=td><INPUT TYPE=password NAME=password></DIV></DIV>"
 print "</DIV></DIV>"
 print "<A CLASS='z-btn z-op' style='margin:20px 20px 30px 40px;' OP=submit FRM=openstack_login>Login</A>"
 print "</FORM>"
 print "</DIV></DIV>"