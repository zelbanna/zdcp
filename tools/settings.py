#!/usr/bin/python
# -*- coding: utf-8 -*-
"""Program docstring.
Creates a package specific container, partly using settings from a .json file
"""
__author__ = "Zacharias El Banna"
__version__ = "17.6.1GA"
__status__ = "Production"

def convertSettings(aFile):
 from json import load
 from os import remove
 try:
  with open(aFile) as f:
   config = load(f)
  with open("PackageContainer.py",'w') as f:
   for name,cathegory in config.iteritems():
    for key, entry in cathegory.iteritems():
     f.write("{}_{} = '{}'\n".format(name,key,entry))
    f.write("\n")
   f.write("def log_msg(amsg):\n")
   f.write(" from time import localtime, strftime\n")
   f.write(" with open(generic_logformat, 'a') as f:\n")
   f.write(repr("  f.write(unicode('{} : {}\n'.format(strftime('%Y-%m-%d %H:%M:%S', localtime()), amsg)))")[1:-1] + "\n")
  # Brute way of compiling ...
  import PackageContainer
  remove("PackageContainer.py")
  print "Parsed settings and wrote PackageContainer"
 except Exception as err:
  print "Error handling settings files: {}".format(str(err))

if __name__ == "__main__":
 from sys import argv
 if len(argv) < 2:
  print "Usage: {} <json file>".format(argv[0])
 else:
  convertSettings(argv[1])
