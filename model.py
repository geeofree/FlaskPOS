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
    username   = CharField(max_length=20, unique=True)
    password   = CharField()
    firstname  = CharField(max_length=25)
    lastname   = CharField(max_length=25)
    role       = CharField()
    online     = IntegerField()
    employee   = IntegerField()
    join_date  = DateField(formats="%m-%d-%Y")
    last_login = DateTimeField(formats="%m-%d-%Y %H:%M", null=True)

""" Inventory Table """
class Inventory(BaseModel):
    invID          = PrimaryKeyField()
    prod_code      = CharField(max_length=11)
    prod_name      = CharField(max_length=65)
    prod_type      = CharField(max_length=25)
    prod_stock     = IntegerField()
    prod_max_stock = IntegerField()
    prod_price     = IntegerField()

""" Sales Log Table """
class Sales_Log(BaseModel):
    slogID      = PrimaryKeyField()
    cashier     = ForeignKeyField(User, related_name="person")
    product     = ForeignKeyField(Inventory, related_name="item")
    product_qty = IntegerField()
    line_total  = IntegerField()
    date_sold   = DateField(formats="%m-%d-%Y")




""" INIT DB """
def init_db():
    db.connect()
    db.create_tables([User, Inventory, Sales_Log], True)





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
                user.online = 1
                user.save()
                user.last_login = datetime.now()
                user.save()
                return True
        except User.DoesNotExist:
            return False

    """ Create User """
    def create_user(self, **user):
        new_user = dict(
            firstname  = user.get('firstname'),
            lastname   = user.get('lastname'),
            username   = user.get('username'),
            password   = self.gen_hash(user.get('password')),
            role       = "Admin" if user.get('role') else "Basic Staff Member",
            online     = 0,
            employee   = 1,
            join_date  = datetime.now().date(),
            last_login = None
        )

        User.create(**new_user)



""" User Init """
def user_init(UserAuthObj):
    users = [user for user in User.select()]

    if not users:
        user = dict(
                firstname = input("Firstname: "),
                lastname  = input("Lastname: "),
                username  = input("Username: "),
                password  = getpass("Password: "),
                role      = 1
            )

        UserAuthObj.create_user(**user)
