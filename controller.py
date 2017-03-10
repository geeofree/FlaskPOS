from flask import Flask, url_for, request, render_template, redirect, session, abort
from flask_bcrypt import Bcrypt
from peewee import SelectQuery
from model import *


""" Init Stuff """
app = Flask(__name__)
bcrypt = Bcrypt(app)

""" Store bcrypt methods on a different name """
gen_hash   = bcrypt.generate_password_hash
checkpass  = bcrypt.check_password_hash

""" Key Config """
app.secret_key = '\xb7q3#\xda\xa9\xf6\xa3\x82}\xb4AK'

""" HELPER Function """
def valid(username, password):
    try:
        hashed = User.get(User.username == username).password
        return checkpass(hashed, password)
    except User.DoesNotExist:
        return False


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
        context = dict (
            user = User.get(User.username == session['client_name']),
            products = Inventory.select(),
            current_dir = 'checkout'
        )
        return render_template("checkout.html", **context)
    return redirect(url_for('home'))



@app.route("/payment", methods=["POST"])
def payment():
    json = request.get_json()
    product = Inventory.get(Inventory.invID == json['id'])
    product.stock = product.stock - json['qty']
    product.save()
    return url_for('checkout')



@app.route("/dashboard/<subdir>")
@app.route("/dashboard/", defaults={'subdir': ''})
def dashboard(subdir):
    if 'logged_in' in session:
        if subdir and subdir not in ['reports', 'products', 'logs', 'users']:
            abort(404)

        context = dict (
            user = User.get(User.username == session['client_name']),
            products = Inventory.select(),
            current_dir = 'dashboard'
        )

        if subdir == 'reports':
            return render_template("reports.html", **context)

        elif subdir == 'products':
            categories = set(item.prod_type for item in SelectQuery(Inventory, Inventory.prod_type))
            return render_template("products.html", **context, categories=categories)

        elif subdir == 'logs':
            return render_template("logs.html", **context)

        elif subdir == 'users':
            return render_template("users.html", **context)

        else:
            return render_template("default.html", **context)
    abort(400)



@app.route("/add_product", methods=["POST"])
def add_product():
    if 'logged_in' in session:
        fields = dict(
            prod_name  = request.form['item_name'],
            prod_code  = request.form['item_code'],
            prod_type  = request.form['category'],
            stock      = request.form['stock'],
            prod_price = request.form['price']
        )

        Inventory.create(**fields)
    return redirect(url_for('dashboard', subdir='products'))



@app.route("/edit_product", methods=["POST"])
def edit_product():
    if 'logged_in' in session and id:
        itemID = request.form["itemID"]
        item = Inventory.get(Inventory.invID == itemID)

        item.prod_name  = request.form["item_name"]
        item.save()
        item.prod_type  = request.form["category"]
        item.save()
        item.stock      = request.form["stock"]
        item.save()
        item.prod_code  = request.form["item_code"]
        item.save()
        item.prod_price = request.form["price"]
        item.save()
    return redirect(url_for("dashboard", subdir="products"))



@app.route("/del_product", methods=["POST"])
def del_product():
    if 'logged_in' in session:
        username = session['client_name']
        password = request.form['pw']

        if valid(username, password):
            itemID = request.args.get("id")
            Inventory.delete().where(Inventory.invID == itemID).execute()

    return redirect(url_for("dashboard", subdir="products"))



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
