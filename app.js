var eventBus = new Vue();

Vue.component('product-tabs', {
    props:{
        reviews:{
            type:Array,
            required:true
        }
    },
    template:`
    <div>
        <span class="tab"
        v-bind:class="{ activeTab : selectedTab === tab }"
        v-for = "(tab,index) in tabs" :key="index"
        v-on:click="selectedTab = tab"
        >{{tab}}</span>
        <div v-show="selectedTab==='Reviews'">
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet</p>
            <ul>
            <li v-for="review in reviews">
                <p>Name : {{review.name}}</p>
                <p>Review : {{review.review}}</p>
                <p>Rating : {{review.rating}}</p>
                <p>reccomendation : {{review. recommend}}</p>
            </li>
            </ul>
        </div>
        <product-review  v-show="selectedTab==='Make a Review'" ></product-review>
    </div>
    
    `,
    data : function(){
        return {
            tabs:['Reviews', 'Make a Review'],
            selectedTab:"Reviews"
        }
    },
   
})

Vue.component("product-review", {
    template:`<form class="review-form" v-on:submit.prevent = "onSubmit" >
        <p v-if="errors.length">
            <b>please correct the following error(s)</b>
            <ul>
                <li v-for="error in errors" style="color:red" >{{error}}</li>
            </ul>
        </p>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name">
        </p>
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review" ></textarea> 
        </p>
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number = "rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>
        <p> 
            <input type="submit" value="Submit">
        </p>

    </form>`,
    data(){
        return {
            name:null,
            review:null,
            rating:null,
            recommend: null,
            errors:[],
        }
    },
    methods : {
        onSubmit(){
            if(this.name && this.review && this.rating && this.recommend){
                let productReview = {
                    name : this.name,
                    review : this.review,
                    rating : this.rating,
                    recommend : this.recommend,
                }
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.errors=[];
            }else{
                this.errors=[];
                if(!this.name) this.errors.push("enter correct name!");
                if(!this.review) this.errors.push("review field empty");
                if(!this.rating) this.errors.push("rating field empty");
                if(!this.recommend) this.errors.push("recommendation field empty");
            }
           
        }
    } 
})

Vue.component("product-details", {
    props:{
        details:{
            type : Array,
            required : true
        }
    },  
    template:`<ul>
        <li v-for = "detail in details">{{ detail }}</li>
    </ul>`
})

Vue.component('product', {
    props:{
        premium : {
            type : Boolean,
            required : true
        }
    },
    template:`<div>
        <div class="product">
        <div class="product-image">
            <img v-bind:src="image" alt="green-image">
        </div>
        <div class="product-info">
            <h1>{{title}}</h1>
            <h2>{{description}}</h2>
            <h3 v-if="onSale===true">{{isSaleLive}}</h3>
            <h3 style="color:green" v-show = "onSale">On Sale</h3>
            <p v-if="inventory <= 100 && inventory>10"
                v-bind:class="{outOfStock : !inStock}"
                >in stock</p>
            <p v-else-if="inventory <= 10 && inventory>=1" >almost sold out</p>
            <p v-else-if = "inventory===0">sold out</p>
            <p>User is premium : {{premium}}</p>
            <p>shipping:{{shipping}}</p>
            <product-details v-bind:details="details"></product-details>
            <ul>
                <li v-for="(variant, index) in variants" style="list-style: none;" 
                v-bind:key="variant.color"
                class="color-box"
                v-bind:style="{'background-color' : variant.color}"
                v-on:mouseover="updateProduct(index)"
                ></li>
            </ul>
        </div>
        <button v-on:click="updateCart('increment')"
            v-bind:disabled="!inStock"
            v-bind:class="{ disabledButton : !inStock }"
        >add to cart</button>
        <button v-on:click="updateCart('decrement')"
        >remove from cart</button>
    </div>  
   
    <div>
        <product-tabs v-bind:reviews="reviews"></product-tabs>
    </div>
    </div>`,
    data : function(){
        return {
            product : "Socks",
            brand : "Vue Masterful",
            description : "u can wear these socks to office",
            image1 : './photos/greenSocks.jpg',
            selectedVariant : 0,
            imageUrl : "https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg",
            inventory : 100,
            onSale : false,
            details : ["80% cotton", "20% polyster", "gender-neutral"],
            variants : [
                {
                    color:"green",
                    id:"2875",
                    variantImage:"./photos/greenSocks.jpg",
                    variantQuantity:10,
                    styleObject:{
                        backgroundColor : "green",
                        fontSize : "13px"
                    }
                },
                {
                    color:"blue",
                    id:"2876",
                    variantImage:"./photos/blueSocks.jpg",
                    variantQuantity:10,
                    styleObject:{
                        backgroundColor : "blue",
                        fontSize : "13px"
                    }
                },
            ],
            reviews : []
        }
    },
    methods : {
        updateCart : function (type){
            switch (type) {
                case "increment":
                    this.$emit('add-to-cart', this.variants[this.selectedVariant].id )
                    break;

                case "decrement":
                    this.$emit('remove-from-cart', this.variants[this.selectedVariant].id)
                    break;

                default:
                    break;
            }
        },
        updateProduct : function (index){
            console.log(index, this);
            this.selectedVariant = index;
        },
        
    },
    computed : {
        title : function(){
            return `${this.brand} ${this.product}`
        },
        image : function(){
            console.log("here");
            return this.variants[this.selectedVariant].variantImage
        },
        inStock : function(){
            console.log(this.variants[this.selectedVariant].variantQuantity);
            return this.variants[this.selectedVariant].variantQuantity;
        },
        isSaleLive : function(){
            return this.brand +" "+ this.product
        },
        shipping : function(){
            if(this.premium){
                return "free";
            }else{
                return "$2.99"
            }
        },
        mounted(){
            eventBus.$on('review-submitted', productReview => {
                this.reviews.push(productReview);
            })
        }

    }

})

const app = new Vue({
    el:'#app' ,
    data:{
        premium:false,
        cart:[],
    },
    methods:{
        updateCartPlus:function(id){
            this.cart.push(id);
        },
        updateCartMinus:function(id){
            if(this.cart.includes(id)){
                let index = this.cart.indexOf(id);
                this.cart.splice(index,1);
            }
        }
    }

});
         
