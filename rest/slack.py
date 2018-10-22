"""SLACK API module. Provides a serviceinterface towards SLACK REST API (webhooks), i.e. SaaN (Slack As A Node)
Settings under section 'slack':
- api (base API - typically: https://hooks.slack.com/services)
- service (Access info - Like T000xxxxx/B000xxxx/abcdy and so on)

https://api.slack.com/incoming-webhooks

"""
__author__ = "Zacharias El Banna"
__add_globals__ = lambda x: globals().update(x)
__type__ = "NOTIFY"

#
#
def status(aDict, aCTX):
 """Function returns status of slack connection... somehow (TBD)

 Args:

 Output:
 """
 return {'settings':aCTX.settings.get('slack',{})}

#
#
def sync(aDict, aCTX):
 """Function synchornizes connection to Slack, TBD as is..

 Args:
  - id (required). Server id on master node

 Output:
 """
 return None

#
#
def restart(aDict, aCTX):
 """Function provides restart capabilities of service

 Args:

 Output:
  - code
  - output
  - result 'OK'/'NOT_OK'
 """
 return {'code':None, 'output':None, 'result':'OK'}

#
#
def notify(aDict, aCTX):
 """Function provides notification service, basic at the moment for development purposes

 Args:
  - message (required)
  - user (optional)
  - channel (optional)

 Output:
  - result ('OK'/'NOT_OK')
  - info (slack response text/data)

 """
 url = "%s/%s"%(aCTX.settings['slack']['api'],aCTX.settings['slack']['service'])
 args = {'text':aDict['message']} 
 if aDict.get('user'):
  args['channel'] = "@%s"%aDict['user']
 elif aDict.get('channel'):
  args['channel'] = "#%s"%aDict['channel']
 res = aCTX.rest_call(url,args)
 return {'result':'OK' if res['code']== 200 else 'NOT_OK', 'info':res['data']}
