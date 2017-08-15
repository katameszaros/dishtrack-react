import React from 'react';
import AddFishForm from './AddFishForm'

class Inventory extends React.Component{
    constructor(){
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e, key){
        const fish = this.props.fishes[key];
        // take a copy of that fish and update it with the new data
        const updatedFish = {
            ...fish,
            [e.target.name]: e.target.value
        }
        this.props.updateFish(key, updatedFish);
    }

    renderInventory(fish){
        return(
            <div className="fish-edit" key={fish.id}>
                <input type="text" name="name" value={fish.name} placeholder="Fish Name"
                onChange={(e) => this.handleChange(e, fish.id)}/>
                <input type="text" name="price" value={fish.id} placeholder="Fish Id"
                onChange={(e) => this.handleChange(e, fish.id)}/>
                <textarea type="text" name="desc" placeholder="Fish Desc" value={fish.description}
                onChange={(e) => this.handleChange(e, fish.id)} ></textarea>
                <button onClick={()=> this.props.removeFish(fish.id)}> Remove fish! </button>
            </div>
        )
    }


    render(){
        //This is a comment
        return(
            <div>
                <h2>Inventory</h2>
                {this.props.fishes.map(function(fish){
                    console.log(this.renderInventory(fish));
                })}
                {/*Now we have to send this to addFishForm*/}
                <AddFishForm addFish = {this.props.addFish}/>
                <button onClick={this.props.loadSamples}> Load Sample Fishes </button>
            </div>
        )
    }
}

export default Inventory;