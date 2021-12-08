import * as React from 'react';
import { FetchData } from '../../Components/FetchData';
import './Home.css';


export class Home extends React.Component {
    static displayName = Home.name;

    render() {
        return (
            <div className="home-page">
                <h1>Hello world</h1>
                <FetchData />
            </div>
        );
    }
}
