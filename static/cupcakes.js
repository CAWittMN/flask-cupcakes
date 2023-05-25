class Cupcake {
  constructor(flavor, image, size, rating, ingredients) {
    this.flavor = flavor;
    this.image = image;
    this.size = size;
    this.rating = rating;
    this.ingredients = ingredients;
    this.id;
  }
}

class CupcakeView {
  constructor() {
    this.$clearFormBtn = $("#clear-form");
    this.$contentContainer = $("#content");
    this.$cakeList = $("#cupcake-list");
    this.$formCloseBtn = $("#form-close");
    this.$cupcakeBtn = $("#cupcake-btn");
    this.$cakeListCloseBtn = $("#cake-list-close");
    this.$cupcakeIcon = $("#cupcake-icon");
    this.$notification = $("#notification");
    this.$spinner = $("#spinner");
    this.$contentSpinner = $("#content-spinner");
  }

  popNotification() {
    this.$notification.addClass("show").text("Cupcake added!");
    setTimeout(() => {
      this.$notification.removeClass("show");
    }, 3000);
  }

  animateIcon() {
    this.$cupcakeIcon.addClass("fa-bounce");
    const timer = setTimeout(() => {
      this.$cupcakeIcon.removeClass("fa-bounce");
    }, 2000);
  }

  closeForm() {
    this.$formCloseBtn.click();
  }

  closeList() {
    this.$cakeListCloseBtn.click();
  }

  clearForm() {
    const $form = $("#cupcake-form");
    $form.trigger("reset");
  }

  renderAllCakes(cakes) {
    this.$cakeList.empty();
    for (const cake of cakes) {
      this.renderCakeInList(cake);
    }
  }

  renderCakeInList(cake) {
    const $col = $("<div>").attr({
      class: "col-sm-6 mt-3",
    });
    const $card = $("<div>").attr({ class: "card h-100" });
    const $cardImg = $("<img>").attr({
      class: "card-img-top img-thumbnail img-responsive",
      src: cake.image,
      id: cake.id,
    });
    const $cardBody = $("<div>").attr({ class: "card-body" });
    const $cardTitle = $("<p>").text(cake.flavor);
    this.$cakeList.append(
      $col.append($card.append($cardImg, $cardBody.append($cardTitle)))
    );
  }
  async showSearchSpinner() {
    this.$cakeList.empty();
    this.$spinner.show();
  }
  async hideSearchSpinner() {
    this.$spinner.hide();
  }

  showContentSpinner() {
    this.$contentSpinner.show();
  }
  renderCakePage() {}
}

class CupcakeModel {
  constructor() {
    this.$form = $("#cupcake-form");
    this.$search = $("#search-input");
  }

  getCakeValues() {
    return {
      flavor: this.formatCakeFlavor(this.$form.find("#flavor").val()),
      image: this.$form.find("#image").val(),
      size: this.$form.find("#size").val(),
      rating: Number($('input[name="rating"]:checked').val()),
      ingredients: this.makeIngredientList(),
    };
  }

  formatCakeFlavor(flavor) {
    flavor = flavor
      .toLowerCase()
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
    return flavor;
  }

  async addCake(cake) {
    const newCakeResponse = await axios.post("/api/cupcakes", {
      flavor: cake.flavor,
      image: cake.image,
      size: cake.size,
      rating: cake.rating,
      ingredients: cake.ingredients,
    });
    cake.image = newCakeResponse.data.cupcake.image;
    cake.id = newCakeResponse.data.cupcake.id;
  }

  makeIngredientList() {
    let ingredients = [];
    $("#ingredients-list :checked").each(function () {
      ingredients.push($(this).val());
    });
    return ingredients;
  }

  async getAllCakes() {
    const cakes = await axios.get("/api/cupcakes");
    return cakes.data.cupcakes;
  }

  async getCakesByFlavor(flavor) {
    const cakes = await axios.get(`/api/cupcakes/${flavor}`);
    return cakes.data.cupcakes;
  }
  async getCakeById(id) {}
}

class IngredientsModel {
  constructor() {
    this.baseUrl = "/api";
    this.$form = $("#ingredients-form");
    this.$input = $("#ingredients-input");
  }

  getFormattedIngredient() {
    return this.$input.val().toLowerCase().split(" ").join("-");
  }

  async getIngs() {
    const ings = await axios.get(`${this.baseUrl}/ingredients`);
    return ings.data.ingredients;
  }

  async addIngredient(ingredient) {
    const newIng = await axios.post(`${this.baseUrl}/ingredients`, {
      ingredient,
    });
  }
}

class IngredientsView {
  constructor() {
    this.$ingsList = $("#ingredients-list");
  }

