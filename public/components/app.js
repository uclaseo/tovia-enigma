import React, {Component} from 'react';
import DatePicker from 'react-toolbox/lib/date_picker';

const min_datetime = new Date();

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };

  }

  handleChange(item, value) {
    this.setState(Object.assign({}, {[item]: value}));
  }

  render() {
    return (
      <div>
        <DatePicker
          label='Expiration date'
          sundayFirstDayOfWeek
          minDate={min_datetime}
          onChange={this.handleChange.bind(this, 'date2')}
          value={this.state.date2}
        />
      </div>
    )
  }
};
