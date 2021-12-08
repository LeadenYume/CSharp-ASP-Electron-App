import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppHead } from './Components/AppHead';
import { Home } from './Frames/Home';
import './index.css';


const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');



ReactDOM.render(
    <div className="yu-app-frame">
      <AppHead title={<div>Electron app!</div>} />
      <div className="main-frame">
        <Home />
      </div>
    </div>,
  rootElement);

