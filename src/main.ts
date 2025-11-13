import "./scss/styles.scss";
import { Сatalog } from "./components/Models/catalog";
import { Basket } from "./components/Models/basket";
import { Buyer } from "./components/Models/buyer";
import { apiProducts } from "./utils/data";
import { ApiConnect } from "./components/Models/apiConnect";
import { API_URL } from "./utils/constants";
import { IInfoCheckToBuy } from "./types";

const productsModel = new Сatalog();

productsModel.allProducts = apiProducts.items;
productsModel.detailedProduct = apiProducts.items[1];

console.log(`Массив товаров из каталога: `, productsModel.allProducts);
console.log(`выбранный товарв из каталога: `, productsModel.detailedProduct);
console.log(`выбранный товар по ID: `, productsModel.getProductById(apiProducts.items[2].id));

const basketModel = new Basket();

basketModel.addToBuyList(apiProducts.items[1]);
basketModel.addToBuyList(apiProducts.items[2]);
basketModel.addToBuyList(apiProducts.items[3]);

basketModel.removeToBuyList(apiProducts.items[2]);

console.log(`Массив товаров в корзине: `, basketModel.getListOfProductsToBuy);
console.log(`Цена заказа: `, basketModel.priseToPay);
console.log(`Всего товаров в корзине: `, basketModel.productCounter);
console.log(
    `Товар с ID ${apiProducts.items[1].id} есть в корзине: `,
    basketModel.checkProductById(apiProducts.items[1].id)
);
console.log(
    `Товар с ID ${apiProducts.items[2].id} есть в корзине: `,
    basketModel.checkProductById(apiProducts.items[2].id)
);
basketModel.clearToBuyList();
console.log(`Всего товаров в корзине после сброса: `, basketModel.productCounter);

const iAmBuyer = new Buyer();

console.log(`Обьект проверки данных до ввода данных: `, iAmBuyer.validate());
iAmBuyer.setValue("payment", "card");
iAmBuyer.setValue("email", "email");
console.log(`Обьект проверки данных после ввода части данных: `, iAmBuyer.validate());
iAmBuyer.setValue("phone", "35555555");
iAmBuyer.setValue("address", "Непал");
console.log(`Обьект проверки данных после ввода всех данных: `, iAmBuyer.validate());
console.log(`Получение данных: `, iAmBuyer.getAllData());
iAmBuyer.clearAllData();
console.log(`Получение данных после сброса: `, iAmBuyer.getAllData());
console.log(`Обьект проверки данных после сброса всех данных: `, iAmBuyer.validate());

const ApiItems = new ApiConnect(API_URL);

ApiItems.getProduct()
    .then((res) => (productsModel.allProducts = res))
    .then(() => console.log(`Массив товаров из онлайн каталога: `, productsModel.allProducts));
