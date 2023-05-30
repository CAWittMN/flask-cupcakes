from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


DEFAULT_URL = "https://tinyurl.com/demo-cupcake"


"""Models for Cupcake app."""


class Ingredient(db.Model):
    """Model for Ingredients"""

    __tablename__ = "ingredients"

    def __repr__(self):
        return f"""{self.ingredient_name}"""

    id = db.Column(db.Integer, primary_key=True)
    ingredient_name = db.Column(db.String(20), nullable=False, unique=True)
    cupcakes = db.relationship("Cupcake", secondary="recipes", backref="ingredients")

    def to_dict(self):
        return {
            "id": self.id,
            "ingredient_name": self.ingredient_name,
        }


class Cupcake(db.Model):
    """Model for Cupcakes"""

    def __repr__(self):
        return f"""flavor = {self.flavor}
        size = {self.size}
        rating = {self.rating}
        ingredients = {self.ingredients}"""

    __tablename__ = "cupcakes"

    id = db.Column(db.Integer, primary_key=True)
    flavor = db.Column(db.String(20), nullable=False)
    size = db.Column(db.String, nullable=False, default="regular")
    rating = db.Column(db.Float, nullable=False, default=0)
    image = db.Column(db.String, nullable=False, default=DEFAULT_URL)
    description = db.Column(db.String, nullable=False)

    def to_dict(self):
        ingredients_list = [
            ingredient.ingredient_name for ingredient in self.ingredients
        ]
        return {
            "id": self.id,
            "flavor": self.flavor,
            "size": self.size,
            "rating": self.rating,
            "image": self.image,
            "description": self.description,
            "ingredients": ingredients_list,
        }


class Recipe(db.Model):
    """Model for Recipes"""

    __tablename__ = "recipes"
    cupcake_id = db.Column(db.Integer, db.ForeignKey("cupcakes.id"), primary_key=True)
    ingredient_id = db.Column(
        db.Integer, db.ForeignKey("ingredients.id"), primary_key=True
    )


def connect_db(app):
    db.init_app(app)
