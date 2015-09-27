var data = [
    {
        name: 'Mark Twain',
        imgUrl: 'img/authors/marktwain.jpg',
        books: ['The Adventures of Huckelberry Finn']
    },
    {
        name: 'Joseph Conrad',
        imgUrl: 'img/authors/josephconrad.PNG',
        books: ['Heart Of Darkness']
    },
    {
        name: 'J.K. Rowling',
        imgUrl: 'img/authors/jkrowling.jpg',
        books: ['Harry Potter and the Sorcerers Stone']
    },
    {
        name: 'Stephen King',
        imgUrl: 'img/authors/stephenking.jpg',
        books: ['Shining', 'IT']
    },
    {
        name: 'Charles Dickens',
        imgUrl: 'img/authors/charlesdickens.jpg',
        books: ['David Copperfield', 'A Tale of Two Cities']
    },
    {
        name: 'William Shakspeare',
        imgUrl: 'img/authors/williamshakespeare.jpg',
        books: ['Hamlet', 'Macbeth', 'Romeo and Juliet']
    }
];

data.selectGame = function(){
    var books = _.shuffle(this.reduce(function(collection, element){
        return collection.concat(element.books);
    }, [])).slice(0, 4);

    var answer = books[_.random(books.length-1)];

    return {
        books: books,
        author: _.find(this, function(author){
            return author.books.some(function(title){
                return title === answer;
            });
        }),
        checkAnswer: function(title){
            return this.author.books.some(function(t){
               return t===title;
            });
        }
    }
};

var Quiz = React.createClass({
    propTypes: {
        books: React.PropTypes.array.isRequired
    },
    getInitialState: function(){
        return _.extend({
            bgClass: 'result-neutral',
            showContinue: false
        }, this.props.data.selectGame());
    },
    handleBookSelected: function(title){
        var isCorrect = this.state.checkAnswer(title);
        this.setState({
            bgClass: 'result-' + isCorrect,
            showContinue: isCorrect
        });
    },
    handleContinue: function(){
        this.setState(this.getInitialState())
    },
    render: function(){
        var continueSection = this.state.showContinue ?
            (<div className="row">
                <div className="col-md-12">
                    <button onClick={this.handleContinue} className="btn btn-block btn-success">Continue</button>
                </div>
            </div>) : <span/>;
        return (
            <div>
                <div className="row">
                    <div className="col-sm-4">
                        <img src={this.state.author.imgUrl} className="img-responsive author-image"/>
                    </div>
                    <div className="col-sm-7">
                        {this.state.books.map(function(b){
                            return <Book onBookSelected={this.handleBookSelected} title={b} />;
                        }, this)}
                    </div>
                    <div className={"col-sm-1 " + this.state.bgClass}>

                    </div>
                </div>
                {continueSection}
            </div>
        )
    }
});

var Book = React.createClass({
    propTypes: {
        title: React.PropTypes.array.isRequired
    },
    handleClick: function(){
        this.props.onBookSelected(this.props.title);
    },
    render: function(){
        return <div onClick={this.handleClick} className="answer"><h4>{this.props.title}</h4></div>;
    }
});

React.render(<Quiz data={data}/>, document.getElementById('container'));