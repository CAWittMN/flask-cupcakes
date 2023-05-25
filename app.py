"""Flask app for Cupcakes"""

from flask import Flask, jsonify, request, render_template
from models import Cupcake, Ingredient, db, connect_db


app = Flask(__name__)

app.config["SECRET_KEY"] = "secretcupcakes"
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///cupcakes"
app.config["SQLALCHEMY_ECHO"] = True
app.config["SQLALCHEMY_TB_INTERCEPT_REDIRECTS"] = False


connect_db(app)

with app.app_context():
    db.create_all()


@app.route("/")
def root():
    """render home page"""
    return render_template("index.html")


@app.route("/api/cupcakes")
def get_all_cupcakes():
    """get all cupcakes"""

    cupcakes = [cupcake.to_dict() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes=cupcakes)


@app.route("/api/cupcakes/<flavor>")
def get_cupcakes_by_flavor(flavor):
    """get cupcakes by flavor"""
    cupcakes = [
        cupcake.to_dict()
        for cupcake in Cupcake.query.filter(Cupcake.flavor.ilike(f"%{flavor}%")).all()
    ]
    return jsonify(cupcakes=cupcakes)


@app.route("/api/cupcakes/", methods=["POST"])
def create_cupcake():
    """create new cupcake"""
    data = request.json
    ingredients_list = data["ingredients"]
    ingredients = Ingredient.query.filter(
        Ingredient.ingredient_name.in_(ingredients_list)
    ).all()
    new_cupcake = Cupcake(
        flavor=data["flavor"],
        size=data["size"],
        rating=data["rating"],
        image=data["image"] or None,
        ingredients=ingredients,
    )
    db.session.add(new_cupcake)
    db.session.commit()
    return (jsonify(cupcake=new_cupcake.to_dict()), 201)


@app.route("/api/cupcakes/<int:id>")
def get_cupcake_by_id(id):
    """get cupcake by id"""

    cupcake = Cupcake.query.get_or_404(id)
    return jsonify(cupcake=cupcake.to_dict())


@app.route("/api/cupcakes/<int:id>", methods=["PATCH"])
def update_cupcake_by_id(id):
    data = request.json
    cupcake = Cupcake.query.get_or_404(id)

    cupcake.flavor = data["flavor"]
    cupcake.size = data["size"]
    cupcake.rating = data["rating"]
    cupcake.image = data["image"]

    db.session.add(cupcake)
    db.session.commit()
    return jsonify(cupcake=cupcake.to_dict())


@app.route("/api/cupcakes/<int:id>", methods=["DELETE"])
def delete_cupcake_by_id(id):
    cupcake = Cupcake.query.get_or_404(id)
    db.session.delete(cupcake)
    db.session.commit()
    return (jsonify(message="Cupcake deleted."), 200)


@app.route("/api/ingredients", methods=["get"])
def get_all_ingredients():
    ingredients = [ingredient.to_dict() for ingredient in Ingredient.query.all()]
    return jsonify(ingredients=ingredients)


@app.route("/api/ingredients", methods=["POST"])
def create_ingredient():
    """create new ingredient"""
    data = request.json
    ingredient = Ingredient(ingredient_name=data["ingredient"])
    db.session.add(ingredient)
    db.session.commit()
    return (jsonify(ingredient=ingredient.to_dict()), 201)
