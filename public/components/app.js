import React, {Component} from 'react';

// card (structure)
import {Card, CardMedia, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card';
import {Button} from 'react-toolbox/lib/button';

// date 
import DatePicker from 'react-toolbox/lib/date_picker';
const currentDate = new Date();

// input fields(name, message)
import Input from 'react-toolbox/lib/input';



export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: ''
    };
  }

  handleChange(item, value) {
    this.setState(
      {
        ...this.state,
        [item]: value
      }
    );
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
            <Button label="ENCRYPT" />
            <Button label="DECRYPT" />
          </CardActions>
        </Card>

        
      </div>
    )
  }
};
