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
ing7 = Ingredient(ingredient_name="pickles")
ing8 = Ingredient(ingredient_name="pickle-juice")

c1 = Cupcake(
    flavor="Cherry",
    size="big",
    rating=5,
    ingredients=[ing1, ing2],
    description="A cupcake made from cherries and chocolate.",
)


c2 = Cupcake(
    flavor="Chocolate",
    size="mini",
    rating=5,
    ingredients=[ing1, ing2],
    description="A cupcake made from cherries and chocolate with a rich and moist sponge. Perfect for any birthday party.",
    image="https://www.bakedbyrachel.com/wp-content/uploads/2018/01/chocolatecupcakesccfrosting1_bakedbyrachel.jpg",
)

c3 = Cupcake(
    flavor="Vanilla",
    size="regular",
    rating=4,
    ingredients=[ing3, ing4],
    description="A cupcake made from vanilla and strawberries. Don't be fooled, though. I put a few drops of lsd in it. This should be fun.",
    image="https://www.curlyscooking.co.uk/wp-content/uploads/2021/02/Vanilla-Cupcakes-12-scaled.jpg",
)

c4 = Cupcake(
    flavor="Pickle",
    size="big",
    rating=1,
    ingredients=[ing5, ing6, ing7, ing8],
    description="A disgusting cupcake made from pickles and pickle-juice. Perfect for ruining any party or if you want to be remembered as 'that one guy who brought pickle cupcakes to that party that one time'. These taste as gross as you'd expect.",
    image="https://hips.hearstapps.com/del.h-cdn.co/assets/17/42/1508537549-delish-pickle-cupcakes-pinterest-still001.jpg?resize=980:*",
)

with app.app_context():
    db.session.add_all([c1, c2, ing1, ing2, ing3, ing4, ing5, ing6, ing7, ing8, c4])
    db.session.commit()
