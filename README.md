JustLight Theme for webtrees
============================

[![Latest Release](https://img.shields.io/github/release/JustCarmen/justlight.svg)][1]
[![webtrees major version](https://img.shields.io/badge/webtrees-v2.x-green)][2]
[![Downloads](https://img.shields.io/github/downloads/JustCarmen/justlight/total.svg)]()

A light theme in white and blue with focus on readibility. It uses a full screen where neccessary but takes into account small screens too. Since webtrees 1 this theme is optimized for using on tablets and mobile phones. Webtrees 2 has implemented that by default now, but this theme still offer a different layout with some extra's. If you like a clean layout you certainly want to try this theme.

Introduction
-----------
This is a modern theme in clean white and blue. Originally it was designed to give the user a better experienced on touch devices like tablets and mobile phones. To achieve this we use the Bootstrap framework in this theme.

Webtrees didn't ignore the success of this theme and recognized the need to upgrade the core to meet nowadays user demands. And I am glad they did. Webtrees 2 has adopted the same Bootstrap framework and works smootly now on mobile phones and tablets.

Is this theme become superflous now? No! It still has enough fans to make it worth upgrading. At the end it is all a matter of taste.

Since the core code has changed a lot I've made some concessions. Webtrees 2 required a complete rewrite of this theme and for sake of simplicity the theme option module will not return. If there is a lot of need for special options I might consider implementing them in this theme later.

Installation and upgrading
--------------------------
For more information about these subjects go to the JustCarmen help pages: http://www.justcarmen.nl/help. You will find there other tips as well. Please note: the website has not been updated for webtrees 2 yet. But installing the theme should be straightforward.

Development
-------------------------
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
[2]: https://webtrees.net/download/
[3]: https://github.com/JustCarmen/webtrees-theme-justlight/issues?state=open