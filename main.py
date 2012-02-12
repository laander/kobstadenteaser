import webapp2
from google.appengine.ext import ndb
from webapp2_extras import jinja2, json
import hashlib
import random
from google.appengine.api import mail


class EmailSignup(ndb.Model):
    email = ndb.StringProperty()
    confirmed = ndb.BooleanProperty(default=False)
    date_added = ndb.DateTimeProperty(auto_now=True)


class ConfirmationKey(ndb.Model):
    email = ndb.KeyProperty(kind=EmailSignup)
    date_added = ndb.DateTimeProperty(auto_now=True)


class BaseHandler(webapp2.RequestHandler):
    def render_response(self, filename, **kwargs):
        kwargs.update({
            #'current_user': self.user,
            'current_url': self.request.url,
            })
        #kwargs.update(self.auth_config)
        #if self.messages:
        #    kwargs['messages'] = self.messages
        self.response.write(self.jinja2.render_template(filename, **kwargs))

    @webapp2.cached_property
    def jinja2(self):
        # Returns a Jinja2 renderer cached in the app registry.
        return jinja2.get_jinja2(app=self.app)


class IndexHandler(BaseHandler):
    def get(self):
        self.render_response("index.html", **{})


class CollectEmail(BaseHandler):
    def _send_mail(self, email, key):
        sender_address = "Kobstaden.dk <jhh@kobstaden.dk>"
        subject = "Tak for din interesse!"
        body = self.jinja2.render_template("mail.txt", **{"key": key, "email": email})
        body_html = self.jinja2.render_template("mail.html", **{"key": key, "email": email})
        message = mail.EmailMessage(sender=sender_address, to=email, subject=subject, html=body_html, body=body)
        message.send()

    def post(self):
        email = self.request.POST.get("email")
        data = {
                "email": email,
            }
        if mail.is_email_valid(email):
            check_mail = EmailSignup.get_by_id(email)
            if not check_mail:
                signup = EmailSignup(id=email, email=email)
                signup.put()
                key = hashlib.sha224(str(random.getrandbits(256))).hexdigest()
                conf = ConfirmationKey(id=key, email=signup.key)
                conf.put()
                self._send_mail(email, key)
                data["message"] = "Success"
            else:
                data["message"] = "Email already signed up"
        else:
            data["message"] = "Invalid email"
        self.response.write(json.encode(data))


class ConfirmEmail(webapp2.RequestHandler):
    def get(self, key):
        conf = ConfirmationKey.get_by_id(key)
        if key:
            signup = conf.email.get()
            signup.confirmed = True
            signup.put()
            conf.delete()
            self.redirect('/thankyou/')
        self.redirect('/')


class RemoveEmail(webapp2.RequestHandler):
    def get(self, email):
        mail = EmailSignup.get_by_id(email)
        mail.key.delete()
        self.redirect('/removed/')


config = {}
config['webapp2_extras.jinja2'] = {
    'environment_args': {'autoescape': True, 'extensions': ['jinja2.ext.autoescape', 'jinja2.ext.with_', 'jinja2.ext.i18n']}
}

app = webapp2.WSGIApplication([
    webapp2.Route(r'/', handler="main.IndexHandler", name='home'),
    webapp2.Route(r'/signup/', handler="main.CollectEmail", name='signup'),
    webapp2.Route(r'/thankyou/', handler="main.IndexHandler", name='signup'),
    webapp2.Route(r'/removed/', handler="main.IndexHandler", name='signup'),
    webapp2.Route(r'/confirm/<key>/', handler="main.ConfirmEmail", name='signup'),
    webapp2.Route(r'/delete/<email>/', handler="main.RemoveEmail", name='signup'),
    ], debug=False, config=config)
