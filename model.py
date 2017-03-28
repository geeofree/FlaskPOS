from peewee import *
from getpass import getpass
from datetime import datetime


db = MySQLDatabase(user='jccadmin', passwd='bik3sh0p', database="bikeshopdb_dev")

""" Database Table Base Model """
class BaseModel(Model):
    class Meta:
        database = db

""" User Table """
class User(BaseModel):
    uID        = PrimaryKeyField()
    username   = CharField(unique=True)
    password   = CharField()
    firstname  = CharField(max_length=20)
    lastname   = CharField(max_length=20)
    sex        = CharField()
    role       = CharField()
    join_date  = DateField(formats="%m-%d-%Y")

""" Inventory Table """
class Inventory(BaseModel):
    invID          = PrimaryKeyField()
    prod_code      = CharField(max_length=11)
    prod_name      = CharField(max_length=65)
    prod_type      = CharField(max_length=20)
    prod_stock     = IntegerField()
    prod_max_stock = IntegerField()
    prod_price     = IntegerField()

""" Transactions Table """
class Transactions(BaseModel):
    transID   = PrimaryKeyField()
    retailer  = CharField()
    totalqty  = IntegerField()
    payment   = IntegerField()
    change    = IntegerField()
    subtotal  = IntegerField()
    date_sold = DateField(formats="%m-%d-%Y")

""" Items Sold Table """
class Items_Sold(BaseModel):
    saleID    = PrimaryKeyField()
    transID   = ForeignKeyField(Transactions, related_name="transaction", to_field="transID")
    item      = CharField()
    qty       = IntegerField()
    linetotal = IntegerField()


""" INIT DB """
def init_db():
    db.connect()
    db.create_tables([User, Inventory, Transactions, Items_Sold], True)





""" User Authentication CLASS """
class UserAuth:
    def __init__(self, encrypt_lib):
        self.gen_hash  = encrypt_lib.generate_password_hash
        self.checkpass = encrypt_lib.check_password_hash

    """ Login Authentication """
    def valid(self, username, password):
        try:
            user   = User.get(User.username == username)
            hashed = user.password
            if self.checkpass(hashed, password):
                return True
        except User.DoesNotExist:
            return False

    """ Create User """
    def create_user(self, **user):
        user_role = user.get('role')

        if user_role == 0:
            user_role = "Super Admin"
        elif user_role == 1:
            user_role = "Admin"
        elif user_role == 2:
            user_role = "Basic Member"

        print(user_role)

        new_user = dict(
            firstname  = user.get('firstname'),
            lastname   = user.get('lastname'),
            username   = user.get('username'),
            sex        = user.get('sex'),
            password   = self.gen_hash(user.get('password')),
            role       = user_role,
            join_date  = datetime.now().date(),
        )

        User.create(**new_user)



""" User Init """
def user_init(UserAuthObj):
    users = [user for user in User.select()]

    if not users:
        user = dict(
                firstname = input("Firstname: "),
                lastname  = input("Lastname: "),
                sex       = "Male",
                username  = input("What should your username be?\n"),
                password  = getpass("Enter desired password\n"),
                role      = 0
            )

        UserAuthObj.create_user(**user)
