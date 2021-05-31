const admin = Vue.createApp({
  data() {
    return { 
      apiUrl:'https://vue3-course-api.hexschool.io',
      apiPath:'bustour',
      // cookiename: "OnlineBusTour",
      currency: "日元",
      products: [],
      isLoggedIn: false,
      addProductFormShow: false,
      editProductFormShow: false,
      emptyUser:{
      },
      tempProduct:{},
      emptyProduct:{
        category: "",
        content: "",
        description: "",
        id: "",
        is_enabled: 1,
        origin_price: 0,
        price: 0,
        title: "",
        unit: "",
        num: 0,
        imageUrl : "",
      },
      errMsg:[],
    }
  },
  methods: {
    checkLogin: function(){ 
      axios.post(`${this.apiUrl}/api/user/check`)
      .then((res) => {
        if(res.data.success){
            console.log(res.data);
            this.getProductAdmin();
        } else {
          console.log(res.data);
        };
      })
      .catch((err) => {
        console.log(err);
      });
    },
    getProductAdmin: function(){
      this.products = [];
      axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
      .then((res) => {
          console.log(res.data.products)
          res.data.products.forEach((product) => {
            this.products.push(product)
          });
          console.log(this.products)
      })
      .catch((err) => {
        console.log(err.response.data);
        this.error();      
      });
    },
    showAddProductForm: function(){
      this.addProductFormShow = true;
      Object.assign(this.tempProduct, this.emptyProduct);
    },
    hideAddProductForm: function(){
      this.addProductFormShow = false;
    },
    addProduct: function(){
			axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/product`, {
				data: {
					title: this.tempProduct.title, 
					category: this.tempProduct.category,
					origin_price: this.tempProduct.origin_price,
					price: this.tempProduct.price,
					unit: this.tempProduct.unit,
					description: this.tempProduct.description,
					content: this.tempProduct.content,
					imageUrl: this.tempProduct.imageUrl,
				}
			})
			.then((res) => {
        if(res.data.success){
          this.tempProduct = {};
          this.hideAddProductForm();
          this.getProductAdmin();  
        }else{
          res.data.message.forEach((msg)=>{
            this.errMsg.push(msg)
          })
        }
			})
			.catch((err) => {
				console.log(err.response.data);
			});
    },
    getEditProduct: function(item){
      this.products.forEach((product) => {
        if(product.id === item.id){
          Object.assign(this.tempProduct, product);
        }
      })
      this.editProductFormShow = true;
    },
    hideEditProductForm(){
      this.tempProduct = {};
      this.editProductFormShow = false;
    },
    editProduct: function(){
      console.log(this.tempProduct.id)
      axios.put(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`, {
				data: {
					title: this.tempProduct.title, 
					category: this.tempProduct.category,
					origin_price: this.tempProduct.origin_price,
					price: this.tempProduct.price,
					unit: this.tempProduct.unit,
					description: this.tempProduct.description,
					content: this.tempProduct.content,
					imageUrl: this.tempProduct.imageUrl,
				}
			})
			.then((res) => {
        if(res.data.success){
          console.log(res);
          this.tempProduct = {};
          this.hideEditProductForm();  
          this.getProductAdmin();
        }else{
          res.data.message.forEach((msg)=>{
            this.errMsg.push(msg)
          })
        }
			})
			.catch((err) => {
				console.log(JSON.stringify(err))
			});
    },
    deleteProduct: function(productid){
			console.log("delete product: ", productid)
			axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${productid}`)
			.then((res) => {
        console.log(res.data);
        if(res.data.success){
          this.getProductAdmin();
        }else{
          console.log(res.data);
        }
			})
			.catch((err) => {
				console.log(err.response.data);
			});
    },
    // adminLogout: function (){
		// 	axios.post(`${this.apiUrl}/logout/`)
		// 	.then((res) => {
		// 		console.log(res.data)
		// 		if(res.data.success){
    //       document.cookie = `OnlineBusTour = ; expires = ${new Date()}`;
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		console.log(err.response.data);
		// 	});
    // },
  },
  mounted(){
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)OnlineBusTour\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;

    this.checkLogin();
  }
})

admin.mount('#admin')