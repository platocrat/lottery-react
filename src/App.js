import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    // because we're adding the additional property to state in
    // 'this.setState({ manager, players })', we initialize the property
    // inside of this class instance here as an instance level property below.
    // Thus, players is an empty array to start off.
    players: [],
    balance: '',
    // text input will always be in string format
    value: '',
    message: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    // balance of the contract when someone wins the lottery
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance  });
  }

  // Making function called 'onSubmit' that is used to call the lottery
  // contract
  onSubmit = async event => {
    event.preventDefault();

    // Before directly calling the lottery contract 'sent' or 'enter' method
    // we have to get a list of our accounts.
    const accounts = await web3.eth.getAccounts();

    // creating a new piece of state...
    // if they submit the form and send a transaction, right before the
    // transaction is submitted, we'll give a message that says ;hey like we're
    // just handing on right now. Just give us a minute and in a little bit,
    // once the transaction goes through, we'll be able to say that you
    // were successfully entered.
    this.setState({ message: 'Waiting on transaction success...' });

    // this specific block of code below is what takes ~15s-30s to be processed
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!'});
  };

  // Defining the 'onClick' method
  // Getting a list of accounts
  // Telling the user that we're about to do something
  // Then send the transaction to the network.
  // After transaction is complete, we'll tell the user that a winner has been
  // picked.
  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiitng on transaction success...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
    // anything that 'getAccounts()' retreives will be automatically
    // logged to the console

    // Loudly declaring: <h2>Lottery Contract</h2> this is our lottery contract
    // Placing a little bit of info about the contract using the paragraph
    // tag with the text, 'This contract is managed by {this.state.manager}'

    // <h4> -- Specifies what exactly is going on with the form

    // onChange={event => this.setState({ value: event.target.value })}
    // ^this is an 'onChange' event handler that will be called any time
    // someone changes the text in the input

    // value={this.state.value}
    // Set the value of the input itself by specifying the above^

    // Horizontal divide = <hr> -- i.e., <hr> = a horizontal rule
    return (
     <div>
       <h2>Lottery Contract!</h2>
       <p>
         This contract is managed by {this.state.manager}.
         There are currently {this.state.players.length} people entered,
         competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
       </p>

       <hr />

       <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
       </form>

       <hr />

       <hr />

       <h4>Ready to pick a winner?</h4>
       <button onClick={this.onClick}>Pick a winner!</button>

       <h1>{this.state.message}</h1>
     </div>
    );
  }
}

export default App
