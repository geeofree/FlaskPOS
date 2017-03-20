from flask import Flask, url_for, request, render_template, redirect, session, abort, jsonify
from flask_bcrypt import Bcrypt
from peewee import SelectQuery
from model import *


""" Init Stuff """
app = Flask(__name__)
bcrypt = Bcrypt(app)

""" User Authentication Object"""
user_auth = UserAuth(bcrypt)

""" Key Config """
app.secret_key = '\xb7q3#\xda\xa9\xf6\xa3\x82}\xb4AK'



""" Before Request Handler """
@app.before_request
def before():
    init_db()


""" Teardown Request Handler """
@app.teardown_request
def teardown(exception):
    db.close()


""" After Request Handler """
@app.after_request
def after(response):
    user_init(user_auth)
    response.headers.add('Cache-control', 'no-store, no cache, must-revalidate, post-check=0, pre-check=0')
    return response


""" Home Route """
@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        if not session.get('logged_in', False):
            username = request.form['username']
            password = request.form['password']

            if user_auth.valid(username, password):
                session['logged_in'] = True
                session['client_name'] = username
                return redirect(url_for('checkout'))
            else:
                return render_template("home.html", status="fail")
    if request.method == "GET":
        if not session.get('logged_in', False):
            return render_template("home.html", status=None)
        else:
            return redirect(url_for('checkout'))


""" Checkout Route """
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


""" Dashboard Route """
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
            return render_template("users.html", **context, users = User.select())

        else:
            return render_template("default.html", **context)
    abort(400)


""" Payment POST Route """
@app.route("/payment", methods=["POST"])
def payment():
    json = request.get_json()
    product = Inventory.get(Inventory.invID == json['id'])
    product.stock = product.stock - json['qty']
    product.save()

    data = dict(
        url = url_for('checkout')
    )

    return jsonify(data)


""" Add Product POST Route """
@app.route("/add_product", methods=["POST"])
def add_product():
    if 'logged_in' in session:
        fields = dict(
            prod_name       = request.form['item_name'],
            prod_code       = request.form['item_code'],
            prod_type       = request.form['category'],
            prod_price      = request.form['price'],
            prod_max_stock  = request.form['max_stock'],
            prod_stock      = 0
        )

        Inventory.create(**fields)
    return redirect(url_for('dashboard', subdir='products'))


""" Edit Product POST Route """
@app.route("/edit_product", methods=["POST"])
def edit_product():
    if 'logged_in' in session and id:
        itemID = request.form["itemID"]
        item = Inventory.get(Inventory.invID == itemID)

        item.prod_name  = request.form["item_name"]
        item.save()
        item.prod_type  = request.form["category"]
        item.save()
        item.max_stock  = request.form["max_stock"]
        item.save()
        item.prod_code  = request.form["item_code"]
        item.save()
        item.prod_price = request.form["price"]
        item.save()
    return redirect(url_for("dashboard", subdir="products"))


""" Delete Product POST Route """
@app.route("/del_product", methods=["POST"])
def del_product():
    if 'logged_in' in session:
        username = session['client_name']
        password = request.form['pw']

        if user_auth.valid(username, password):
            itemID = request.args.get("id")
            Inventory.delete().where(Inventory.invID == itemID).execute()

    return redirect(url_for("dashboard", subdir="products"))


""" User Request POST Route """
@app.route("/user_req", methods=["POST"])
def find_user():
    if 'logged_in' in session:
        json = request.get_json()
        user = User.get(User.uID == json['uID'])

        data = dict(
            firstname = user.firstname,
            lastname = user.lastname,
            username = user.username,
            join_date = user.join_date,
            last_login = user.last_login
        )

        return jsonify(data)


""" Create User POST Route """
@app.route("/new_user", methods=["POST"])
def create_user():
    if 'logged_in' in session:
        json     = request.get_json()
        username = session['client_name']
        password = json['auth_pass']

        if user_auth.valid(username, password):

            user_data = dict(
                firstname = json['firstname'],
                lastname = json['lastname'],
                username = json['username'],
                password = json['password'],
                role = json['role'],
            )

            user_auth.create_user(**user_data)

            success_data = dict(
                status = 'success',
                url = url_for('dashboard', subdir='users')
            )

            return jsonify(success_data)
        else:
            return jsonify({'status': "fail", 'error': 'Invalid Password'})


""" Create User POST Route """
@app.route("/remove_user", methods=["POST"])
def remove_user():
    if 'logged_in' in session:
        json     = request.get_json()
        username = session['client_name']
        password = request.form['urm-pw']

        if user_auth.valid(username, password):
            return jsonify(json)
        else:
            return jsonify({'status': "fail", 'error': 'Invalid Password'})


""" Logout Route """
@app.route("/logout")
def logout():
    if 'logged_in' in session:
        user = User.get(User.username == session['client_name'])
        user.online = 0
        user.save()
        session.pop('logged_in')
        session.pop('client_name')
        return redirect(url_for("home"))
    abort(400)




""" Run App """
if __name__ == "__main__":
    app.run(debug=True)
