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



@app.after_request
def after(response):
    response.headers.add('Cache-control', 'no-store, no cache, must-revalidate, post-check=0, pre-check=0')
    return response


@app.route("/", methods=["GET", "POST"])
def home():
    def valid(username, password):
        try:
            hashed = User.get(User.username == username).password
            return checkpass(hashed, password)
        except User.DoesNotExist:
            return False

    if request.method == "POST":
        if not session.get('logged_in', False):
            username = request.form['username']
            password = request.form['password']

            if valid(username, password):
                session['logged_in'] = True
                session['client_name'] = username
                return redirect(url_for('checkout'))
            else:
                return render_template("home.html", status="fail")

    if request.method == "GET":
        return render_template("home.html", status=None)



@app.route("/checkout")
def checkout():
    if 'logged_in' in session:
        user = User.get(User.username == session['client_name'])
        products = Inventory.select()
        return render_template("checkout.html", user=user, products=products)
    return redirect(url_for('home'))



@app.route("/products")
def products():
    if 'logged_in' in session:
        user = User.get(User.username == session['client_name'])
        products = Inventory.select()
        return render_template("products.html", user=user, products=products)
    abort(400)



@app.route("/dashboard")
def dashboard():
    return "Dashboard"



@app.route("/logout")
def logout():
    if 'logged_in' in session:
        session.pop('logged_in')
        session.pop('client_name')
        return redirect(url_for("home"))
    abort(400)




""" Run App """
if __name__ == "__main__":
    app.run(debug=True)
