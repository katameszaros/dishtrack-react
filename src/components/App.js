import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component{
    constructor(){
        super();
        this.addFish = this.addFish.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.removeFish = this.removeFish.bind(this);
        this.removeFromOrder = this.removeFromOrder.bind(this);
        this.getFunction = this.getFunction.bind(this);

        //getinitialState
        this.state = {
            fishes: [],
            order: {},
            data: [],
            products: []
        };

        var that = this;
        
        this.ApiCall().then( function(r){
            that.setState({fishes:r});

        });
    }


    ApiCall() {

        let result = new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open("GET", "http://localhost:8080/products/getproducts");
            request.onreadystatechange = () => {
                let raw = request.responseText;
                if (request.readyState==4 && request.status==200) {
                    try {
                        let objectified = JSON.parse(raw);
                        console.log(objectified);
                        resolve(objectified);
                    } catch(er) {
                        console.log("failed")
                    }
                }
            };
            request.send();
        });
        return result;

    }

    ApiSend(fish){
        console.log("This is the fish: ");
        console.log(fish);
            let result = new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open("POST", "http://localhost:8080/products/addproduct");
            request.onreadystatechange = () => {
                let raw = request.responseText;
                if (request.readyState==4 && request.status==200) {
                    try {
                        let objectified = raw;
                        resolve(objectified);
                    } catch(er) {
                        console.log("failed")
                    }
                }
            };
            console.log("Fish details name: " + fish.name);
            request.send(JSON.stringify({ name: fish.name, description: fish.description,
            image: fish.image, price: fish.price  }));
        });
        return result;


}

    componentDidMount()
         {
           this.getFunction();
         }

     getFunction = () => {
         return this.ApiCall().then(r => r);
     }



    componentWillMount(){
        // this runs right before the app is rendered
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`
        ,{
            context: this,
            state: 'fishes'
        });

        //check if there is any order in localStorage
        const localStorageRef= localStorage.getItem(`order-${this.props.params.storeId}`);
        if(localStorageRef) {
            //update our app component's order state
            this.setState({
                order: JSON.parse(localStorageRef)

            })
        }
    }

    componentWillUnmount(){
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProps, nextState){
        localStorage.setItem(`order-${this.props.params.storeId}`,
        JSON.stringify(nextState.order))
    }

    addFish(fish){
        console.log("WHAAAAT!?");
        console.log(fish);
        // takes a copy of the existing fishes
        const fishes = {...this.state.fishes};
        //adds the new fish
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        //updates fishes
        this.setState({fishes : fishes});
        this.ApiSend(fish).then(function(param){
            console.log(param);
        });
    }


    updateFish(key, updatedFish){
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({fishes});
    }

    removeFish(key){
        const fishes = {...this.state.fishes};
        fishes[key] = null;
        this.setState({fishes});
    }


    addToOrder(key){
        // takes a copy of the existing fishes
        const order = {...this.state.order};
        //update or add the new number of fish ordered
        order[key] = order[key] + 1 || 1;
        //updates orders state
        this.setState({order : order});
    }

    removeFromOrder(key){
        const order = {...this.state.order};
        delete order[key];
        this.setState({order});
    }

    render(){
        //This is a comment
        return(
            <div className="catch-of-the-day">
                {/*Hello*/}
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {
                            Object.keys(this.state.fishes)
                               .map(key => <Fish key={key} index={key} 
                               details={this.state.fishes[key]} 
                               addToOrder={this.addToOrder}/>)    
                        }
                    </ul>
                </div>
                <Order 
                    fishes={this.state.fishes}
                    order={this.state.order}
                    params={this.props.params}
                    removeFromOrder={this.removeFromOrder}
                    getFunction={this.getFunction}
                    />
                {/*We have to send this to Inventory*/}
                <Inventory addFish={this.addFish}
                 fishes={this.state.fishes}
                 updateFish = {this.updateFish}
                 removeFish = {this.removeFish}
                 />   
            </div>
        )
    }
}

export default App;