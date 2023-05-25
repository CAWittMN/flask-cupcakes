from app import app
from models import db, Cupcake, Ingredient, Recipe

with app.app_context():
    db.drop_all()
    db.create_all()
ing1 = Ingredient(ingredient_name="cherries")
ing2 = Ingredient(ingredient_name="chocolate")
ing3 = Ingredient(ingredient_name="vanilla")
ing4 = Ingredient(ingredient_name="strawberries")
ing5 = Ingredient(ingredient_name="flour")
ing6 = Ingredient(ingredient_name="sugar")

c1 = Cupcake(
    flavor="cherry",
    size="big",
    rating=5,
    ingredients=[ing1, ing2],
)

c2 = Cupcake(
    flavor="chocolate",
    size="mini",
    rating=9,
    ingredients=[ing1, ing2],
    image="https://www.bakedbyrachel.com/wp-content/uploads/2018/01/chocolatecupcakesccfrosting1_bakedbyrachel.jpg",
)

c2 = Cupcake(
    flavor="vanilla",
    size="regular",
    rating=4,
    ingredients=[ing3, ing4],
    image="https://www.bakedbyrachel.com/wp-content/uploads/2018/01/vanillacupcakesccfrosting1_bakedbyrachel.jpg",
)


with app.app_context():
    db.session.add_all([c1, c2, ing1, ing2, ing3, ing4, ing5, ing6])
    db.session.commit()
