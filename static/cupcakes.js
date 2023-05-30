class Cupcake {
  constructor(flavor, image, size, rating, description, ingredients) {
    this.flavor = flavor;
    this.image = image;
    this.size = size;
    this.rating = rating;
    this.description = description;
    this.ingredients = ingredients;
    this.id;
  }

  getRatingStars() {
    let starString = "☆☆☆☆☆";
    let index = 0;
    for (let i = 0; i < this.rating; i++) {
      starString = starString.replace(starString[index], "★");
      index++;
    }
    return starString;
  }

  getIngredientString() {
    let ingredientString = "";
    for (let ingredient of this.ingredients) {
      ingredientString += ingredient.replaceAll("-", " ") + ", ";
    }
    return ingredientString.slice(0, -2);
  }
}

//-----------Views for cupcakes-----------//

class CupcakeView {
  constructor() {
    this.$formCloseBtn = $("#form-close");
    this.$cakeList = $("#cupcake-list");
    this.$cakePage = $("#cake-page");
    this.$cupcakeBtn = $("#cupcake-btn");
    this.$cakeListCloseBtn = $("#cake-list-close");
    this.$clearFormBtn = $("#clear-form");
    this.$cupcakeIcon = $("#cupcake-icon");
    this.$notification = $("#notification");
    this.$spinner = $("#spinner");
    this.$contentSpinner = $("#content-spinner");
    this.$mainImage = $("#cupcake-home");
    this.$noCakesMessage = $("#no-cupcakes-message");
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
      class: "card-img-top img-thumbnail img-responsive list-image",
      src: cake.image,
      id: cake.id,
    });
    const $cardBody = $("<div>").attr({ class: "card-body" });
    const $cardTitle = $("<h5>")
      .attr({ class: "card-title text-center" })
      .text(cake.flavor);
    const $cardSubtitle = $("<h6>")
      .attr({ class: "card-subtitle text-center text-body-secondary" })
      .text(`${cake.rating}★'s`);
    this.$cakeList.append(
      $col.append(
        $card.append($cardImg, $cardBody.append($cardTitle, $cardSubtitle))
      )
    );
  }

  toggleSearchSpinner() {
    this.$spinner.toggle();
  }

  toggleMainImage() {
    this.$mainImage.fadeToggle();
  }

  toggleContentSpinner() {
    this.$contentSpinner.toggle();
  }

  showNoCakesMessage() {
    this.$noCakesMessage.show();
  }

  hideNoCakesMessage() {
    this.$noCakesMessage.hide();
  }

  makeCakeCard(cake) {
    const $card = $("<div>").attr({ class: "card main-card" });
    const $cardImg = $("<img>").attr({
      class: "card-img-top main-card-image img-responsive rounded mx-auto",
      src: cake.image,
    });
    const $cardBody = $("<div>").attr({ class: "card-body" });
    const $cardTitle = $("<h5>")
      .attr({ class: "card-title" })
      .text(cake.flavor);
    const $cardSubtitle = $("<h6>")
      .attr({ class: "card-subtitle mb-2 text-body-secondary" })
      .text(`Rating: ${cake.getRatingStars()}`);
    const $cardText = $("<p>").text(cake.description);
    const $cardFooter = $("<div>")
      .attr({ class: "card-footer pb-1 text-start text-body-secondary" })
      .text(`Ingredients: ${cake.getIngredientString()}`);
    const $editBtn = $("<button>")
      .attr({
        type: "button",
        "data-bs-toggle": "modal",
        "data-bs-target": "#edit-modal",
        class: "btn btn-link edit-button",
        data: cake.id,
        id: "edit-btn",
      })
      .text("Edit");
    const $newCard = $card.append(
      $cardImg,
      $cardBody.append($cardTitle, $cardSubtitle, $cardText),
      $cardFooter.append($editBtn)
    );
    return $newCard;
  }

  initCakePage(cake) {
    if (this.$cakePage.is(":visible")) {
      this.$cakePage.fadeToggle();
    }
    setTimeout(() => {
      this.$cakePage.empty();
      const $cakeCard = this.makeCakeCard(cake);
      this.$cakePage.append($cakeCard);
      this.$cakePage.fadeToggle();
    }, 500);
  }
}

