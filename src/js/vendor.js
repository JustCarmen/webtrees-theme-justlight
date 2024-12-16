/* Just import the subset of icons that we use in:
- resources/views/icons
- resources/views/theme/script.js.phtml
- resources/views/layouts/body/navbar-toggler-secondary.phtml */
import { dom, library } from '@fortawesome/fontawesome-svg-core';
import {
  // Regular icons
  faCalendarDays, faUserCircle
} from '@fortawesome/free-regular-svg-icons';
import {
  // Solid icons (faTimes solid is part of webtrees core)
  faSquarePlus, faBell, faUser, faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faCalendarDays, faUserCircle
);
library.add(
  faSquarePlus, faBell, faUser, faEllipsisVertical
);
dom.watch();
