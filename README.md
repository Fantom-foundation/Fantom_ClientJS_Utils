# Fantom Ledger JS
The code implements JS Library for communication with Ledger Hardware Wallets.
This library is compatible with the
[https://github.com/Fantom-foundation/fantom-ledger](Fantom Nano Ledger Application).
Please follow instructions on the linked repository to deploy your copy
of the Fantom Ledger HW wallet application.

# How to use
Please note you absolutely have to use HTTPS for Fantom Ledger Application
communication suing this library. It utilizes U2F protocol to exchange
data between your browser and the Ledger hardware token and the U2F protocol
is available only if the origin of the web page uses secured channel.

You need to have the Fantom Ledger application installed on your Ledger
token to have the other side to communicate with. If you don't, Please
follow the Ledger manual and install your application. If not available,
you can deploy it directly from our GitHub repository.

[https://github.com/Fantom-foundation/fantom-ledger](Fantom Nano Ledger Application)

In this case you app will not have the correct signature and so the
Ledger device will always ask you for a permission before opening the app.

## Available Scripts

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles in production mode and optimizes the build for the best performance.
