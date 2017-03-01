from flask import Flask, url_for, request, render_template, redirect, session, abort
from flask_bcrypt import Bcrypt
from model import *


""" Init Stuff """
app = Flask(__name__)
bcrypt = Bcrypt(app)

""" Rename bcrypt methods """
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



@app.route("/")
def home():
    if 'logged_in' not in session:
        return redirect(url_for('authentication'))
    return render_template("home.html")



@app.route("/login/", methods=["GET", "POST"])
def authentication():
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
                return redirect(url_for('home'))
            else:
                status = "fail"
        return render_template("login.html", status=status)
    abort(400)



@app.route("/logout")
def logout():
    if 'logged_in' in session:
        session.pop('logged_in')
        return redirect(url_for("authentication"))
    abort(400)




""" Run App """
if __name__ == "__main__":
    app.run(debug=True)
