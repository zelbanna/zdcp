"""SDCP tools REST module. Provides various tools"""
__author__ = "Zacharias El Banna"
__version__ = "18.03.07GA"
__status__ = "Production"
__add_globals__ = lambda x: globals().update(x)

############################################ System Tools ############################################
#
#
def system(aDict):
 """Function docstring for system TBD

 Args:
  - user_id (required)
 
 Output:
 """
 from ..core.common import DB,SC
 from resources import list as resource_list
 ret = {}
 with DB() as db:
  ret['nodes'] = [{'parameter':node[0],'value':node[1]} for node in SC.node.items() if node[0] in SC.generic['nodes'].split(',')]
  db.do("SELECT id, icon, title, href, type, inline, user_id FROM resources WHERE type = 'monitor' AND (user_id = %s OR private = 0) ORDER BY type,title"%ret.get('user_id',1))
  ret['monitors'] = db.get_dict(aDict.get('dict')) if aDict.get('dict') else db.get_rows()
 ret['dns_node'] = SC.dns['node']
 ret['dns_type'] = SC.dns['type']
 ret['dhcp_node'] = SC.dhcp['node']
 ret['dhcp_type'] = SC.dhcp['type']
 ret['id'] = SC.system['id']
 return ret

#
#
def settings_fetch(aDict):
 """Function docstring for settings_fetch TBD

 Args:
  - node (required)
 
 Output:
 """
 from ..core.common import DB
 ret = {}
 with DB() as db:
  db.do("SELECT section,parameter,value FROM settings WHERE node = '%s'"%aDict['node'])
  data = db.get_rows()
 for setting in data:
  section = setting.pop('section')
  if not ret.get(section):
   ret[section] = {} 
  ret[section][setting['parameter']] = setting['value']
 return ret

#
#
def settings_save(aDict):
 """Function docstring for settings_save TBD

 Args:
 
 Output:
 """
 from json import load,dumps
 from os import path as ospath
 from ..core.common import DB,SC
 ret = {'file':SC.system['config_file']}
 try:
  settings = {}
  with open(SC.system['config_file']) as sfile:
   temp = load(sfile)
  for section,content in temp.iteritems():
   for key,params in content.iteritems():
    if not settings.get(section):
     settings[section] = {}
    settings[section][key] = params['value'] 
  settings['system']['config_file'] = ret['file']

  if SC.system['id'] == 'master':
   with DB() as db:
    db.do("SELECT section,parameter,value FROM settings WHERE node = 'master'")
    data = db.get_rows()
   for setting in data:
    section = setting.pop('section') 
    if not settings.get(section): 
     settings[section] = {} 
    settings[section][setting['parameter']] = setting['value']
  else:
   from ..core.rest import call as rest_call
   try: master = rest_call("%s?tools_settings_fetch"%settings['system']['master'],{'node':settings['system']['id']})['data']
   except: pass
   else:
    for section,content in master.iteritems():
     if settings.get(section): settings[section].update(content)
     else: settings[section] = content

  container = ospath.abspath(ospath.join(ospath.dirname(__file__),'..','SettingsContainer.py'))
  with open(container,'w') as f:
   for section,content in settings.iteritems():
    f.write("%s=%s\n"%(section,dumps(content)))
  ret['result'] = 'OK'
 except Exception,e:
  ret['result'] = 'NOT_OK'
  ret['error'] = str(e)
 return ret