//-----------Model for cupcakes-----------//

class CupcakeModel {
  constructor() {
    this.$form = $("#create-cupcake-form");
    this.$search = $("#search-input");
    this.$editForm = $("#edit-cupcake-form");
    this.$saveChangesBtn = $("#edit-save-btn");
    this.$editFlavor = $("#edit-flavor");
    this.$editImage = $("#edit-image");
    this.$editSize = $("#edit-size");
    this.$editDescription = $("#edit-description");
    this.$cakeList = $("#cupcake-list");
    this.$flavorSearch = $("#flavor-search");
  }

  populateEditForm(cake) {
    this.$editForm.find("#edit-flavor").val(cake.flavor);
    this.$editForm.find("#edit-image").val(cake.image);
    this.$editForm.find("#edit-size").val(cake.size);
    this.$editForm.find("#edit-description").val(cake.description);
    this.$editForm.find(`#edit-rating-${cake.rating}`).prop("checked", true);
  }

  clearForm() {
    this.$form.trigger("reset");
    this.$editForm.trigger("reset");
  }

  getCakeValues(target) {
    return {
      flavor: this.formatCakeFlavor(
        $(`#${target}-cupcake-form`).find(`#${target}-flavor`).val()
      ),
      image: $(`#${target}-cupcake-form`).find(`#${target}-image`).val(),
      size: $(`#${target}-cupcake-form`).find(`#${target}-size`).val(),
      rating: Number($(`input[name="${target}-rating"]:checked`).val()),
      ingredients: this.makeIngredientList(target),
      description: $(`#${target}-cupcake-form`)
        .find(`#${target}-description`)
        .val(),
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
      description: cake.description,
      ingredients: cake.ingredients,
    });
    cake.image = newCakeResponse.data.cupcake.image;
    cake.id = newCakeResponse.data.cupcake.id;
  }
  async updateCake(cake) {
    const updatedCakeResponse = await axios.patch(`/api/cupcakes/${cake.id}`, {
      flavor: cake.flavor,
      image: cake.image,
      size: cake.size,
      rating: cake.rating,
      description: cake.description,
      ingredients: cake.ingredients,
    });
    cake.image = updatedCakeResponse.data.cupcake.image;
    cake.id = updatedCakeResponse.data.cupcake.id;
  }

  makeIngredientList(target) {
    let ingredients = [];
    $(`#${target}-ingredients-list :checked`).each(function () {
      ingredients.push($(this).val());
    });
    return ingredients;
  }

  async getAllCakes() {
    const cakes = await axios.get("/api/cupcakes");
    return cakes.data.cupcakes;
  }

  async getCakesByFlavor(flavor) {
    const cakes = await axios.get(`/api/cupcakes/flavor/${flavor}`);
    return cakes.data.cupcakes;
  }

  async getCakeById(id) {
    const cakeResponse = await axios.get(`/api/cupcakes/${id}`);
    const cakeData = cakeResponse.data.cupcake;
    const cake = new Cupcake(
      cakeData.flavor,
      cakeData.image,
      cakeData.size,
      cakeData.rating,
      cakeData.description,
      cakeData.ingredients
    );
    cake.id = cakeData.id;
    return cake;
  }
}

//-----------Model for ingredients-----------//

class IngredientsModel {
  constructor() {
    this.baseUrl = "/api";
    this.$form = $("#create-ingredients-form");
    this.$input = $("#create-ingredients-input");
    this.$editForm = $("#edit-ingredients-form");
    this.$editInput = $("#edit-ingredients-input");
  }

