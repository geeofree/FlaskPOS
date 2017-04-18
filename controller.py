from flask import Flask, url_for, request, render_template, redirect, session, abort, jsonify, make_response
from flask_bcrypt import Bcrypt
from peewee import SelectQuery
from model import *
from datetime import datetime, timedelta, date as dt


""" Init Stuff """
app = Flask(__name__)
bcrypt = Bcrypt(app)

""" User Authentication Object"""
user_auth = UserAuth(bcrypt)

""" Key Config """
app.secret_key = '\xb7q3#\xda\xa9\xf6\xa3\x82}\xb4AK'

""" Fetch Reports """
def fetch_report(date_fn):
    trans_query = """
                     SELECT
                        `retailer`,
                        DATE(`date_sold`) AS date_sold,
                        SUM(`subtotal`) AS subtotal,
                        SUM(`totalqty`) AS totalqty
                     FROM
                        `transactions`
                     WHERE
                        {0}(`date_sold`) = {0}(NOW())
                     GROUP BY
                        `retailer`, DATE(`date_sold`)
                     ORDER BY DATE
                        (`date_sold`) ASC;
                   """.format(date_fn)


    if date_fn == 'YEARWEEK':
        trans_query = """
                         SELECT
                            `retailer`,
                            DATE(`date_sold`) AS date_sold,
                            SUM(`subtotal`) AS subtotal,
                            SUM(`totalqty`) AS totalqty
                         FROM
                            `transactions`
                         WHERE
                            {0}(`date_sold`,1) = {0}(NOW(),1)
                         GROUP BY
                            `retailer`, DATE(`date_sold`)
                         ORDER BY DATE
                            (`date_sold`) ASC;
                      """.format(date_fn)
    elif date_fn == 'DAY':
        trans_query = """
                         SELECT
                            `retailer`, `subtotal`, `totalqty`,
                            `date_sold`, `time_sold`
                         FROM
                            `transactions`
                         WHERE
                            {0}(`date_sold`) = {0}(NOW())
                      """.format(date_fn)

    """ Helper Function """
    def get_overall(column):
        sql_query = """
                        SELECT SUM({0})
                        FROM `transactions`
                        WHERE {1}(`date_sold`) = {1}(NOW());
                    """.format(column, date_fn)

        if date_fn == 'YEARWEEK':
            sql_query = """
                            SELECT SUM({0})
                            FROM `transactions`
                            WHERE {1}(`date_sold`,1) = {1}(NOW(),1)
                        """.format(column, date_fn)

        total = db.execute_sql(sql_query).fetchone()[0]
        return total if total else 0

    report = dict(
        summary = dict(
            total_sales = get_overall('subtotal'),
            total_items_sold = get_overall('totalqty')
        ),
        transactions = Transactions.raw(trans_query)
    )
    return report

""" Log Item """
def log_item(item_name, desc, qty):
    log_fields = dict(
        user = session['client_name'],
        description = desc,
        product = item_name,
        qty = qty,
        log_date = datetime.now().date(),
        log_time = datetime.now().time()
    )

    Item_Log.create(**log_fields)

""" Prepend Zeros """
def create_item_code(num, max_len):
    code_val = str(num)
    while len(code_val) < max_len:
        code_val = "0" + code_val

    return code_val

""" Format Time """
def TwelveHourFormat(time_obj):
    return time_obj.strftime("%I:%M %p")

""" Format Date """
def FormatDate(date_obj):
    return date_obj.strftime("%m/%d/%y")