  checkExists(ingredient) {
    if ($(`#ing_${ingredient}`).length) {
      return true;
    }
    return false;
  }
  clearForm() {
    $("#ingredients-input").val("");
  }

  resetIngs() {
    $("#ingredients-list :checked").each(function () {
      $(this).prop("checked", false);
    });
  }

  toggleIng(ingredient) {
    const $ing = $(`#ing_${ingredient}`);
    if ($ing.prop("checked") == true) {
      $ing.prop("checked", false);
    } else {
      $ing.prop("checked", true);
    }
  }

  renderAllIngs(ingredients) {
    this.$ingsList.empty();
    for (const ingredient of ingredients) {
      this.renderIng(ingredient.ingredient_name);
      this.toggleIng(ingredient.ingredient_name);
    }
  }

  renderIng(ingredient) {
    const $newCol = $("<div>").attr({ class: "col mb-1 py-o pe-1 ps-0" });
    const $newIngBtn = $("<input>").attr({
      form: "cupcake-form",
      value: ingredient,
      type: "checkbox",
      class: "btn-check",
      id: `ing_${ingredient}`,
      autocomplete: "off",
      name: "ingredients",
      checked: true,
    });
    const $newIngLbl = $("<label>")
      .attr({
        for: `ing_${ingredient}`,
        class:
          "btn pt-0 pb-0 pr-1 pl-1 btn-sm rounded-pill btn-outline-primary",
      })
      .text(`${ingredient}`);
    $newCol.append($newIngBtn, $newIngLbl);
    this.$ingsList.append($newCol);
  }
}

class Controller {
  constructor(cupcakeView, cupcakeModel, ingModel, ingView) {
    this.cupcakeView = cupcakeView;
    this.cupcakeModel = cupcakeModel;
    this.ingModel = ingModel;
    this.ingView = ingView;

    this.initPage();

    this.ingModel.$form.on("submit", this.handleIngSubmit.bind(this));
    this.cupcakeModel.$form.on("submit", this.handleCupcakeSubmit.bind(this));
    this.cupcakeView.$clearFormBtn.click(() => this.handleFormReset());
    this.cupcakeModel.$search.on("keyup", this.handleSearchKeyup.bind(this));
    this.cupcakeView.$cakeList.on("click", this.handleCupcakeClick.bind(this));
  }

  handleFormReset() {
    this.cupcakeView.clearForm();
    this.ingView.resetIngs();
  }
  async handleCupcakeClick(event) {
    if ($(event.target).hasClass("img-thumbnail")) {
      this.cupcakeView.$contentContainer.empty();
      this.cupcakeView.showContentSpinner();
      const cake = await this.cupcakeModel.getCakeById(
        $(event.target).attr("id")
      );
      this.cupcakeView.hideContentSpinner();
      this.cupcakeView.renderCakePage(cake);
      this.cupcakeView.$listCloseBtn.click(() => this.cupcakeView.closeForm());
    }
  }

  async handleSearchKeyup(event) {
    if (event.target.value == "") {
      this.initPage();
    } else {
      this.cupcakeView.showSearchSpinner();
      const cakes = await this.cupcakeModel.getCakesByFlavor(
        event.target.value
      );
      this.cupcakeView.hideSearchSpinner();
      this.cupcakeView.renderAllCakes(cakes);
    }
  }

  async handleCupcakeSubmit(event) {
    event.preventDefault();
    const cakeValues = this.cupcakeModel.getCakeValues();
    const newCake = new Cupcake(
      cakeValues["flavor"],
      cakeValues["image"],
      cakeValues["size"],
      cakeValues["rating"],
      cakeValues["ingredients"]
    );
    await this.cupcakeModel.addCake(newCake);
    this.cupcakeView.renderCakeInList(newCake);
    this.handleFormReset();
    this.cupcakeView.closeForm();
    this.cupcakeView.animateIcon();
    this.cupcakeView.popNotification();
  }

  async handleIngSubmit(event) {
    event.preventDefault();
    const ingredient = this.ingModel.getFormattedIngredient();
    if (this.ingView.checkExists(ingredient)) {
      this.ingView.toggleIng(ingredient);
    } else {
      try {
        await this.ingModel.addIngredient(ingredient);
      } catch (error) {
        console.log(error);
      }
      this.ingView.renderIng(ingredient);
    }
    this.ingView.clearForm();
  }

  async initPage() {
    this.cupcakeView.clearForm();
    const ings = await this.ingModel.getIngs();
    this.ingView.renderAllIngs(ings);

    const cakes = await this.cupcakeModel.getAllCakes();
    this.cupcakeView.renderAllCakes(cakes);
  }
}

new Controller(
  new CupcakeView(),
  new CupcakeModel(),
  new IngredientsModel(),
  new IngredientsView()
);
