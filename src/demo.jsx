import React, { Component } from 'fast-react-server';
import ReactRender from 'fast-react-render';

const Img = React.createClass({
    render: function () {
        console.log(this.props);
        return React.createElement('span', {}, this.props.text);
    }
});

class App extends Component {
    render() {
        return (
            <div>
              <Img src="hello"/>
            </div>
        );
    }
}

const html = ReactRender.elementToString(<App />);
console.log(html);