""" Get Week Range """
def WeekRange(date_obj):
    year, week, dow = date_obj.isocalendar()

    if dow == 1:
        start_date = date_obj
    else:
        start_date = date_obj - timedelta(dow - 1)

    end_date = start_date + timedelta(6)

    return (start_date.strftime("%B %d, %Y"), end_date.strftime("%B %d, %Y"))



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

    if 'logged_in' in session and (user_role == "Super Admin" or user_role == "Admin"):
        if subdir and subdir not in ['inventory', 'transactions', 'users', 'reports']:
            abort(404)


        context = dict (
            user = User.get(User.username == session['client_name']),
            products = Inventory.select(),
            current_dir = 'dashboard'
        )

        if subdir == 'inventory':
            categories = set(item.prod_type for item in SelectQuery(Inventory, Inventory.prod_type))
            return render_template("products.html", **context, categories=categories)

        elif subdir == 'transactions':
            try:
                date_obj = dict(
                    cur = (Transactions.select().
                           where(Transactions.date_sold.
                           between(dt.today(), dt.today() + timedelta(days=1)))
                          ),
                    min = Transactions.get(Transactions.transID == 1).date_sold,
                    max = Transactions.select().order_by(Transactions.transID.desc()).get().date_sold
                )
                return render_template("logs.html", **context, date = date_obj)
            except DoesNotExist:
                return render_template("logs.html", **context)

        elif subdir == 'users':
            users = User.select()
            return render_template("users.html", **context, users = users)

        elif subdir == 'reports':
            low_stock_query = """
                                SELECT * FROM `inventory`
                                WHERE `prod_stock` != 0 AND ROUND((`prod_stock` / `prod_max_stock`) * 100) <= 20
                              """

            no_stock_query = 'SELECT * FROM `inventory` WHERE `prod_stock` = 0'
            stock_sum_query = 'SELECT SUM(prod_stock) FROM `inventory`'
            max_stock_sum_query = 'SELECT SUM(prod_max_stock) FROM `inventory`'

            low_stock_items = []
            no_stock_items = []
            [low_stock_items.append(item) for item in Inventory.raw(low_stock_query)]
            [no_stock_items.append(item) for item in Inventory.raw(no_stock_query)]

            reports = dict(
                daily = fetch_report('DAY'),
                weekly = fetch_report('YEARWEEK'),
                monthly = fetch_report('MONTH'),
                low_stock = { 'length': len(low_stock_items), 'items': low_stock_items},
                no_stock = { 'length': len(no_stock_items), 'items': no_stock_items },
                total_stock = db.execute_sql(stock_sum_query).fetchone()[0],
                total_max_stock = db.execute_sql(max_stock_sum_query).fetchone()[0]
            )

            return render_template("reports.html", **context, reports = reports)

        else:
            return render_template("default.html", **context)
    abort(400)


""" Payment POST Route """
@app.route("/payment", methods=["POST"])
def payment():
    req = request.get_json()
    employee   = req['merchant']
    subtotal   = req['subtotal']
    totalqty   = req['totalqty']
    payment    = req['payment']
    change     = req['change']
    items_sold = req['items_sold']

    transaction_data = dict(
        retailer  = employee,
        totalqty  = totalqty,
        subtotal  = subtotal,
        payment   = payment,
        change    = change,
        date_sold = datetime.now().date(),
        time_sold = datetime.now().time()
    )

    transaction = Transactions.create(**transaction_data)

    for item in items_sold:
        product = Inventory.get(Inventory.invID == item['id'])
        product.prod_stock = product.prod_stock - item['qty_sold']
        product.save()

        items_sold_data = dict(
            transID   = transaction,
            item      = product.prod_name,
            qty       = item['qty_sold'],
            linetotal = item['linetotal']
        )

        Items_Sold.create(**items_sold_data)

    response = dict(
        status = 'success',
        url = url_for('receipt', transID=transaction.transID)
    )

    return jsonify(response)


""" Receipt Generator Route """
@app.route("/receipt/<transID>")
def receipt(transID):
    if 'logged_in' in session:
        transaction = (Transactions.select().where(Transactions.transID == transID))
        trans = None

        for column in transaction:
            trans = dict(
                transID = column.transID,
                date_sold = FormatDate(column.date_sold),
                retailer = column.retailer,
                time_sold = TwelveHourFormat(column.time_sold),
                payment = column.payment,
                totalqty = column.totalqty,
                subtotal = column.subtotal,
                change = column.change
            )


        items_sold = (Items_Sold.select()
                        .where(Items_Sold.transID == transID)
                        .join(Transactions))


        if transaction:
            return render_template('receipt.html', transaction=trans, items=items_sold)
        abort(400)
    abort(404)


""" Report Generator Route """
@app.route('/sales_report/<timeframe>')
@app.route('/sales_report/', defaults={'timeframe': ''}, methods=['POST'])
def reports_summary(timeframe):
    if 'logged_in' in session:

        if request.method == 'GET':
            report = dict(summary = None, transactions = [])
            date_issued = datetime.now().strftime("%B %d, %Y")
            week_range = WeekRange(datetime.now())
            current_user = User.get(User.username == session['client_name'])

            if timeframe == 'daily':
                fetch  = fetch_report('DAY')
                title  = 'Daily Sales'
                date_range = date_issued
            elif timeframe == 'weekly':
                fetch  = fetch_report('YEARWEEK')
                title  = 'Weekly Sales'
                date_range = "{0}-{1}".format(week_range[0], week_range[1])
            elif timeframe == 'monthly':
                fetch  = fetch_report('MONTH')
                title  = 'Monthly Sales'
                date_range = datetime.now().strftime("%B, %Y")

            report['summary'] = fetch['summary']
            for transaction in fetch['transactions']:
                trans_data = dict(
                    retailer = transaction.retailer,
                    totalqty = transaction.totalqty,
                    subtotal = transaction.subtotal,
                    date     = FormatDate(transaction.date_sold),
                    time     = TwelveHourFormat(transaction.time_sold) if transaction.time_sold else None
                )
                report['transactions'].append(trans_data)

            header_info = dict(
                title = title,
                date_issued = date_issued,
                date_range = date_range,
                person_name = current_user.firstname + " " + current_user.lastname
            )

            return render_template('summary.html', report = report, header = header_info)

        if request.method == 'POST':
            req = request.get_json()
            timeframe = req['timeframe']
            return jsonify({'url': url_for('reports_summary', timeframe = timeframe)})
    abort(400)


