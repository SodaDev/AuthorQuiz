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

var selectGame = function(){
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
data.selecttGame = selectGame;

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
    handleAddGame: function(){
        routie('add');
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
                <div className="row">
                    <div className="col-md-12">
                        <button onClick={this.handleAddGame} className="btn btn-block btn-primary">Add Game</button>
                    </div>
                </div>
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

function getRefs(component){
    var result = {};
    Object.keys(component.refs).forEach(function(refName){
        result[refName] = component.refs[refName].getDOMNode().value;
    });
    return result;
}

var AddGameForm = React.createClass({
    propTypes: {
        onGameFormSubmitted: React.PropTypes.func.isRequired
    },
    handleSubmit: function(){
        this.props.onGameFormSubmitted(getRefs(this));
        return false;
    },
    render: function(){
        return(
            <div className="row">
                <div className="col-md-12">
                    <h1>Add Game</h1>

                    <form role="form" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input ref="imageUrl" type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Answer 1</label>
                            <input ref="answer1" type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Answer 2</label>
                            <input ref="answer2" type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Answer 3</label>
                            <input ref="answer3" type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Answer 4</label>
                            <input ref="answer4" type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Save Game" className="btn btn-success"></input>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
});

function handleAddGameFormSubmitted(data){
    var quizData = [{
        imgUrl: data.imageUrl,
        books: [data.answer1, data.answer2, data.answer3, data.answer4]
    }];
    quizData.selectGame = selectGame;
    React.render(<Quiz data={quizData}/>, document.getElementById('container'));
}

routie({
   '': function(){
       React.render(<Quiz data={data}/>, document.getElementById('container'));
   },
   'add': function(){
       React.render(<AddGameForm onGameFormSubmitted={handleAddGameFormSubmitted}/>, document.getElementById('container'));
   }
});