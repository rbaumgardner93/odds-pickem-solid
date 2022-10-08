/* @refresh reload */
import { render } from 'solid-js/web';

import { getData } from "./api/getData";
import './index.css';
import App from './App';

const gameData = await getData();

render(() => <App gameData={ gameData } />, document.getElementById('root'));
