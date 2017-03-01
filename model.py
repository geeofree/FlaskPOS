from peewee import *

db = MySQLDatabase(user='jccadmin', passwd='bik3sh0p', database="bikeshopdb_dev")


class BaseModel(Model):
    class Meta:
        database = db


class User(BaseModel):
    uID      = PrimaryKeyField()
    username = CharField()
    password = TextField()
    fullname = CharField()
    role     = IntegerField()


class Inventory(BaseModel):
    invID     = PrimaryKeyField()
    prod_name = TextField()
    prod_type = CharField()
    stock     = IntegerField()
    prod_code = CharField()


class User_Log(BaseModel):
    ulogID   = PrimaryKeyField()
    date    = DateField(formats="%m-%d-%Y")
    timein  = TimeField(formats="%H:%M:%S")
    timeout = TimeField(formats="%H:%M:%S")
    user    = ForeignKeyField(User, related_name="person")


class Sales_Log(BaseModel):
    slogID    = PrimaryKeyField()
    cashier   = ForeignKeyField(User, related_name="cashier")
    product   = ForeignKeyField(Inventory, related_name="product")
    date_sold = DateField(formats="%m-%d-%Y")



def init_db():
    db.connect()
    db.create_tables([User, Inventory, User_Log, Sales_Log], True)