  getFormattedIngredient(ingInput) {
    return ingInput.toLowerCase().split(" ").join("-");
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

//-----------Views for ingredients-----------//

class IngredientsView {
  constructor() {
    this.$ingsList = $("#create-ingredients-list");
    this.$editIngsList = $("#edit-ingredients-list");
  }

  checkExists(ingredient) {
    if (
      $(`#create-ing_${ingredient}`).length ||
      $(`#edit-ing_${ingredient}`).length
    ) {
      return true;
    }
    return false;
  }

  clearForm(target) {
    $(`#${target}-ingredients-input`).val("");
  }

  resetIngs() {
    $(`#create-ingredients-list :checked`).each(function () {
      $(this).prop("checked", false);
    });
  }

  toggleIng(ingredient, target) {
    const $ing = $(`#${target}-ing_${ingredient}`);
    if ($ing.prop("checked") == true) {
      $ing.prop("checked", false);
    } else {
      $ing.prop("checked", true);
    }
  }

  renderAllIngs(ingredients, target) {
    if (target == "create") {
      this.$ingsList.empty();
    } else {
      this.$editIngsList.empty();
    }
    for (const ingredient of ingredients) {
      this.renderIng(ingredient.ingredient_name, target);
      this.toggleIng(ingredient.ingredient_name, target);
    }
  }

  renderIng(ingredient, target) {
    const $newCol = $("<div>").attr({ class: "col mb-1 py-o pe-1 ps-0" });
    const $newIngBtn = $("<input>").attr({
      form: "cupcake-form",
      value: ingredient,
      type: "checkbox",
      class: "btn-check",
      id: `${target}-ing_${ingredient}`,
      autocomplete: "off",
      name: "ingredients",
      checked: true,
    });
    const $newIngLbl = $("<label>")
      .attr({
        for: `${target}-ing_${ingredient}`,
        class:
          "btn pt-0 pb-0 pr-1 pl-1 btn-sm rounded-pill btn-outline-primary",
      })
      .text(`${ingredient}`);
    $newCol.append($newIngBtn, $newIngLbl);
    if (target == "create") {
      this.$ingsList.append($newCol);
    } else {
      this.$editIngsList.append($newCol);
    }
  }
}

//-----------Controller-----------//

class Controller {
  constructor(cupcakeView, cupcakeModel, ingModel, ingView) {
    this.cupcakeView = cupcakeView;
    this.cupcakeModel = cupcakeModel;
    this.ingModel = ingModel;
    this.ingView = ingView;

    this.initList();
    this.initIngs("create");
    this.initIngs("edit");

    this.ingModel.$form.on("submit", this.handleIngSubmit.bind(this));
    this.ingModel.$editForm.on("submit", this.handleIngSubmit.bind(this));
    this.cupcakeModel.$form.on(
      "submit",
      this.handleCupcakeFormSubmit.bind(this)
    );
    this.cupcakeModel.$editForm.on(
      "submit",
      this.handleCupcakeFormSubmit.bind(this)
    );
    this.cupcakeView.$clearFormBtn.click(() => this.handleFormReset());
    this.cupcakeModel.$search.on("keyup", this.handleSearchKeyup.bind(this));
    this.cupcakeView.$cakeList.on("click", this.handleCupcakeClick.bind(this));
    this.cupcakeModel.$saveChangesBtn.on(
      "click",
      this.handleCupcakeFormSubmit.bind(this)
    );
    this.cupcakeModel.$flavorSearch.on(
      "submit",
      this.handleFlavorSubmit.bind(this)
    );
  }
  async handleSaveChanges(event) {
    const source = "edit";
    await this.handleCupcakeSubmit(source);
  }

  async handleCupcakeFormSubmit(event) {
    event.preventDefault();
    let source;
    if (event.target.id == "create-cupcake-form") {
      source = "create";
    } else {
      source = "edit";
    }

    await this.handleCupcakeSubmit(source);
  }

  async handleFlavorSubmit(event) {
    event.preventDefault();
    const input = this.cupcakeModel.$search.val().toLowerCase();
    console.log(input);
    this.handleSearch(input);
  }

  async handleSearch(value) {
    if (value == "") {
      this.initList();
    } else {
      this.cupcakeView.hideNoCakesMessage();
      if (!this.cupcakeView.$spinner.is(":visible")) {
        this.cupcakeView.toggleSearchSpinner();
      }
      const cakes = await this.cupcakeModel.getCakesByFlavor(value);
      this.cupcakeView.toggleSearchSpinner();
      if (cakes.length == 0) {
        this.cupcakeView.showNoCakesMessage();
      }
      this.cupcakeView.renderAllCakes(cakes);
    }
  }
  handleFormReset() {
    this.cupcakeModel.clearForm();
    this.ingView.resetIngs();
  }

  async handleCupcakeClick(event) {
    if ($(event.target).hasClass("img-thumbnail")) {
      if (this.cupcakeView.$mainImage.is(":visible")) {
        this.cupcakeView.toggleMainImage();
      }
      const cake = await this.cupcakeModel.getCakeById(
        $(event.target).attr("id")
      );
      this.cupcakeView.initCakePage(cake);
      this.cupcakeModel.populateEditForm(cake);
      for (const ing of cake.ingredients) {
        this.ingView.toggleIng(ing, "edit");
      }
      this.cupcakeView.closeList();
    }
  }

  async handleSearchKeyup(event) {
    const value = event.target.value.toLowerCase();
    this.handleSearch(value);
  }

  async handleCupcakeSubmit(target) {
    const cakeValues = this.cupcakeModel.getCakeValues(target);
    console.log(cakeValues);
    const newCake = new Cupcake(
      cakeValues["flavor"],
      cakeValues["image"],
      cakeValues["size"],
      cakeValues["rating"],
      cakeValues["description"],
      cakeValues["ingredients"]
    );
    if (target == "create") {
      await this.cupcakeModel.addCake(newCake);
      this.cupcakeView.renderCakeInList(newCake);
      this.handleFormReset();
      this.cupcakeView.closeForm();
      this.cupcakeView.animateIcon();
      this.cupcakeView.popNotification();
    } else {
      await this.cupcakeModel.updateCake(newCake);
      this.cupcakeView.initCakePage(newCake);
      this.cupcakeModel.populateEditForm(newCake);
      for (const ing of newCake.ingredients) {
        this.ingView.toggleIng(ing, target);
      }
    }
  }

  async handleIngSubmit(event) {
    event.preventDefault();
    let source;
    let ingredient;
    if (event.target.id == "create-ingredients-form") {
      ingredient = this.ingModel.getFormattedIngredient(
        this.ingModel.$input.val()
      );
      source = "create";
    } else {
      ingredient = this.ingModel.getFormattedIngredient(
        this.ingModel.$editInput.val()
      );
      source = "edit";
    }
    if (this.ingView.checkExists(ingredient)) {
      this.ingView.toggleIng(ingredient, source);
    } else {
      try {
        await this.ingModel.addIngredient(ingredient);
      } catch (error) {
        console.log(error);
      }
      this.ingView.renderIng(ingredient, source);
    }
    this.ingView.clearForm(source);
  }

  async initList() {
    this.cupcakeView.hideNoCakesMessage();

    const cakes = await this.cupcakeModel.getAllCakes();
    this.cupcakeView.renderAllCakes(cakes);
  }

  async initIngs(target) {
    this.cupcakeModel.clearForm();
    const ings = await this.ingModel.getIngs();
    this.ingView.renderAllIngs(ings, target);
  }
}

new Controller(
  new CupcakeView(),
  new CupcakeModel(),
  new IngredientsModel(),
  new IngredientsView()
);
