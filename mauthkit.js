"use strict"

class mk {
    constructor() {
        // CONSTANTS
        this._burl = 'https://authorize.music.apple.com/woa'
        this._window = null;

        // APP INFO
        this._dt = null; //Developer token
        this._n = null; //Name of app
        this._i = null; //Icon URL
        this._r = null; //referrer URL
        this._c = false; //Configured
        this._oA = () => {}; //onAuthorize
        this._oC = () => {}; //onClose
        this._oD = () => {}; //onDecline
        this._oS = () => {}; //onSwitchUserId
        this._oT = () => {}; //onThirdPartyInfo
        this._oU = () => {}; //onUnavailable
        this._oM = () => {}; //onMessage
    }

    configure(
        j = {developerToken: undefined, app: {name: undefined, icon: undefined}, events: {onAuthorize: () => {}, onClose: () => {}, onDecline: () => {}, onSwitchUserId: () => {}, onThirdPartyInfo: () => {}, onUnavailable: () => {}, onMessage: () => {}}} //JSON object
    ) {
        if (j === undefined) throw new Error('MauthKit: Cannot configure without a JSON object.');
        if (j.developerToken === undefined) throw new Error('MauthKit: Cannot configure without a developer token.');
        if (typeof j.developerToken !== 'string') throw new Error('MauthKit: Developer token must be a string.');
        if (j.app === undefined) throw new Error('MauthKit: Cannot configure without an app configuration.');
        if (typeof j.app !== 'object') throw new Error('MauthKit: App configuration must be an object.');
        if (j.app.name === undefined) throw new Error('MauthKit: Cannot configure without an app name.');
        if (typeof j.app.name !== 'string') throw new Error('MauthKit: App name must be a string.');

        this._dt = j.developerToken;
        this._n = j.app.name;
        this._i = j.app.icon !== undefined ? j.app.icon : '';
        this._r = j.referrer !== undefined ? j.referrer : window.location.href;
        if (j.events !== undefined) {
            if (j.events.onAuthorize !== undefined && typeof j.events.onAuthorize === 'function') this._oA = j.events.onAuthorize;
            if (j.events.onClose !== undefined && typeof j.events.onClose === 'function') this._oC = j.events.onClose;
            if (j.events.onDecline !== undefined && typeof j.events.onDecline === 'function') this._oD = j.events.onDecline;
            if (j.events.onSwitchUserId !== undefined && typeof j.events.onSwitchUserId === 'function') this._oS = j.events.onSwitchUserId;
            if (j.events.onThirdPartyInfo !== undefined && typeof j.events.onThirdPartyInfo === 'function') this._oT = j.events.onThirdPartyInfo;
            if (j.events.onUnavailable !== undefined && typeof j.events.onUnavailable === 'function') this._oU = j.events.onUnavailable;
            if (j.events.onMessage !== undefined && typeof j.events.onMessage === 'function') this._oM = j.events.onMessage;
        }
        this._c = true;
    }

    async authorize() {
        if (!this._c) throw new Error('MauthKit: Cannot authorize without configuring first.');
        this._window = this._openWindow();
        return new Promise((resolve) => {
            window.addEventListener('message', (e) => {
                let d = e.data;
                this._oM(d);
                switch (d.method) {
                    case 'authorize': {
                        this._oA(d);
                        let t = d.params[0];
                        let r = d.params[1] !== 0;
                        let c = d.params[2];
                        resolve({ accept: true, token: t, restricted: r, cid: c });
                        this._window.close();
                        break;
                    }
                    case 'close': {
                        this._oC(d);
                        break;
                    }
                    case 'decline': {
                        this._oD(d);
                        resolve({ accept: false });
                        this._window.close();
                        break;
                    }
                    case 'switchUserId': {
                        this._oS(d);
                        resolve({ accept: false });
                        break;
                    }
                    case 'thirdPartyInfo': {
                        this._oT(d);
                        this._window.postMessage({
                            id: d.id,
                            jsonrpc: d.jsonrpc,
                            result: this._getThirdPartyInfo()
                        }, '*');
                        break;
                    }
                    case 'unavailable': {
                        this._oU(d);
                        resolve({ accept: false });
                        break;
                    }
                }
            });
        });
    }

    _getThirdPartyInfo() {
        return JSON.stringify({
            thirdPartyIconURL: this._i,
            thirdPartyName: this._n,
            thirdPartyToken: this._dt
        })
    }

    _getEncodedThirdPartyInfo() {
        return btoa(this._getThirdPartyInfo())
    }

    _getParams() {
        let j = {
            a: this._getEncodedThirdPartyInfo(),
            r: this._r,
            app: 'music',
            p: 'subscribe'
        }
        return new URLSearchParams(j).toString()
    }

    _getURL() {
        return `${this._burl}?${this._getParams()}`
    }

    _genWindowParams() {
        let p = {
            width: 650,
            height: 650,
            top: (screen.height - 650) / 2,
            left: (screen.width - 650) / 2,
            menubar: 'no',
            resizable: 'no',
            scrollbars: 'no',
            status: 'no',
            toolbar: 'no'
        }
        return Object.keys(p).map(k => `${k}=${p[k]}`).join(',')
    }

    _openWindow() {
        return window.open(this._getURL(), 'apple-music-service-view', this._genWindowParams())
    }
}

const MauthKit = new mk();
window.dispatchEvent(new Event('mauthkit-loaded'));