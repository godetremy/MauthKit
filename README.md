<p style="text-align: center"><img src="https://socialify.git.ci/godetremy/MauthKit/image?description=1&amp;font=Raleway&amp;forks=1&amp;issues=1&amp;language=1&amp;name=1&amp;owner=1&amp;pattern=Plus&amp;pulls=1&amp;stargazers=1&amp;theme=Auto" alt="project-image"></p>

## 🔍 Overview

MauthKit is a library that allows you to authenticate users with Apple Music. It is a simplified version of the MusicKit
JS library and there [authorization workflow](https://github.com/godetremy/Apple-Music-authorization-workflow). MauthKit
is a simple and easy-to-use library that allows you to authenticate users with Apple Music in just a few lines of code.

## ❗️ Required

To use the Apple Music authorization workflow, you need :

- A developer token for Apple Music. You can learn
  more [here](https://developer.apple.com/documentation/applemusicapi/generating_developer_tokens)

## 🚀 Usage/Examples

```html

<script src="https://cdn.jsdelivr.net/gh/godetremy/MauthKit/mauthkit.min.js" async></script>
<script>
    window.addEventListener('mauthkit-loaded', () => {
        MauthKit.configure({
            developerToken: 'your_dev_token',
            app: {
                name: 'your_app_name',
                icon: 'your_app_icon_url'
            }
        })
    })
</script>

<button onclick="MauthKit.authorize()">Authorize with Apple Music</button>
```

## 🔧 Methods

### Configure
Configure the MauthKit library with your developer token and app information.

#### Parameters
| Name                      | Type     | Description                                                                                                                         | Default                |
|---------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------|------------------------|
| developerToken            | string   | Your developer token. You can learnmore [here](https://developer.apple.com/documentation/applemusicapi/generating_developer_tokens) | **REQUIRED**           |
| app                       | object   | Application details                                                                                                                 | **REQUIRED**           |
| app > name                | string   | Application name used in the authorization window                                                                                   | **REQUIRED**           |
| app > icon                | string   | Application icon url used in the authorization window                                                                               | null                   |
| referrer                  | string   | Actual window location                                                                                                              | `window.location.href` |
| events                    | object   | Events object.                                                                                                                      | {}                     |
| events > onAuthorize      | function | Function called when the user is authorized.                                                                                        | (data) => {}           |
| events > onClose          | function | Function called when the authorization window is closed.                                                                            | (data) => {}           |
| events > onDecline        | function | Function called when the user declines the authorization.                                                                           | (data) => {}           |
| events > onSwitchUserId   | function | Function called when the user switches the Apple Music account.                                                                     | (data) => {}           |
| events > onThirdPartyInfo | function | Function called when the authorization window request third party info.                                                             | (data) => {}           |
| events > onUnavailable    | function | Function called when the authorization window send unavailable.                                                                     | (data) => {}           |
| events > onMessage        | function | Function called when the authorization window sends a message.                                                                      | (data) => {}           |

### Authorize
Open the authorization window. This is an asynchronous function that returns a promise.

#### Returns
**User accept**
```javascript
{
    accept: true, // User accepted the authorization
    token: "Ap34...==", // User token
    restricted: true, // Is the user restricted
    cid: undefined // User cid (unkown, but returned in MusicKit JS)
}
```
**User decline**
```javascript
{
    accept: false, // User declined the authorization
}
```

## 🗣️ Events
### mauthkit-loaded
This event is called when the MauthKit library is loaded.

## 📝 Contribution
Contributions are always welcome! Please keep the following in mind:
- Use one letter or two variable for size optimization. Make a comment to explain the variable.
- Made a pull request with a clear title and description.
- Make sure your code is well tested.