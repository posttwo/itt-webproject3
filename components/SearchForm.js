import React, { Component } from 'react';

export default class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    formSubmitted = event => {
        if(event.target.newsSource.value != "")
        {
            this.props.setNewsSource(event.target.newsSource.value)
        }

        event.preventDefault();
    }

    render() {
        return (
            <div>
                <div id="search">
                    <h3>Enter newsapi source</h3>
                    <form onSubmit={this.formSubmitted}>
                        <input name="newsSource" placeholder="News Source Name" type="text" />
                        <button>Update News</button>
                    </form>
                </div>
            </div>
        )
    }
}