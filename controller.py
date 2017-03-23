from flask import Flask, url_for, request, render_template, redirect, session, abort, jsonify, make_response
from flask_bcrypt import Bcrypt
from peewee import SelectQuery
from datetime import datetime
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
                session['client_role'] = User.get(User.username == username).role
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
            current_dir = 'checkout',
            categories = set(item.prod_type for item in SelectQuery(Inventory, Inventory.prod_type))
        )
        return render_template("checkout.html", **context)
    return redirect(url_for('home'))


""" Dashboard Route """
@app.route("/dashboard/<subdir>")
@app.route("/dashboard/", defaults={'subdir': ''})
def dashboard(subdir):
    user_role = session['client_role']

    if 'logged_in' in session and user_role == "Super Admin" or user_role == "Admin":
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
            users = User.select()
            return render_template("users.html", **context, users = users)

        else:
            return render_template("default.html", **context)
    abort(400)


""" Payment POST Route """
@app.route("/payment", methods=["POST"])
def payment():
    req = request.get_json()
    merchant = req['merchant']
    subtotal = req['subtotal']
    totalqty = req['totalqty']
    payment = req['payment']
    change = req['change']
    items_sold = req['items_sold']

    employee = User.get(User.username == merchant)

    transaction_data = dict(
        merchant = employee,
        totalqty = totalqty,
        subtotal = subtotal,
        payment = payment,
        change = change,
        date_sold = datetime.now().date()
    )

    transaction = Transactions.create(**transaction_data)

    for item in items_sold:
        product = Inventory.get(Inventory.invID == item['id'])
        product.prod_stock = product.prod_stock - item['qty_sold']
        product.save()

        items_sold_data = dict(
            transID = transaction,
            item = product,
            qty = item['qty_sold'],
            linetotal = item['linetotal']
        )

        Items_Sold.create(**items_sold_data)

    response = dict(
        status = 'success',
        url = url_for('receipt', transID=transaction.transID)
    )

    return jsonify(response)


""" Receipt Generator Route """
@app.route("/transactions/receipt_no/<transID>")
def receipt(transID):
    if 'logged_in' in session:
        transaction = (Transactions.select()
                        .where(Transactions.transID == transID)
                        .join(User))

        items_sold = (Items_Sold.select()
                        .where(Items_Sold.transID == transID)
                        .join(Inventory))

        if transaction:
            return render_template('receipt.html', transaction=transaction, items=items_sold)
        abort(400)
    abort(404)

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
    if 'logged_in' in session:
        itemID = request.form["itemID"]
        item = Inventory.get(Inventory.invID == itemID)

        item.prod_name = request.form["item_name"]
        item.save()
        item.prod_type = request.form["category"]
        item.save()
        item.prod_max_stock = request.form["max_stock"]
        item.save()
        item.prod_code = request.form["item_code"]
        item.save()
        item.prod_price = request.form["price"]
        item.save()
    return redirect(url_for("dashboard", subdir="products"))


""" Restock Product POST Route """
@app.route("/restock_product", methods=["POST"])
def restock_product():
    if 'logged_in' in session:
        req = request.get_json()
        itemID = req['item_id']

        item = Inventory.get(Inventory.invID == itemID)
        item.prod_stock = item.prod_stock + req['stock']
        item.save()
        return jsonify({ 'status': 'success', 'url': url_for('dashboard', subdir='products')})


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
        req = request.get_json()
        user = User.get(User.uID == req['uID'])

        data = dict(
            firstname = user.firstname,
            lastname = user.lastname,
            username = user.username,
            join_date = user.join_date,
            gender = user.sex
        )

        return jsonify(data)


""" Create User POST Route """
@app.route("/new_user", methods=["POST"])
def create_user():
    if 'logged_in' in session:
        req = request.get_json()

        try:
            with db.transaction():
                user_data = dict(
                    firstname = req['firstname'],
                    lastname = req['lastname'],
                    username = req['username'],
                    password = req['password'],
                    sex = req['gender'],
                    role = req['role'],
                )

                user_auth.create_user(**user_data)
                success_data = dict(status = 'success', url = url_for('dashboard', subdir='users'))
                return jsonify(success_data)
        except IntegrityError:
            return jsonify({'status': "fail", 'error': 'Username already taken'})


""" Update User POST Route """
@app.route("/update_user", methods=["POST"])
def update_user():
    if 'logged_in' in session:
        req = request.get_json()
        user_id = req['user_id']
        user = User.get(User.uID == user_id)

        firstname = req['firstname']
        lastname = req['lastname']
        username = req['username']
        password = req['password']
        sex = req['gender']
        role = req['role']

        try:
            with db.transaction():
                user.firstname = firstname
                user.save()
                user.lastname = lastname
                user.save()
                user.username = username
                user.save()
                user.sex = sex
                user.save()
                if bool(password):
                    user.password = user_auth.gen_hash(password)
                    user.save()
                if bool(role):
                    user.role = "Admin" if role == 1 else "Basic Member"
                    user.save()

                return jsonify({'status':'success', 'url': url_for('dashboard', subdir='users')})
        except IntegrityError:
            return jsonify({'status': 'fail', 'error': 'Username already taken'})


""" Remove User POST Route """
@app.route("/remove_user", methods=["POST"])
def remove_user():
    if 'logged_in' in session:
        req    = request.get_json()
        username = session['client_name']
        password = req['auth_pass']

        if user_auth.valid(username, password):
            user_id = req['user_id']
            User.delete().where(User.uID == user_id).execute()
            return jsonify({'status': 'success', 'url': url_for('dashboard', subdir='users')})
        else:
            return jsonify({'status': "fail", 'error': 'Invalid Password'})


""" Logout Route """
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
