import { useMount, useUnmount } from 'ahooks';
import * as Electron from 'electron';
import * as React from 'react';
import { useState } from 'react';
import { ReactComponent as SvgClose } from '../../Svgs/AppHead/CloseWindow.svg';
import { ReactComponent as SvgMax } from '../../Svgs/AppHead/MaxWindow.svg';
import { ReactComponent as SvgMin } from '../../Svgs/AppHead/MinWindow.svg';
import { ReactComponent as SvgTray } from '../../Svgs/AppHead/TrayWindow.svg';
import './AppHead.css';


export interface AppHeadProps {
    title: JSX.Element;
}


export function AppHead(props: AppHeadProps) {
    const [isMaximized, setIsMaximized] = useState(false);

    const callbackRef = React.useRef({
        onMaximize: () => {
            setIsMaximized(true);
        },

        onUnmaximize: () => {
            setIsMaximized(false);
        }
    });

    useMount(() => {
        if (window.require) {
            const electron = window.require('electron');
            const win = electron.remote.getCurrentWindow() as Electron.BrowserWindow;

            win.setFullScreenable(false);
            win.addListener('unmaximize', callbackRef.current.onUnmaximize);
            win.addListener('maximize', callbackRef.current.onMaximize);
        }
    });

    useUnmount(() => {
        if (window.require) {
            const electron = window.require('electron');
            const win = electron.remote.getCurrentWindow() as Electron.BrowserWindow;
            win.removeListener('unmaximize', callbackRef.current.onUnmaximize);
            win.removeListener('maximize', callbackRef.current.onMaximize);
        }
    });

    const btnExit = () => {

        const electron = window.require('electron');
        const win = electron.remote.getCurrentWindow();
        win.close();
    }

    const btnTray = () => {
        const electron = window.require('electron');
        const win = electron.remote.getCurrentWindow();
        win.minimize();
    }

    // win.setFullScreen разворачивает окно на весь экран 
    // win.setMaximizable разрешает или запрещает разворачивать окно на весь экран (окно без рамки)
    // win.setSimpleFullScreen  разворачивает окно на весь экран 

    const btnMaximize = () => {
        const electron = window.require('electron');
        const win = electron.remote.getCurrentWindow() as Electron.BrowserWindow;
        if (!isMaximized)
            win.maximize();
        else
            win.unmaximize();
    }


    return (
        <div className="drag-area">
            <div className="app-logo">
                {props.title}
            </div>

            <div className="no-drag-area">
                <button onClick={btnTray} className='app-head-button'>
                    <div className="app-head-icon-wrapper">
                        <SvgTray />
                    </div>
                </button>

                <button onClick={btnMaximize} className='app-head-button'>
                    <div className="app-head-icon-wrapper">
                        {isMaximized ?
                            (<SvgMin />) :
                            (<SvgMax />)
                        }
                    </div>
                </button>

                <button onClick={btnExit} className='app-head-button'>
                    <div className="app-head-icon-wrapper">
                        <SvgClose />
                    </div>
                </button>
            </div>
        </div>
    );
}
