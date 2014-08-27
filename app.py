
import flask
import os
import os.path
import json
import sjoh

app = flask.Flask(__name__, static_folder=None)
# load configuration about files and folders
folder = os.path.dirname(__file__)
fc = os.path.join(folder, "filesconfig.json")
with open(fc, "rb") as file_:
    fc_content = file_.read().decode("utf8")
files_config = json.loads(fc_content)
# register static folders
for s in files_config["static_folders"]:
    def gen_fct(folder):
        def static_route(path):
            return flask.send_from_directory(folder, path)
        return static_route
    route = "/" + s + "/<path:path>"
    app.add_url_rule(route, "static:"+s, gen_fct(s))

@app.route("/")
def main():
    return flask.render_template("index.html", files_config=files_config)

class SjohFlask(object):
    def __init__(self, app):
        self.app = app
        self.json_communicator = sjoh.JsonCommunicator()

    def add_url_rule_for_json(self, rule, endpoint=None, view_func=None, *args, **kwargs):
        def nfunc():
            return self.json_communicator.receive(flask.request, view_func)
        if view_func:
            nfunc.__name__ = view_func.__name__
            nfunc.__module__ = view_func.__module__
        return self.app.add_url_rule(rule, endpoint, nfunc, *args, methods=["POST"], **kwargs)

    def json(self, rule, **options):
        def decorator(f):
            endpoint = options.pop('endpoint', None)
            self.add_url_rule_for_json(rule, endpoint, f, **options)
            return f
        return decorator

sjoh_app = SjohFlask(app)

@sjoh_app.json("/hello")
def hello():
    return "Hello"

if __name__ == "__main__":
    app.run()
