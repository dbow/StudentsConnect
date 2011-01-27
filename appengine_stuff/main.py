#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import os
from google.appengine.ext import webapp, db
from google.appengine.ext.webapp import util, template
from google.appengine.api import channel

class ConnectedUser(db.Model):
  chatsession = db.StringProperty()
  name = db.StringProperty()
  school = db.StringProperty()
  languages = db.StringListProperty()
  available = db.BooleanProperty()

class MainHandler(webapp.RequestHandler):
  def get(self):
    connected_users = None
    token = None
    id=self.request.get("id")
    if id:
      created_user = ConnectedUser.all().filter("chatsession=",id)
      if created_user:
        connected_users = ConnectedUser.all().fetch(50)
        token=id
        
    template_values = {
          'connected_users': connected_users,
          'token': token,
          }

    path = os.path.join(os.path.dirname(__file__), 'index.html')
    self.response.out.write(template.render(path, template_values))

  def post(self):
      client_id=self.request.get('id')
      new_user = ConnectedUser()
      new_user.chatsession = client_id
      token = channel.create_channel(client_id)
      new_user.name=self.request.get('name')
      new_user.school=self.request.get('school')
      new_user.languages = self.request.get('languages', allow_multiple=True)
      availability = self.request.get('available')
      if availability == "true":
          new_user.available=True
      else:
          new_user.available=False
      new_user.put()
      self.redirect('/?id=' + client_id)
      
class UpdateHandler(webapp.RequestHandler):
    def post(self):
        gameUpdate = {
            'name': 'John'
        }
        channel.send_message('1' , '{"msg":"hello"}')
        self.response.out.write('{"msg":"hello"}')

class TokenRequestHandler(webapp.RequestHandler):
  def post(self):
    client_id = self.request.get("id")
    token = channel.create_channel(client_id)
    self.response.out.write(token)


def main():
  application = webapp.WSGIApplication([('/', MainHandler),
                            ('/update', UpdateHandler),
                          ('/requesttoken', TokenRequestHandler)],
                                     debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
