import React, {Component} from 'react';
import axios from 'axios';

// card (structure)
import {Card, CardMedia, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card';
import {Button} from 'react-toolbox/lib/button';

// date 
import DatePicker from 'react-toolbox/lib/date_picker';
const currentDate = new Date();

// input fields(name, message)
import Input from 'react-toolbox/lib/input';

// dialog
import Dialog from 'react-toolbox/lib/dialog';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: '',
      date: '',
      passphrase: '',
      isDialogActive: false,
      encrypted: ''
    };
    this.handleDialogToggle = this.handleDialogToggle.bind(this);
    this.generatePassphrase = this.generatePassphrase.bind(this);
    this.clickEncrypt = this.clickEncrypt.bind(this);
    this.clickDialogDecrypt = this.clickDialogDecrypt.bind(this);
  }

  componentDidMount() {
    this.generatePassphrase();
  }
  

  handleChange(item, value) {
    this.setState(
      {
        ...this.state,
        [item]: value
      }
    );
  }

  handleDialogToggle() {
    this.setState(
      {
        isDialogActive: !this.state.isDialogActive
      }
    );
  }

  dialogButtons = [
    {label: "Close", onClick: this.handleDialogToggle.bind(this)},
    {label: "Decrypt", onClick: this.clickDialogDecrypt.bind(this)}
  ]

  clickEncrypt() {
    let data = {
      name: this.state.name,
      message: this.state.message,
      date: this.state.date,
    }
    let passphrase = this.state.passphrase;
    axios.post(`/encode/${passphrase}`, data)
    .then((res, req) => {
      this.setState({
        encrypted: res.data
      })
    })
    .catch((error) => {
      console.log('error in clickEncrypt occured', error);
    })
  }
  clickDialogDecrypt() {
    let data = {
      encrypted: this.state.encrypted
    };
    let passphrase = this.state.passphrase;
    axios.post(`/decode/${passphrase}`, data)
    .then((res, req) => {
      this.setState({
        message: res.data
      });
    })
    .catch((error) => {
      console.log(error);
    })
    this.handleDialogToggle();
  }

  generatePassphrase() {
    this.setState({
      passphrase: Math.random().toString(36).slice(-8)
    })
  }


  render() {
    return (
      <div>
        <Card style={{width: '350px'}}>
          <CardTitle
            title="Tovia's Enigma"
            subtitle="encrypt/decrypt your message!"
          />
          <Input
            type='text'
            label='Name'
            name='name'
            onChange={this.handleChange.bind(this, 'name')}
            value={this.state.name}
          />
          <Input
            type='text'
            label='Message'
            name='message'
            multiline
            onChange={this.handleChange.bind(this, 'message')}
            value={this.state.message}
            maxLength={120}
          />
          <DatePicker
            label='Expiration date'
            sundayFirstDayOfWeek
            minDate={currentDate}
            onChange={this.handleChange.bind(this, 'date')}
            value={this.state.date}
          />
          <CardActions>
            <Button label="ENCRYPT" onClick={() => {this.clickEncrypt(); this.handleDialogToggle()}} />
            <Dialog
              actions={this.dialogButtons}
              active={this.state.isDialogActive}
              onEscKeyDown={this.handleDialogToggle}
              onOverlayClick={this.handleDialogToggle}
              title='De/Encrypt'
            >
              <Input
                type='text'
                label='encrypted message'
                name='encryptedmessage'
                multiline
                onChange={this.handleChange.bind(this, 'encrypted')}
                value={this.state.encrypted}
              />
              <Input
              type='text'
              label='passphrase'
              name='passphrase'
              onChange={this.handleChange.bind(this, 'passphrase')}
              />
            </Dialog>
            <Button label="DECRYPT" onClick={() => {this.handleDialogToggle()}} />
          </CardActions>
        </Card>
        <p>Your Passphrase - {this.state.passphrase}</p>
        <p onClick={this.generatePassphrase}>Generate new Passphrase</p>
        
      </div>
    )
  }
};
