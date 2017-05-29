import React, {Component} from 'react';
import Categories from './components/categories/Categories';
import Products from './components/products/Products';
import api from './apiEndpoints.json';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.saveCategoryApiData = this.saveCategoryApiData.bind(this);
        this.filterProducts = this.filterProducts.bind(this);
        this.allProducts = [];
        this.state = {
            categories: [],
            products: []
        };
    }

    saveCategoryApiData(data) {
        let categories = data.filter(category => !category.hidden);
        this.setState({categories});
    }

    saveProductApiData(data) {
        this.allProducts = data;
        this.setState({products: data});
    }

    componentDidMount() {
        let categories = fetch(api.CATEGORIES_API);
        let products = fetch(api.PRODUCTS_API);

        Promise.all([categories, products])
            .then(response => {
                    let categoryData = response[0],
                        productData = response[1];

                    if (categoryData.status !== 200 || productData.status !== 200) {
                        console.log('Looks like there was a problem.');
                        return;
                    }

                    categoryData.json().then(data => {
                        this.saveCategoryApiData(data.data);
                    });

                    productData.json().then(data => {
                        this.saveProductApiData(data.data);
                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error', err);
            });
    }

    filterProducts(categoryId) {
        let products = this.allProducts.filter(product => {
            let required = false;
            product.categories.forEach(category => {
                required = required || category.id === categoryId;
            });
            return required;
        });
        this.setState({products});
    }

    render() {
        return (
            <div className="app">
                <Categories categoriesData={this.state.categories}
                            clickHandler={this.filterProducts}/>
                <input type="text"/>
                <Products productsData={this.state.products}/>
            </div>
        );
    }
}

export default App;
