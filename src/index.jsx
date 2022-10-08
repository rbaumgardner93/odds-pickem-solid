/* @refresh reload */
import { render } from 'solid-js/web';

import { getData } from "./api/getData";
import './index.css';
import App from './App';

const { mergedData, scoreData } = await getData();

render(() => <App gameData={ mergedData } scoreData={ scoreData } />, document.getElementById('root'));