############################################ REST tools ############################################
#
#
def rest_analyze(aDict):
 """Function docstring for rest_analyze. Analyzes REST files to deduce parameter inputs

 Args:
  - file (required)

 Output:
 """
 from os import path as ospath
 restdir = ospath.abspath(ospath.join(ospath.dirname(__file__), '..','rest'))
 ret = {'file':aDict['file'],'functions':[],'global':[]}
 data = {'function':None,'required':{},'optional':{},'pop':{},'undecoded':[],'arg':None,'imports':[]}

 with open(ospath.abspath(ospath.join(restdir,aDict['file'])),'r') as file:
  line_no = 0
  for line in file:
   line_no += 1
   line = line.rstrip()
   line = line.replace("%s","<var>")
   if line[0:4] =='from':
    ret['global'].append(line)
   if line[0:4] == 'def ':
    if data['function']:
     ret['functions'].append(data)
     data = {'function':None,'required':{},'optional':{},'pop':{},'undecoded':[],'arg':None,'imports':[]}
    name_end = line.index('(')
    data['arg'] = line[name_end+1:-2]
    data['function'] = line[4:name_end].lstrip()
   elif data['function'] and data['arg'] in line:
    try:
     parts = line.split(data['arg'])
     for part in parts[1:]:
      if part[0:2] == "['":
       end = part.index("]")
       argument = part[2:end-1]
       if not data['required'].get(argument):
        data['required'][argument] = (data['optional'].get(argument) is None)
      elif part[0:6] == ".get('":
       end = part[6:].index("'")
       argument = part[6:6+end]
       if not data['optional'].get(argument):
        data['optional'][argument] = (data['required'].get(argument) is None)
      elif part[0:6] == ".pop('":
       end = part[6:].index("'")
       argument = part[6:6+end]
       if not data['required'].get(argument) and not data['optional'].get(argument):
        data['pop'][argument] = True
      elif part[0:7]== ".keys()" or part[0] == ")" or part[0:12] == ".iteritems()":
       pass
      else:
       data['undecoded'].append({'part':part,'line':line_no})
    except Exception, e:
     data['undecoded'].append({'error':str(e),'line':line_no})
   elif data['function'] and "from" in line:
    data['imports'].append(line.lstrip())
  if data['function']:
   ret['functions'].append(data)
 return ret


#
#
def rest_explore(aDict):
 """Function docstring for rest_explore TBD

 Args:
  - api (optional)

 Output:
 """
 from types import FunctionType as function
 from importlib import import_module
 def __analyze(aFile):
  data = {'api':aFile, 'functions':[]}
  try:
   module = import_module("sdcp.rest.%s"%(aFile))
   data['functions'] = [item for item in dir(module) if item[0:2] != "__" and isinstance(getattr(module,item,None),function)]
  except Exception,e: data['error'] = str(e)
  return data

 ret = {'data':[]}
 if aDict.get('api'):
  ret['data'].append(__analyze(aDict.get('api')))
 else:
  from os import path as ospath, listdir
  restdir = ospath.abspath(ospath.join(ospath.dirname(__file__)))
  for restfile in listdir(restdir):
   if restfile[-3:] == '.py':
    ret['data'].append(__analyze(restfile[0:-3]))
 return ret

#
#
def rest_information(aDict):
 """Function docstring for rest_explore TBD

 Args:
  - api (required)
  - function (required)

 Output:
 """ 
 from importlib import import_module
 mod = import_module("sdcp.rest.%s"%(aDict['api']))
 fun = getattr(mod,aDict['function'],None)
 return {'api':aDict['api'],'module':mod.__doc__.split('\n'),'information':fun.__doc__.split('\n')}

#
#
def rest_debug(aDict):
 """Function docstring for rest_debug TBD

 Args:

 Output:
 """ 
 print "Set-Cookie: debug=true; Path=/"
 return { 'globals':str(globals().keys()), 'locals':str(locals().keys()) }

############################################ Monitor ##############################################

#
#
def logs_clear(aDict):
 """Function docstring for logs_clear TBD

 Args:

 Output:
 """
 from .. import SettingsContainer as SC
 from ..core.logger import log
 ret = {}
 for name,file in SC.logs.iteritems():
  try:
   open(file,'w').close()
   ret[name] = 'CLEARED'
   log("Emptied log [{}]".format(name))
  except Exception as err:
   ret[name] = 'ERROR: %s'%(str(err))
 return ret

#
#
def logs_get(aDict):
 """Function docstring for logs_get TBD

 Args:
  - count (optional)

 Output:
 """
 from .. import SettingsContainer as SC
 ret = {}
 count = int(aDict.get('count',15))
 for name,file in SC.logs.iteritems():
  lines = ["\r" for i in range(count)]
  pos = 0
  try:
   with open(file,'r') as f:
    for line in f:
     lines[pos] = line
     pos = (pos + 1) % count
    ret[name] = [lines[(pos + n) % count][:-1] for n in reversed(range(count))]
  except Exception as err:
   ret[name] = ['ERROR: %s'%(str(err))]
 return ret
