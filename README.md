JustLight Theme for webtrees
============================

[![Latest Release](https://img.shields.io/github/release/JustCarmen/webtrees-theme-justlight.svg)][1]
[![webtrees major version](https://img.shields.io/badge/webtrees-v2.0.x-green)][2]
[![Downloads](https://img.shields.io/github/downloads/JustCarmen/webtrees-theme-justlight/total.svg)]()

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=XPBC2W85M38AS&item_name=webtrees%20modules%20by%20JustCarmen&currency_code=EUR)

Introduction
-----------
A light theme with focus on readability. It uses a full screen where necessary but takes into account small screens too. This theme is optimized for using on tablets and mobile phones. Furthermore this theme offers different layouts with some extra's. If you like a clean layout you certainly want to try this theme.

As of version 2.1.0, a new color palette has been introduced. Currently there are two palettes to choose from. The standard JustLight as you are used to and a new JustBlack theme which is a dark theme and looks a lot like the former independent JustBlack theme.

The JustLight palette is a modern theme in clean white and blue. The JustBlack palette is a theme with a dark background and orange accents. This palette is more relaxing for the eyes.

Installation and upgrading
--------------------------
Installing or upgrading the theme should be straightforward. Unzip the release package and place the jc-theme-justlight folder inside modules_v4 folder of your webtrees installation. If you need to upgrade an existing installation replace the module folder inside the modules_v4 folder with the new one.

Configuration
-------------
Go to the theme section in the control panel. The JustLight theme has a small configuration page where you can set the default color palette and specify whether the user can choose their own palette. In this case, an additional 'palette' menu is created.

Translation
-----------
The text on the configuration page is translatable. Copy the file nl.php into the resources/lang folder and replace the Dutch text with the translation into your own language. Use the official two-letter language code as file name. Look in the webtrees folder resources/lang to find the correct code.

Development
-----------
The JustLight theme is based on the Bootstrap framework and uses Sass to code the stylesheets. Composer and npm are required to generate the stylesheets.

If you wish to contribute, or create your own version of the JustLight theme please follow the steps below.

- Clone the repository to your local machine
- Install the Composer dependencies and run in dev mode to be able to generate the stylesheets. The fisharebest/webtrees package is explicitly set to use sources to be able to generate the stylesheets, do not override that setting.
- Then install the node dependencies and run in dev mode to be able to generate the stylesheets.

Before building, make sure that the fisharebest/webtrees package is in the correct target webtrees version using the command 'composer show fisharebest/webtrees'. When ready to generate the stylesheets, run the command 'npm run production'.

Bugs and feature requests
-------------------------
If you experience any bugs or have a feature request for this theme you can [create a new issue][3].

[1]: https://github.com/JustCarmen/webtrees-theme-justlight/releases/latest
[2]: https://webtrees.net/download
[3]: https://github.com/JustCarmen/webtrees-theme-justlight/issues?state=open
