import { createStore,applyMiddleware } from 'redux';
import { Dishes } from './dishes';
import { Comments } from './comments';
import { Promotions } from './promotions';
import { Leaders } from './leaders';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { InitialFeedback } from './forms';
import { favorites } from './favorites';
import {persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

export const ConfigureStore = () => {
    const config = {
	key: 'root',
	storage,
	debug: true
    };

    const store = createStore(
	persistCombineReducers(config, {
	    dishes:Dishes,
	    comments:Comments,
	    promotions:Promotions,
	    leaders:Leaders,
	    favorites:favorites
	}),
	applyMiddleware(thunk,logger)
    );

    const persistor = persistStore(store);

    return {persistor, store};
}
