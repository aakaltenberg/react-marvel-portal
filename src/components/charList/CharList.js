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
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount(){
        this.onRequest();
    }

    onRequest(offset){
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9){
            ended = true;
        }

        this.setState(({offset, charList}) => (
            {
                loading: false,
                newItemLoading: false,
                charList: [...charList, ...newCharList],
                offset: offset + 9,
                charEnded: ended
            }
        ))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    renderItems(charList){
            const items = charList.map(char => {
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

            return (
                    <ul className="char__grid">
                        {items}
                    </ul>
            )
    }


    render(){
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => this.onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )}
}

const View = ({charList}) => {

}

export default CharList;