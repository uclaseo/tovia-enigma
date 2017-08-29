import React, { Component } from 'react';
import { Card, CardTitle, CardActions } from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';
import Input from 'react-toolbox/lib/input';
import Dialog from 'react-toolbox/lib/dialog';
import axios from 'axios';

const minimumDate = new Date();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: '',
      date: '',
      passphrase: '',
      isDialogActive: false,
      encrypted: '',
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
        [item]: value,
      },
    );
  }

  handleDialogToggle() {
    this.setState(
      {
        isDialogActive: !this.state.isDialogActive,
      },
    );
  }


  clickEncrypt() {
    const data = {
      name: this.state.name,
      message: this.state.message,
      date: this.state.date,
    };
    const passphrase = this.state.passphrase;
    axios.post(`/encode/${passphrase}`, data)
    .then((res) => {
      this.setState({
        encrypted: res.data,
      });
    })
    .catch((error) => {
      console.log('error in clickEncrypt: ', error);
    });
  }
  clickDialogDecrypt() {
    const data = {
      encrypted: this.state.encrypted,
    };
    const passphrase = this.state.passphrase;
    axios.post(`/decode/${passphrase}`, data)
    .then((res) => {
      let expirationDate = JSON.stringify(res.data.date);
      expirationDate = new Date(JSON.parse(expirationDate));
      const currentDate = new Date();
      const isExpired = (currentDate >= expirationDate);
      if (isExpired) {
        /* global alert */
        alert('The message is expired');
      } else {
        this.setState({
          name: res.data.name,
          message: res.data.message,
          date: expirationDate,
        });
      }
    })
    .catch((error) => {
      console.log('error in clickDialogDecrypt: ', error);
      alert('The encrypted message or passphrase is invalid');
    });
    this.handleDialogToggle();
  }

  generatePassphrase() {
    this.setState({
      passphrase: Math.random().toString(36).slice(-8),
    });
  }


  render() {
    const dialogButtons = [
      { label: 'Close', onClick: this.handleDialogToggle.bind(this) },
      { label: 'Decrypt', onClick: this.clickDialogDecrypt.bind(this) },
    ];
    return (
      <div>
        <Card style={{ width: '350px' }}>
          <CardTitle
            title="Tovia's Enigma"
            subtitle="encrypt/decrypt your message!"
          />
          <Input
            type="text"
            label="Name"
            name="name"
            onChange={this.handleChange.bind(this, 'name')}
            value={this.state.name}
          />
          <Input
            type="text"
            label="Message"
            name="message"
            multiline
            onChange={this.handleChange.bind(this, 'message')}
            value={this.state.message}
            maxLength={120}
          />
          <DatePicker
            label="Expiration date"
            sundayFirstDayOfWeek
            minDate={minimumDate}
            onChange={this.handleChange.bind(this, 'date')}
            value={this.state.date}
          />
          <CardActions>
            <Button
              label="ENCRYPT"
              onClick={() => { this.clickEncrypt(); this.handleDialogToggle(); }}
            />
            <Dialog
              actions={dialogButtons}
              active={this.state.isDialogActive}
              onEscKeyDown={this.handleDialogToggle}
              onOverlayClick={this.handleDialogToggle}
              title="De/Encrypt"
            >
              <Input
                type="text"
                label="encrypted message"
                name="encryptedmessage"
                multiline
                onChange={this.handleChange.bind(this, 'encrypted')}
                value={this.state.encrypted}
              />
              <Input
                type="text"
                label="passphrase"
                name="passphrase"
                onChange={this.handleChange.bind(this, 'passphrase')}
                value={this.state.passphrase}
              />
            </Dialog>
            <Button label="DECRYPT" onClick={() => { this.handleDialogToggle(); }} />
          </CardActions>
        </Card>
        <p>Your Passphrase - {this.state.passphrase}</p>
        <Button onClick={this.generatePassphrase}>Generate New Passphrase</Button>
      </div>
    );
  }
}