""" Receipt Request POST Route """
@app.route('/receipt_request', methods=['POST'])
def receipt_request():
    if 'logged_in' in session:
        req = request.get_json()
        transID = req['transID']
        items_sold = Items_Sold.select().where(Items_Sold.transID == transID).join(Transactions)
        data = []

        for line_item in items_sold:
            item = {
                'name': line_item.item,
                'qty_sold': line_item.qty,
                'linetotal': line_item.linetotal
            }

            data.append(item)

        return jsonify(data)


""" Transactions Request POST Route """
@app.route("/transaction_req", methods=['POST'])
def transaction_req():
    if 'logged_in' in session:
        req = request.get_json()
        transactions = Transactions.select().where(Transactions.date_sold == req['date'])

        data = []

        for invoice in transactions:
            invoice_data = dict(
                invoice_no = invoice.transID,
                retailer   = invoice.retailer,
                date_sold  = invoice.date_sold,
                time_sold  = invoice.time_sold.strftime("%H:%M:%S"),
                totalqty   = invoice.totalqty,
                subtotal   = invoice.subtotal
            )

            data.append(invoice_data)

        return jsonify(data)


""" Add Product POST Route """
@app.route("/add_product", methods=["POST"])
def add_product():

    if 'logged_in' in session:
        req = request.get_json()
        err_msg = None

        try:
            with db.transaction():
                fields = dict(
                    prod_name       = req['name'],
                    prod_type       = req['type'],
                    prod_price      = req['price'],
                    prod_max_stock  = req['max_stock'],
                    prod_stock      = 0
                )

                item = Inventory.create(**fields)
                item.prod_code = create_item_code(item.invID, 11)
                item.save()
                log_item(req['name'], "New Product", 0)
                return jsonify({'status': 'Add Success!', 'url': url_for('dashboard', subdir='inventory')})

        except IntegrityError:
            err_msg = 'Product Name "{0}" already taken'.format(req['name'])
            return jsonify({'status': 'fail', 'error': err_msg})


""" Edit Product POST Route """
@app.route("/edit_product", methods=["POST"])
def edit_product():
    if 'logged_in' in session:
        req = request.get_json()
        itemID = req["itemID"]
        item = Inventory.get(Inventory.invID == itemID)

        try:
            with db.transaction():
                item.prod_name = req["name"]
                item.save()
                item.prod_type = req["type"]
                item.save()
                item.prod_max_stock = req["max_stock"]
                item.save()
                item.prod_price = req["price"]
                item.save()
                return jsonify({'status': 'Update Success!', 'url': url_for('dashboard', subdir='inventory')})

        except IntegrityError:
            err_msg = 'Product Name "{0}" already taken'.format(req['name'])
            return jsonify({'status': 'fail', 'error': err_msg})


""" Restock Product POST Route """
@app.route("/restock_product", methods=["POST"])
def restock_product():
    if 'logged_in' in session:
        req = request.get_json()
        itemID = req['item_id']

        item = Inventory.get(Inventory.invID == itemID)
        item.prod_stock = item.prod_stock + req['stock']
        item.save()
        log_item(item.prod_name, "Restock", req['stock'])
        return jsonify({ 'status': 'success', 'url': url_for('dashboard', subdir='inventory')})


""" Delete Product POST Route """
@app.route("/del_product", methods=["POST"])
def del_product():
    if 'logged_in' in session:
        req = request.get_json()
        username = session['client_name']
        password = req['client_pass']

        if user_auth.valid(username, password):
            for item_id in req['item_id']:
                Inventory.delete().where(Inventory.invID == item_id).execute()
            return jsonify({'status': 'success', 'url': url_for('dashboard', subdir='inventory')})
        else:
            return jsonify({'status': 'fail', 'error': 'Invalid Password'})

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
