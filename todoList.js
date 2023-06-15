import React, { Component } from 'react';
import './todoList.css';

class TodoList extends Component {
  constructor(props) {
    super(props);
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    this.state = {
      items: storedItems,
      currentItem: {text:'', key:'', inProgress: false, completed: false},
    };
    this.handleInput = this.handleInput.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setUpdate = this.setUpdate.bind(this);
    this.handleInProgressClick = this.handleInProgressClick.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
  }

  componentDidUpdate() {
    localStorage.setItem('items', JSON.stringify(this.state.items));
  }

  handleInput(e){
    this.setState({
      currentItem:{
        text: e.target.value,
        key: Date.now(),
        inProgress: false,
        completed: false
      }
    })
  }

  addItem(e){
    e.preventDefault();
    const newItem = this.state.currentItem;
    if(newItem.text !==""){
      const newItems = [...this.state.items, newItem];
      this.setState({
        items: newItems,
        currentItem: {text:'', key:'', inProgress: false, completed: false},
      })
    }
  }

  deleteItem(key){
    const filteredItems = this.state.items.filter(item => item.key !== key);
    this.setState({ items: filteredItems });
  }

  setUpdate(text, key){
    const items = this.state.items.map(item =>{
      if(item.key===key){
        return { ...item, text };
      } else {
        return item;
      }
    });
    this.setState({ items });
  }

  handleInProgressClick(key) {
    const items = this.state.items.map(item => {
      if (item.key === key) {
        return { ...item, inProgress: true, completed: false };
      } else {
        return item;
      }
    });
    this.setState({ items });
  }

  handleDoneClick(key) {
    const items = this.state.items.map(item => {
      if (item.key === key) {
        return { ...item, inProgress: false, completed: true };
      } else {
        return item;
      }
    });
    this.setState({ items });
  }

  render() {
    const newItems = [];
    const ongoingItems = [];
    const completedItems = [];

    this.state.items.forEach(item => {
      if (item.completed) {
        completedItems.push(item);
      } else if (item.inProgress) {
        ongoingItems.push(item);
      } else {
        newItems.push(item);
      }
    });

    return (
      <div className="todoListMain">
        <div className="header">
          <form onSubmit={this.addItem}>
            <input type="text" placeholder="New Task" 
              value={this.state.currentItem.text} 
              onChange={this.handleInput}/>
            <button type="submit">Add</button>
          </form>
        </div>
        <div className="list">
          <ul>
            <h2 className='newHeader'>New</h2>
            {newItems.map(item => (
              <div className={`item ${item.completed ? 'completed' : item.inProgress ? 'ongoing' : ''}`} key={item.key}>
                <li>
                  <input type="text" value={item.text} 
                    onChange={(e) => this.setUpdate(e.target.value, item.key)}
                  />
                  <button onClick={() => this.handleInProgressClick(item.key)}>In Progress</button>
                </li>
              </div>
            ))}
          </ul>
          <ul>
            <h2 className='OngoingHeader'>In Progress</h2>
            {ongoingItems.map(item => (
              <div className={`item ${item.completed ? 'completed' : item.inProgress ? 'ongoing' : ''}`} key={item.key}>
                <li>
                  <input type="text" value={item.text} 
                    onChange={(e) => this.setUpdate(e.target.value, item.key)}
                  />
                  <button onClick={() => this.handleDoneClick(item.key)}>Done</button>
                </li>
              </div>
            ))}
          </ul>
          <ul>
            <h2 className='completedHeader'>Done</h2>
            {completedItems.map(item => (
              <div className={`item ${item.completed ? 'completed' : item.inProgress ? 'ongoing' : ''}`} key={item.key}>
                <li>
                  <input type="text" value={item.text} readOnly={true} />
                  <button onClick={() => this.deleteItem(item.key)}>Delete</button>
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default TodoList;