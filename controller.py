from flask import Flask, url_for, request, render_template, redirect, session, abort
from flask_bcrypt import Bcrypt
from model import *


""" Init Stuff """
app = Flask(__name__)
bcrypt = Bcrypt(app)

""" Store bcrypt methods on a different name """
gen_hash   = bcrypt.generate_password_hash
checkpass  = bcrypt.check_password_hash

""" Key Config """
app.secret_key = '\xb7q3#\xda\xa9\xf6\xa3\x82}\xb4AK'



""" Views """
@app.before_request
def before():
    init_db()



@app.teardown_request
def teardown(exception):
    db.close()



@app.route("/", methods=["GET", "POST"])
def home():
    status = None

    def valid(username, password):
        hashed = User.get(User.username == username).password
        return checkpass(hashed, password)

    if 'logged_in' not in session:
        if request.method == "POST":
            username = request.form['username']
            password = request.form['password']

            if valid(username, password):
                session['logged_in'] = True
                return redirect(url_for('dashboard'))
            else:
                status = "fail"
    return render_template("home.html", status=status)



@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")



@app.route("/logout")
def logout():
    if 'logged_in' in session:
        session.pop('logged_in')
        return redirect(url_for("home"))
    abort(400)




""" Run App """
if __name__ == "__main__":
    app.run(debug=True)
