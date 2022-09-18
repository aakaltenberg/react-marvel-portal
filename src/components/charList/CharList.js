import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
    constructor(props){
        super(props);
    }

    state = {
        charList: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount(){
        this.loadCharList();
    }

    onCharListLoaded = (charList) => {
        this.setState({
            loading: false,
            charList: charList.map(char => {
                const {id, name, thumbnail} = char;
                let imgStyle = {'objectFit': 'cover'}
                if(char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'){
                    imgStyle = {'objectFit' : 'contain'};
                }
                return (
                    <li 
                    className="char__item char__item_selected" 
                    key={id}
                    onClick={() => this.props.onCharSelected(id)}>
                        <img src={thumbnail} alt={name} style={imgStyle}/>
                        <div className="char__name">{name}</div>
                    </li>
                )
            })
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    loadCharList(){
        this.marvelService.getAllCharacters()
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }

    render(){
        const {charList, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View charList={charList}></View> : null;
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )}
}

const View = ({charList}) => {
    return (
        <ul className="char__grid">{charList}
        </ul>
    )
}

export default CharList;