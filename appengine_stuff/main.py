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
import uuid
from django.utils import simplejson
from google.appengine.ext import webapp, db
from google.appengine.ext.webapp import util, template
from google.appengine.api import channel

class ConnectedUser(db.Model):
  client_id = db.StringProperty()
  name = db.StringProperty()
  school = db.StringProperty()
  languages = db.StringListProperty()
  available = db.BooleanProperty()
  chat_token = db.StringProperty()

class MainHandler(webapp.RequestHandler):
  def get(self):
    template_values = {'client_id': uuid.uuid1()}
    path = os.path.join(os.path.dirname(__file__), 'index.html')
    self.response.out.write(template.render(path, template_values))

  def post(self):
      client_id = self.request.get('client_id')
      new_user = ConnectedUser()
      new_user.client_id = client_id
      new_user.name = self.request.get('name')
      new_user.school = self.request.get('school')
      new_user.languages = self.request.get('languages', allow_multiple=True)
      availability = self.request.get('available') == "true"
      new_user.put()
      self.redirect('/chat?client_id=' + client_id)
      
class ChatHandler(webapp.RequestHandler):
  def get(self):
    client_id = self.request.get("client_id")
    if client_id:
      token = channel.create_channel(client_id)
      current_user = ConnectedUser.all().filter("client_id = ", client_id).get()
      if current_user:
        connected_users = ConnectedUser.all().fetch(50)
    template_values = {
      'current_user': current_user,
      'connected_users': connected_users,
      'token': token 
    }

  def post(self):
    for user in ConnectedUser.all():
      channel.send_message(user.client_id, self.request.get('msg'))

def main():
  application = webapp.WSGIApplication([
                    ('/', MainHandler),
                    ('/chat', ChatHandler)],
                    debug=True)
  util.run_wsgi_app(application)

if __name__ == '__main__':
  main()
